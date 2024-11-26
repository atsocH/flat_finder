import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import '../css/FlatDetails.css';

function FlatDetails() {
    const [flat, setFlat] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFlatDetails = async () => {
            try {

                // Busca a coleção "flats" no Firestore
                const flatsCollection = collection(db, 'flats');
                const flatsSnapshot = await getDocs(flatsCollection);

                // Filtra o imóvel correspondente ao `flatId`
                const flatData = flatsSnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .find(flat => flat.id);

                if (flatData) {
                    console.log('Dados do Flat:', flatData); // Debug dos dados recebidos
                    setFlat(flatData);
                } else {
                    setError('Flat não encontrado.');
                }
            } catch (error) {
                console.error('Erro ao buscar detalhes do flat:', error);
                setError('Ocorreu um erro ao buscar os detalhes do flat.');
            }
        };

        fetchFlatDetails();
    }, []);

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (!flat) {
        return <p>Carregando detalhes do flat...</p>;
    }

    return (
        <div className="flat-details-container">
            <h1>{flat.flatName}</h1>
            <div className="image-gallery">
                {flat.imageKeys && flat.imageKeys.length > 0 ? (
                    flat.imageKeys.map((key, index) => {
                        const base64Image = localStorage.getItem(key);
                        if (!base64Image) {
                            console.warn(`Imagem não encontrada para a chave: ${key}`);
                            return null;
                        }
                        return (
                            <img
                                key={index}
                                src={`data:image/jpeg;base64,${base64Image}`}
                                alt={`Imagem ${index + 1}`}
                                className="flat-image"
                            />
                        );
                    })
                ) : (
                    <p>Sem imagens disponíveis para este flat.</p>
                )}
            </div>
            <div className="flat-info">
                <p><strong>Descrição:</strong> {flat.description || 'Descrição não disponível.'}</p>
                <p><strong>Cidade:</strong> {flat.cityName}</p>
                <p><strong>Rua:</strong> {flat.streetName} {flat.streetNumber}</p>
                <p><strong>Área:</strong> {flat.area} m²</p>
                <p><strong>Ano de Construção:</strong> {flat.yearBuilt || 'Não informado'}</p>
                <p><strong>Preço do Aluguel:</strong> {flat.rentPrice} €</p>
                <p><strong>Ar Condicionado:</strong> {flat.hasAc ? 'Sim' : 'Não'}</p>
                <p><strong>Data Disponível:</strong> {flat.availableDate || 'Não informado'}</p>
            </div>
            <button className="back-button" onClick={() => navigate(-1)}>
                Voltar
            </button>
        </div>
    );
}

export default FlatDetails;
