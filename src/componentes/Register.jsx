import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../config/firebase';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from '../config/authcontex';
import { UserContext } from '../config/usercontex';

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,10}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,1000}$/;
const NAME_REGEX = /^[a-zA-Z]+$/;


function Register() {

    const userRef = useRef();
    const nameRef = useRef();
    const emailRef = useRef();
    const lastNameRef = useRef();
    const passwordRef = useRef();
    const errRef = useRef();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [isValidName, setIsValidName] = useState(false);
    const [isValidUsername, setIsValidUsername] = useState(false);
    const [isValidPassword, setIsValidPassword] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [errorMessage, setErrorMsg] = useState('');
    

    const navigate = useNavigate();

    const { setIsAuthenticated } = useContext(AuthContext);
    const { setUser} = useContext(UserContext)

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        const v1 = isValidUsername;
        const v2 = isValidPassword;
        const v3 = isValidEmail;
        const v4 = isValidName;

        if (!v1 || !v2 || !v3 || !v4) {

                if (!v1) setUsername('');
                if (!v2) setPassword('');
                if (!v3) setEmail('');
                if (!v4) { 
                    setName('');
                    setLastName('');
                }
                setErrorMsg(
                    <ul>
                        {!v1 && <li>Username inválido. Lembre-se de usar de 3 a 10 caracteres.</li>}
                        {!v2 && <li>Password inválida. A sua password deve conter uma letra maiúscula, uma minúscula, um número e um caracter especial, devem também conter no mínimo 8 caracteres.</li>}
                        {!v3 && <li>E-mail inválido.</li>}
                        {!v4 && <li> Nome ou Último Nome inválidos. Lembre-se estes campos devem apenas conter letras.</li>}
                    </ul>
                );
        } else {
                addDoc(collection(db, "users"), {
                    username,
                    name,
                    lastName,
                    email,
                });

                const auth = getAuth();
                createUserWithEmailAndPassword(auth, email, password);
                setIsAuthenticated(true); 
                setUser(name)

                navigate("/");
            
        }
    };

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setIsValidUsername(USER_REGEX.test(username));
    }, [username]);

    useEffect(() => {
        setIsValidPassword(PWD_REGEX.test(password));
    }, [password]);

    useEffect(() => {
        setIsValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    useEffect(() => {
        setIsValidName(NAME_REGEX.test(name) && NAME_REGEX.test(lastName));
    }, [name, lastName]);

    return (
        <div>
            <h1>Registo</h1>
            <form onSubmit={handleSubmit}>
                <label>Username:</label>
                <input
                    type="text"
                    ref={userRef}
                    value={username}
                    className={isValidUsername ? '' : 'errorMessage'}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <label>Primeiro Nome:</label>
                <input
                    type="text"
                    ref={nameRef}
                    value={name}
                    className={isValidName ? '' : 'errorMessage'}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <label>Ultimo Nome:</label>
                <input
                    type="text"
                    ref={lastNameRef}
                    className={isValidName ? '' : 'errorMessage'}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
                <label>Email:</label>
                <input
                    type="text"
                    ref={emailRef}
                    value={email}
                    className={isValidEmail ? '' : 'errorMessage'}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label>Password:</label>
                <input
                    type="password"
                    ref={passwordRef}
                    value={password}
                    className={isValidPassword ? '' : 'errorMessage'}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Registar</button>
            </form>
            <p>Já tem a sua conta registada?</p>
            <button onClick={() => navigate('/login')}>Login</button>
            <p ref={errRef} style={{ color: 'red' }}>{errorMessage}</p>
        </div>
    );
}

export default Register;