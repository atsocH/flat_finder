import { useState, useEffect, useContext } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import Navbar from '../componentes/Navebar';
import '../css/Home.css';
import { UserContext } from '../config/usercontex'; // Use o UserContext aqui
import { Button, TextField } from '@mui/material';

function Home() {
    const [flats, setFlats] = useState([]);
    const [newComments, setNewComments] = useState({});

    const { user } = useContext(UserContext); // Pegue o nome do usuário do UserContext

    useEffect(() => {
        const fetchFlats = async () => {
            try {
                const flatsCollection = collection(db, 'flats');
                const flatsSnapshot = await getDocs(flatsCollection);
                const flatsList = flatsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    comments: doc.data().comments || [], // Certifica-se de que comentários existam
                }));
                setFlats(flatsList);
            } catch (error) {
                console.error('Erro ao buscar os flats:', error);
            }
        };

        fetchFlats();
    }, []);

    const handleAddComment = async (flatId) => {
        if (!newComments[flatId] || !user) {
            console.error("Comentário vazio ou nome de usuário não encontrado.", {
                comment: newComments[flatId],
                user,
            });
            return;
        }

        const commentWithUser = `${user}: ${newComments[flatId]}`; // Nome do usuário + comentário

        try {
            const flatDocRef = doc(db, 'flats', flatId);
            const flatSnapshot = await getDoc(flatDocRef);

            if (!flatSnapshot.exists()) {
                console.error(`Flat com ID ${flatId} não encontrado.`);
                return;
            }

            const flatData = flatSnapshot.data();
            const updatedComments = [...(flatData.comments || []), commentWithUser];

            await updateDoc(flatDocRef, { comments: updatedComments });

            setFlats((prevFlats) =>
                prevFlats.map(flat =>
                    flat.id === flatId ? { ...flat, comments: updatedComments } : flat
                )
            );

            setNewComments((prevComments) => ({
                ...prevComments,
                [flatId]: '',
            }));
        } catch (error) {
            console.error('Erro ao adicionar o comentário:', error);
        }
    };

    const handleCommentChange = (flatId, value) => {
        setNewComments((prevComments) => ({
            ...prevComments,
            [flatId]: value,
        }));
    };

    return (
        <div className="home-page">
            <Navbar />
            <div className="content">
                <h2>Seja bem-vindo ao Flat Finder {user}!</h2>
                    <div className="flats-container">
                        {flats.map(flat => (
                            <div key={flat.id} className="flat-card">
                                <h3>{flat.flatName}</h3>
                                {flat.imageKey && (
                                    <img
                                        src={`data:image/jpeg;base64,${localStorage.getItem(flat.imageKey)}`}
                                        alt={flat.flatName}
                                        className="flat-image"
                                    />
                                )}
                                    <p><strong>Cidade:</strong> {flat.cityName}</p>
                                    <p><strong>Rua:</strong> {flat.streetName} {flat.streetNumber}</p>
                                    <p><strong>Área:</strong> {flat.area} m²</p>
                                    <p><strong>Ano:</strong> {flat.yearBuilt}</p>
                                    <p><strong>Preço:</strong> {flat.rentPrice} €</p>
                                <div className="comments-section">
                                    <TextField
                                        label="Adicione um comentário"
                                        multiline
                                        rows={1}
                                        variant="outlined"
                                        value={newComments[flat.id] || ''}
                                        onChange={(e) => handleCommentChange(flat.id, e.target.value)}
                                        fullWidth
                                        style={{ marginBottom: '1rem' }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => handleAddComment(flat.id)}
                                        style={{ textTransform: 'uppercase', fontWeight: 'bold' }}
                                    >
                                        Comentar
                                    </Button>
                                    <ul>
                                        {flat.comments.map((comment, index) => (
                                            <li key={index}>{comment}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
            </div>
        </div>
    );
}

export default Home;