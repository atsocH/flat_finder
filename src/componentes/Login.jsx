import React, { useState, useRef, useEffect, useContext } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { UserContext } from '../config/usercontex';
import { AuthContext } from '../config/authcontex';

function Login() {
    const navigate = useNavigate();

    const userRef = useRef();
    const errRef = useRef();
    
    const usersCollectionRef = collection(db, "users");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMsg] = useState('');

    const { setIsAuthenticated } = useContext(AuthContext);
    const { setUser} = useContext(UserContext)
  
    useEffect(() => {
        userRef.current.focus();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        const data = await getDocs(usersCollectionRef);
        const usersList = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

        const findUser = usersList.find(user => (user.email === email));
        const auth = getAuth();

            try { 
                await signInWithEmailAndPassword(auth, email, password);
                setErrorMsg('');
                navigate('/'); 
                setIsAuthenticated(true);
                setUser(findUser.name);
            
        } catch (error){
            setErrorMsg('Username ou password inválidos. Tente novamente.');
            setIsAuthenticated(false);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form>
                <label>Email ou Username</label>
                <input
                    type="text"
                    ref={userRef}
                    value={email}
                    onChange={(e) => {setEmail(e.target.value)}}
                />
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </form>
                <button onClick={handleLogin}>Login</button>
                <p>Já registou a sua conta?</p>
                <button onClick={() => navigate('/register')}>Registo</button>
            <p ref={errRef} style={{ color: 'red' }}>{errorMessage}</p>
        </div>
    );
}

export default Login;



