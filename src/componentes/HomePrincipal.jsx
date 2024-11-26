import React, { useContext } from 'react';
import Navbar from './Navebar';
import Filtros from './Filtros';
import '../css/HomePrincipal.css';
import { UserContext } from '../config/usercontex';

function HomePrincipal() {
    const {user} = useContext(UserContext)
    return (
        <div className="home-principal">
            <Navbar />
            <div className="welcome-section">
                <h1>Bem-vindo ao Flat Finder {user}!</h1>
                <p>Encontre o imóvel perfeito para si.</p>
            </div>
            <div className="filters-section">
                <Filtros />
            </div>
        </div>
    );
}

export default HomePrincipal;