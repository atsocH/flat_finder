import { Link } from 'react-router-dom';
import { AuthContext } from '../config/authcontex';
import { UserContext } from '../config/usercontex';
import { useContext } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import '../css/Navbar.css';

export default function Navbar() {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
    const { setUser } = useContext(UserContext);

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUser('');
    };

    return (
        <nav className="navbar">
            <ul className="navbar-list">
                <li className="navbar-item">
                    <Link to='/' className="navbar-link">
                        Flat Finder
                    </Link>
                </li>
                <li className="navbar-item">
                    <Link to='/flats' className="navbar-link">
                        <HomeIcon /> Imóveis
                    </Link>
                </li>
                {isAuthenticated ? (
                    <>
                        <li className="navbar-item">
                            <Link to='/flatsform' className="navbar-link">
                                <AddBoxIcon /> Adicionar Imóveis
                            </Link>
                        </li>
                        <li className="navbar-item">
                            <Link to='/profile' className="navbar-link">
                                <AccountCircleIcon /> Perfil
                            </Link>
                        </li>
                        <li className="navbar-item">
                            <Link to='/' onClick={handleLogout} className="navbar-link">
                                <ExitToAppIcon /> Logout
                            </Link>
                        </li>
                    </>
                ) : (
                    <li className="navbar-item">
                        <Link to='/register' className="navbar-link">
                            <AccountCircleIcon /> Registar/Login
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}