import React, { useState, useContext } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, Box, Typography, Stack } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { UserContext } from '../config/usercontex';
import '../css/FlatsForm.css';

function RegisterFlat() {
    const navigate = useNavigate();
    const { userUID } = useContext(UserContext);

    const [formData, setFormData] = useState({
        flatName: '',
        cityName: '',
        streetName: '',
        streetNumber: '',
        area: '',
        hasAc: false,
        yearBuilt: '',
        rentPrice: '',
        description: '',
        availableDate: '',
    });

    const [imageKeys, setImageKeys] = useState([]);
    const [uploading, setUploading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);

        for (const file of files) {
            const base64Image = await convertToBase64(file);
            const imageKey = `flat-image-${Date.now()}-${Math.random().toString(36).substring(7)}`;

            localStorage.setItem(imageKey, base64Image);

            setImageKeys((prevKeys) => [...prevKeys, imageKey]);
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setUploading(true);

        try {
            const flatData = {
                ...formData,
                userUID,
                imageKeys,
                createdAt: new Date().toISOString(),
            };

            console.log('Dados do flat:', flatData);

            await addDoc(collection(db, 'flats'), flatData);

            alert('Flat registrado com sucesso!');
            navigate('/flats');
        } catch (error) {
            console.error('Erro ao registrar flat:', error);
            alert('Erro ao registrar flat. Tente novamente.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="register-flat-container">
                <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="h4" gutterBottom>
                    Registar Novo Imóvel
                </Typography>

                <Stack spacing={2}>
                    <TextField
                        label="Nome do Imóvel"
                        name="flatName"
                        value={formData.flatName}
                        onChange={handleInputChange}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Cidade"
                        name="cityName"
                        value={formData.cityName}
                        onChange={handleInputChange}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Rua"
                        name="streetName"
                        value={formData.streetName}
                        onChange={handleInputChange}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Número da Rua"
                        name="streetNumber"
                        value={formData.streetNumber}
                        onChange={handleInputChange}
                        type="number"
                        fullWidth
                        required
                    />
                    <TextField
                        label="Área (m²)"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        type="number"
                        fullWidth
                        required
                        style={{ width: '250px' }}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.hasAc}
                                name="hasAc"
                                onChange={handleInputChange}
                            />
                        }
                        label="Ar Condicionado"
                    />
                    <TextField
                        label="Ano de Construção"
                        name="yearBuilt"
                        value={formData.yearBuilt}
                        onChange={handleInputChange}
                        type="number"
                        fullWidth
                        style={{ width: '250px' }}
                    />
                    <TextField
                        label="Preço de Aluguer (€)"
                        name="rentPrice"
                        value={formData.rentPrice}
                        onChange={handleInputChange}
                        type="number"
                        fullWidth
                        required
                        style={{ width: '250px' }}
                    />
                    <TextField
                        label="Descrição"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        fullWidth
                        multiline
                        rows={4}
                    />
                    <TextField
                        label="Data Disponível"
                        name="availableDate"
                        value={formData.availableDate}
                        onChange={handleInputChange}
                        type="date"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                    />

                    <Stack direction="row" spacing={2} alignItems="center">
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<CloudUpload />}
                        >
                            Carregar Imagens
                            <input
                                type="file"
                                hidden
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Button>
                    </Stack>

                    {imageKeys.length > 0 && (
                        <div className="uploaded-images">
                            <Typography variant="h6">Imagens Carregadas:</Typography>
                            <div className="image-preview">
                                {imageKeys.map((key, index) => (
                                    <img
                                        key={index}
                                        src={`data:image/jpeg;base64,${localStorage.getItem(key)}`}
                                        alt={`Imagem ${index + 1}`}
                                        className="uploaded-image"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={uploading}
                    >
                        {uploading ? 'A Registar...' : 'Registar Flat'}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(-1)}
                    >
                        Voltar
                    </Button>
                </Stack>
            </Box>
        </div>
    );
}

export default RegisterFlat;
