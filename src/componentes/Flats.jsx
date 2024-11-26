import React, { useState, useEffect, useContext } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../config/firebase';
import { collection, getDocs, doc, updateDoc, arrayUnion, where, query } from 'firebase/firestore';
import Navbar from './Navebar';
import Filtros from './Filtros';
import '../css/Flats.css';
import { UserContext } from '../config/usercontex';
import { FilterContext } from '../config/filtercontext';
import { Button, TextField, CircularProgress } from '@mui/material';

function Flats() {
    const [flats, setFlats] = useState([]);
    const [newComments, setNewComments] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useContext(UserContext);
    const { filters } = useContext(FilterContext);


    useEffect(() => {
        const fetchFlats = async () => {
            setIsLoading(true);
            try {
                const flatsCollection = collection(db, 'flats');
                const flatsSnapshot = await getDocs(flatsCollection);
                let flatsList = flatsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                if (filters.city) {
                    flatsList = flatsList.filter((flat) =>
                        flat.cityName.toLowerCase().includes(filters.city.toLowerCase())
                    );
                }
                if (filters.minPrice) {
                    flatsList = flatsList.filter((flat) => flat.rentPrice >= filters.minPrice);
                }
                if (filters.maxPrice) {
                    flatsList = flatsList.filter((flat) => flat.rentPrice <= filters.maxPrice);
                }
                if (filters.hasAc) {
                    flatsList = flatsList.filter((flat) => flat.hasAc === true);
                }

                setFlats(flatsList);
            } catch (error) {
                console.error('Erro ao encontrar e filtrar os imóveis:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFlats();
    }, [filters]);

    const handleAddFavorite = async (flatId) => {
        try {
            const auth = getAuth();
            const userUID = auth.currentUser?.uid;
    
            if (!userUID) {
                console.error("User não autenticado.");
                return;
            }
    
            const usersCollection = collection(db, "users");
            const q = query(usersCollection, where("authUID", "==", userUID));
            const querySnapshot = await getDocs(q);
    
            if (querySnapshot.empty) {
                console.error("Documento do user não encontrado no Firestore.");
                return;
            }
    
            const userDocRef = doc(db, "users", querySnapshot.docs[0].id);
    
            await updateDoc(userDocRef, {
                favorites: arrayUnion(flatId),
            });
    
            console.log(`Flat ID ${flatId} adicionado aos favoritos com sucesso.`);
        } catch (error) {
            console.error("Erro ao adicionar favorito:", error);
        }
    };

    const handleAddComment = async (flatId) => {
        if (!newComments[flatId] || !user) {
            console.error('Comentário vazio ou user não identificado.');
            return;
        }

        const commentWithUser = `${user}: ${newComments[flatId]}`;

        try {
            const flatDocRef = doc(db, 'flats', flatId);
            await updateDoc(flatDocRef, {
                comments: arrayUnion(commentWithUser),
            });

            setNewComments((prevComments) => ({
                ...prevComments,
                [flatId]: '',
            }));

            setFlats((prevFlats) =>
                prevFlats.map((flat) =>
                    flat.id === flatId
                        ? { ...flat, comments: [...(flat.comments || []), commentWithUser] }
                        : flat
                )
            );
        } catch (error) {
            console.error('Erro ao adicionar comentário:', error);
        }
    };


    return (
        <div className="home-page">
            <h1>Bem-vindo ao Flat Finder{user}!</h1>
            <Navbar />
            <Filtros />
            <div className="content">
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    <div className="flats-container">
                        {flats.length > 0 ? (
                            flats.map((flat) => (
                                <div
                                    key={flat.id}
                                    className="flat-card"
                                >
                                    <h3>{flat.flatName}</h3>
                                    {flat.imageKeys && flat.imageKeys.length > 0 ? (
                                        <img
                                            src={`data:image/jpeg;base64,${localStorage.getItem(flat.imageKeys[0])}`}
                                            alt={`Imagem de ${flat.flatName}`}
                                            className="flat-image"
                                        />
                                    ) : (
                                        <img
                                            src="/path/to/default-image.jpg"
                                            alt="Imagem padrão"
                                            className="flat-image"
                                        />
                                    )}
                                    <div className="topics">
                                        <p><strong>Cidade:</strong> {flat.cityName}</p>
                                        <p><strong>Rua:</strong> {flat.streetName} {flat.streetNumber}</p>
                                        <p><strong>Área:</strong> {flat.area} m²</p>
                                        <p><strong>Ano:</strong> {flat.yearBuilt}</p>
                                        <p><strong>Preço do Aluguer:</strong> {flat.rentPrice} €</p>
                                        <p><strong>Ar Condicionado:</strong> {flat.hasAc ? 'Sim' : 'Não'}</p>
                                    </div>
                                    <Button
                                        variant="contained"
                                        onClick={(e) => {handleAddFavorite(flat.id);}}
                                        style={{ marginBottom: '1rem', textTransform: 'uppercase' }}
                                    >
                                        Adicionar aos Favoritos
                                    </Button>
                                    <div className="comments-section">
                                        <TextField
                                            label="Adicione um comentário"
                                            multiline
                                            rows={1}
                                            value={newComments[flat.id] || ''}
                                            onChange={(e) =>
                                                setNewComments((prev) => ({
                                                    ...prev,
                                                    [flat.id]: e.target.value,
                                                }))
                                            }
                                            fullWidth
                                            style={{ marginBottom: '1rem' }}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <Button
                                            variant="contained"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddComment(flat.id);
                                            }}
                                            style={{ textTransform: 'uppercase' }}
                                        >
                                            Comentar
                                        </Button>
                                        <ul>
                                            {flat.comments && flat.comments.length > 0 ? (
                                                flat.comments.map((comment, index) => (
                                                    <li key={index}>{comment}</li>
                                                ))
                                            ) : (
                                                <li>Sem comentários.</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Nenhum imóvel encontrado. Tente ajustar os filtros.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Flats;