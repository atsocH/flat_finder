import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, getDocs, query, where} from "firebase/firestore";
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
    const [errorMessages, setErrorMessages] = useState({});

    const navigate = useNavigate();
    const { setIsAuthenticated } = useContext(AuthContext);
    const { setUser, setUserID } = useContext(UserContext);

    const handleValidation = () => {
        const errors = {};
        if (!USER_REGEX.test(username)) errors.username = "O nome de utilizador deve ter entre 3 a 10 caracteres e começar com uma letra.";
        if (!EMAIL_REGEX.test(email)) errors.email = "Por favor insira um endereço de email válido.";
        if (!PWD_REGEX.test(password)) errors.password = "A palavra-passe deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, um número e um símbolo especial.";
        if (!NAME_REGEX.test(name)) errors.name = "O primeiro nome deve conter apenas letras.";
        if (!NAME_REGEX.test(lastName)) errors.lastName = "O último nome deve conter apenas letras.";
        setErrorMessages(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!handleValidation()) return;

        try {
            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;

            await addDoc(collection(db, "users"), {
                username,
                name,
                lastName,
                email,
                favorites: [],
                authUID: userId,
            });
            
            const usersCollection = collection(db, "users");
            const q = query(usersCollection, where("authUID", "==", userId));
            const querySnapshot = await getDocs(q);
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();

            setUser(userData.name);
            setUserID(userDoc.id);
            setIsAuthenticated(true);
            navigate('/');
        
        

            
        } catch (error) {
            console.error("Erro ao registar utilizador:", error.message);
            setErrorMessages({ firebase: "Ocorreu um erro ao tentar registar o utilizador. Tente novamente." });
        }
    };

    useEffect(() => {
        userRef.current.focus();
    }, []);

    return (
        <form onSubmit={handleSubmit} className="register-container">
            <h1>Registo</h1>

            <label>Nome de Utilizador:</label>
            <input
                type="text"
                ref={userRef}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            {errorMessages.username && <p className="error-message">{errorMessages.username}</p>}

            <label>Primeiro Nome:</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            {errorMessages.name && <p className="error-message">{errorMessages.name}</p>}

            <label>Último Nome:</label>
            <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
            />
            {errorMessages.lastName && <p className="error-message">{errorMessages.lastName}</p>}

            <label>Email:</label>
            <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            {errorMessages.email && <p className="error-message">{errorMessages.email}</p>}

            <label>Palavra-passe:</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            {errorMessages.password && <p className="error-message">{errorMessages.password}</p>}

            {errorMessages.firebase && <p className="error-message">{errorMessages.firebase}</p>}

            <button type="submit" className="reg-button">Registar</button>
            <p>Já tem uma conta?</p>
            <button
                type="button"
                className="log-button"
                onClick={() => navigate('/login')}
            >
                Login
            </button>
        </form>
    );
}

export default Register;