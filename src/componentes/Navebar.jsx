import { Link } from 'react-router-dom';
import { AuthContext } from '../config/authcontex';
import { UserContext } from '../config/usercontex';
import { useContext } from 'react';
import '../css/Navbar.css';


export default function Navbar() {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
    const { setUser } = useContext(UserContext);

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUser(''); // Faz o logout
    };

    return (
        <nav>
            <ul>
                <li><Link to='/'>Home</Link></li>
                {isAuthenticated ? (
                    <>
                        <li><Link to='/flats'>Flats</Link></li>
                        <li>
                            <Link to='/' onClick={handleLogout}>Logout</Link>
                        </li>
                    </>
                ) : (
                    <li><Link to='/register'>Registar/Login</Link></li>
                )}
            </ul>
        </nav>
    );
}