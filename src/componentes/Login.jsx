import React, { useState, useRef, useEffect, useContext } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { UserContext } from '../config/usercontex';
import { AuthContext } from '../config/authcontex';
import '../css/Login.css';

function Login() {
    const navigate = useNavigate();
    const userRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { setIsAuthenticated } = useContext(AuthContext);
    const { setUser, setUserID } = useContext(UserContext);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    const validateInputs = () => {
        if (!email || !password) {
            setErrorMsg('Por favor, preencha todos os campos.');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setErrorMsg('Formato de email inválido.');
            return false;
        }
        return true;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        if (!validateInputs()) return;

        setIsLoading(true);
        try {
            const auth = getAuth();
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;

            const usersCollection = collection(db, "users");
            const q = query(usersCollection, where("authUID", "==", userId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const userData = userDoc.data();

                setUser(userData.name);
                setUserID(userDoc.id);
                setIsAuthenticated(true);
                navigate('/');
            
            }
        } catch (error) {
            console.error("Erro no login:", error);
                setErrorMsg('User não encontrado');
            
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin} className='login-container'>
            <h1>Login</h1>
            <label>Email</label>
            <input
                type="text"
                ref={userRef}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <label>Password</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Carregando...' : 'Login'}
                </button>
            </div>
            <p ref={errRef} className="error-message">{errorMessage}</p>
            <div>
                <p>Já registou a sua conta?</p>
            </div>
            <div>
                <button type="button" onClick={() => navigate('/register')}>Registo</button>
            </div>
        </form>
    );
}

export default Login;

