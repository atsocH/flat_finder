import React, { useState, useRef, useEffect, useContext } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { UserContext } from '../config/usercontex';
import { AuthContext } from '../config/authcontex';
import '../css/Login.css';

function Login() {
    const navigate = useNavigate();

    const userRef = useRef();
    const errRef = useRef();

    const usersCollectionRef = collection(db, "users");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMsg] = useState('');

    const { setIsAuthenticated } = useContext(AuthContext);
    const { setUser } = useContext(UserContext);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const auth = getAuth();
            await signInWithEmailAndPassword(auth, email, password);

            // Busca os usuários no Firestore
            const data = await getDocs(usersCollectionRef);
            const usersList = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

            // Encontra o usuário pelo email
            const findUser = usersList.find(user => user.email === email);

            if (!findUser) {
                setErrorMsg('Usuário não encontrado. Verifique o email e tente novamente.');
                setIsAuthenticated(false);
                return;
            }

            // Define o nome do usuário no contexto global
            setErrorMsg('');
            setUser(findUser.name);
            setIsAuthenticated(true);

            // Redireciona para a página inicial
            navigate('/');
        } catch (error) {
            console.error('Erro no login:', error);
            setErrorMsg('Email ou senha inválidos. Tente novamente.');
            setIsAuthenticated(false);
        }
    };

    return (
        <div className='login-container'>
            <form onSubmit={handleLogin}>
                <h1>Login</h1>
                <label>Email ou Username</label>
                <input
                    type="text"
                    ref={userRef}
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); }}
                />
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
                <br />
                <p>Já registou a sua conta?</p>
                <br />
                <button type="button" onClick={() => navigate('/register')}>Registo</button>
                <p ref={errRef} className="error-message">{errorMessage}</p>
            </form>
        </div>
    );
}

export default Login;



