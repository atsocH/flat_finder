import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, addDoc } from "firebase/firestore";
import Button from '@mui/material/Button';
import '../css/FlatsForm.css'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const NAME_REGEX = /^[a-zA-Z\s]+$/;
const STREETNUMBER_REGEX = /^[0-9]+$/;
const YEARBUILT_REGEX = /^(18|20)\d{2}$/;
const RENTPRICE_REGEX = /^[0-9]+(\.[0-9]{1,2})?$/;

function FlatsForm() {
    const userRef = useRef();
    const errRef = useRef();

    const [flatName, setFlatName] = useState('');
    const [cityName, setCityName] = useState('');
    const [streetName, setStreetName] = useState('');
    const [streetNumber, setStreetNumber] = useState('');
    const [area, setArea] = useState('');
    const [hasAc, setHasAc] = useState(false);
    const [yearBuilt, setYearBuilt] = useState('');
    const [rentPrice, setRentPrice] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    
    const [isValidFlatName, setIsValidFlatName] = useState();
    const [isValidCityName, setIsValidCityName] = useState();
    const [isValidStreetName, setIsValidStreetName] = useState();
    const [isValidStreetNumber, setIsValidStreetNumber] = useState();
    const [isValidYearBuilt, setIsValidYearBuilt] = useState();
    const [isValidRentPrice, setIsValidRentPrice] = useState();

    const navigate = useNavigate();

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setIsValidFlatName(NAME_REGEX.test(flatName));
    }, [flatName]);

    useEffect(() => {
        setIsValidCityName(NAME_REGEX.test(cityName));
    }, [cityName]);

    useEffect(() => {
        setIsValidStreetName(NAME_REGEX.test(streetName));
    }, [streetName]);

    useEffect(() => {
        setIsValidStreetNumber(STREETNUMBER_REGEX.test(streetNumber));
    }, [streetNumber]);

    useEffect(() => {
        setIsValidYearBuilt(YEARBUILT_REGEX.test(yearBuilt));
    }, [yearBuilt]);

    useEffect(() => {
        setIsValidRentPrice(RENTPRICE_REGEX.test(rentPrice));
    }, [rentPrice]);

    const handleImageUpload = () => {
        if (!imageFile) return null;

        const reader = new FileReader();
        reader.readAsDataURL(imageFile);

        reader.onload = () => {
            const base64String = reader.result.split(',')[1]; // Remove o prefixo
            localStorage.setItem(`image-${imageFile.name}`, base64String); // Salva no localStorage
        };

        reader.onerror = (error) => {
            console.error("Erro ao salvar a imagem no localStorage:", error);
        };

        return `image-${imageFile.name}`; // Retorna a chave do localStorage
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidFlatName || !isValidCityName || !isValidStreetName || 
            !isValidStreetNumber || !isValidYearBuilt || !isValidRentPrice) {
            setErrorMsg("Preencha todos os campos corretamente.");
            return;
        }

        try {
            const imageKey = handleImageUpload();

            await addDoc(collection(db, "flats"), {
                flatName,
                cityName,
                streetName,
                streetNumber,
                area,
                hasAc,
                yearBuilt,
                rentPrice,
                imageKey,
                comments: [],
            });

            alert("Imóvel registado com sucesso!");
            navigate("/");
        } catch (error) {
            console.error("Erro ao adicionar o imóvel:");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Registe aqui o seu Imóvel</h1>
            {errorMsg && <div ref={errRef} style={{ color: 'red' }}>{errorMsg}</div>}
            
            <div>
                <label>Nome do Imóvel: </label>
                <input 
                    type="text"
                    ref={userRef}
                    value={flatName}
                    onChange={(e) => setFlatName(e.target.value)}
                    required
                />
                {!isValidFlatName && <p style={{ color: 'red' }}>Este campo deve conter apenas letras.</p>}
            </div>
            
            <div>
                <label>Cidade: </label>
                <input 
                    type="text"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    required
                />
                {!isValidCityName && <p style={{ color: 'red' }}>Este campo deve conter apenas letras.</p>}
            </div>

            <div>
                <label>Nome da Rua: </label>
                <input 
                    type="text"
                    value={streetName}
                    onChange={(e) => setStreetName(e.target.value)}
                    required
                />
                {!isValidStreetName && <p style={{ color: 'red' }}>Este campo deve conter apenas letras.</p>}
            </div>

            <div>
                <label>Número da Rua: </label>
                <input 
                    type="text"
                    value={streetNumber}
                    onChange={(e) => setStreetNumber(e.target.value)}
                    required
                />
                {!isValidStreetNumber && <p style={{ color: 'red' }}>Este campo deve conter apenas números.</p>}
            </div>

            <div>
                <label>Área (m²): </label>
                <input 
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Tem Ar Condicionado?</label>
                <input 
                    type="checkbox" 
                    checked={hasAc} 
                    onChange={(e) => setHasAc(e.target.checked)} 
                />
            </div>

            <div>
                <label>Ano de Construção: </label>
                <input 
                    type="text" 
                    value={yearBuilt} 
                    onChange={(e) => setYearBuilt(e.target.value)}
                    required
                />
                {!isValidYearBuilt && <p style={{ color: 'red' }}>Ano inválido. Insira um ano entre 1800 e 2099.</p>}
            </div>

            <div>
                <label>Preço do Aluguel: </label>
                <input 
                    type="text" 
                    value={rentPrice} 
                    onChange={(e) => setRentPrice(e.target.value)}
                    required
                />
                {!isValidRentPrice && <p style={{ color: 'red' }}>Preço inválido. Use um número com até duas casas decimais.</p>}
            </div>

            <div>
                <label>Imagem: </label>
                <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                >
                    Upload
                    <input
                        type="file"
                        hidden
                        onChange={(event) => setImageFile(event.target.files[0])}
                    />
                </Button>
                {imageFile && <p>{imageFile.name}</p>}
            </div>
            <button type="submit">Enviar</button>
        </form>
    );
}

export default FlatsForm;