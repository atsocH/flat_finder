import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../config/firebase';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from '../config/authcontex';
import { UserContext } from '../config/usercontex';
import '../css/Register.css';

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,10}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,1000}$/;
const NAME_REGEX = /^[a-zA-Z]+$/;

function Register() {

    const userRef = useRef();

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
    const { setUser } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        const v1 = isValidUsername;
        const v2 = isValidPassword;
        const v3 = isValidEmail;
        const v4 = isValidName;

        if (!v1 || !v2 || !v3 || !v4) {
            setErrorMsg(
                <ul>
                    {!v1 && <li>Username inválido. Lembre-se de usar de 3 a 10 caracteres.</li>}
                    {!v2 && <li>Password inválida. A sua password deve conter uma letra maiúscula, uma minúscula, um número e um caracter especial, devem também conter no mínimo 8 caracteres.</li>}
                    {!v3 && <li>E-mail inválido.</li>}
                    {!v4 && <li> Nome ou Último Nome inválidos. Lembre-se estes campos devem apenas conter letras.</li>}
                </ul>
            );
            return;
        }

        try {
            const auth = getAuth();
            await createUserWithEmailAndPassword(auth, email, password);

            // Criação do usuário no Firestore
            await addDoc(collection(db, "users"), {
                username,
                name,
                lastName,
                email,
            });

            setIsAuthenticated(true); 
            setUser(name);

            navigate("/");
        } catch (error) {
            console.error("Erro ao registrar usuário:", error);
            setErrorMsg("Ocorreu um erro ao criar a conta. Tente novamente mais tarde.");
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
        <form onSubmit={handleSubmit} className="register-container">
            <h1>Registo</h1>
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
                value={name}
                className={isValidName ? '' : 'errorMessage'}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <label>Ultimo Nome:</label>
            <input
                type="text"
                className={isValidName ? '' : 'errorMessage'}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
            />
            <label>Email:</label>
            <input
                type="text"
                value={email}
                className={isValidEmail ? '' : 'errorMessage'}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <label>Password:</label>
            <input
                type="password"
                value={password}
                className={isValidPassword ? '' : 'errorMessage'}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit" className="nav-button">Registar</button>
            <br />
            <p>Já tem a sua conta registada?</p>
            <br />
            <button
                type="button"
                className="nav-button"
                onClick={() => navigate('/login')}
            >
                Login
            </button>
            <p style={{ color: 'red' }}>{errorMessage}</p>
        </form>
    );
}

export default Register;