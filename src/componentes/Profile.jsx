import React, { useEffect, useState, useContext } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import Navbar from './Navebar';
import '../css/Profile.css';
import { UserContext } from '../config/usercontex';

function Profile() {
    const { userUID } = useContext(UserContext);
    const [favorites , setFavorites] = useState([]);
    const [userFlats, setUserFlats] = useState([]);
    const [favoriteFlats, setFavoriteFlats] = useState([]);
    const [userData, setUserData] = useState(null);
    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userUID) return;
            try {
                const userDocRef = doc(db, 'users', userUID);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const data = userDocSnap.data();
                    setUserData(data);
                    setNewFirstName(data.name || '');
                    setNewLastName(data.lastName || '');
                    setFavorites(Array.isArray(data.favorites) ? data.favorites : []);
                } else {
                    console.error('Usuário não encontrado.');
                }
            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
            }
        };

        fetchUserData();
    }, [userUID]);

    useEffect(() => {
        const fetchUserFlats = async () => {
            if (!userUID) return;
            try {
                const flatsCollection = collection(db, 'flats');
                const q = query(flatsCollection, where('userUID', '==', userUID));
                const flatsSnapshot = await getDocs(q);
                const flatsList = flatsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUserFlats(flatsList);
            } catch (error) {
                console.error('Erro ao buscar flats do usuário:', error);
            }
        };

        fetchUserFlats();
    }, [userUID]);

    useEffect(() => {
        const fetchFavoriteFlats = async () => {
            try {
                

                const userDocRef = doc(db, "users", userUID);
                const userDocSnapshot = await getDoc(userDocRef);

                if (!userDocSnapshot.exists()) {
                    console.error("Documento do user não encontrado.");
                    return;
                }

                const userFavorites = userDocSnapshot.data().favorites || [];
                console.log("Favoritos do user:", userFavorites);

                if (userFavorites.length === 0) {
                    setFavoriteFlats([]);
                    return;
                }

                const flatsCollection = collection(db, "flats");
                const q = query(flatsCollection, where("__name__", "in", userFavorites));
                const flatsSnapshot = await getDocs(q);

                const flatsFavoriteList = flatsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setFavoriteFlats(flatsFavoriteList);
            } catch (error) {
                console.error("Erro ao pesquisar imóveis favoritos:", error);
            }
        };

        fetchFavoriteFlats();
    }, [userUID]);

    const handleUpdateProfile = async () => {
        try {
            if (!newFirstName || !newLastName) {
                setErrorMessage('Preencha todos os campos obrigatórios.');
                return;
            }

            const userDocRef = doc(db, 'users', userUID);
            await updateDoc(userDocRef, {
                name: newFirstName,
                lastName: newLastName,
            });

            setSuccessMessage('Dados do perfil atualizados com sucesso.');
            setErrorMessage('');
        } catch (error) {
            console.error('Erro ao atualizar os dados do perfil:', error);
            setErrorMessage('Erro ao atualizar os dados do perfil. Tente novamente.');
        }
    };


    return (
        <div className="profile-page">
            <Navbar />
            <div className="profile-content">
                <h1>O seu perfil!</h1>
                {userData && (
                    <div className="user-details">
                        <h2>Editar Dados do Utilizador</h2>
                        <div>
                            <label>Primeiro Nome:</label>
                            <input
                                type="text"
                                value={newFirstName}
                                onChange={(e) => setNewFirstName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Último Nome:</label>
                            <input
                                type="text"
                                value={newLastName}
                                onChange={(e) => setNewLastName(e.target.value)}
                            />
                        </div>
                        <button onClick={handleUpdateProfile}>Guardar Alterações</button>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        {successMessage && <p className="success-message">{successMessage}</p>}
                    </div>
                )}
                <div className="user-flats-section">
                    <h2>Os seus Imóveis</h2>
                    {userFlats.length > 0 ? (
                        <div className="flats-list">
                            {userFlats.map((flat) => (
                                <div key={flat.id} className="flat-card">
                                    <h3>{flat.flatName}</h3>
                                    <p><strong>Cidade:</strong> {flat.cityName}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Você ainda não adicionou nenhum imóvel.</p>
                    )}
                </div>
                <div className="favorites-section">
                    <h2>Os seus Favoritos</h2>
                    {favoriteFlats.length > 0 ? (
                        <div className="flats-favorites-list">
                            {favoriteFlats.map((flat) => (
                                <div key={flat.id} className="flat-card">
                                    <h3>{flat.flatName}</h3>
                                    <p><strong>Cidade:</strong> {flat.cityName}</p>
                                    
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Você ainda não adicionou nenhum imóvel aos favoritos.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;