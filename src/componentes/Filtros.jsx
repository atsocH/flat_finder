import React, { useContext, useState } from 'react';
import { FilterContext } from '../config/filtercontext';
import { useNavigate } from 'react-router-dom';
import { TextField, Checkbox, FormControlLabel, Button, Box, Typography, Stack,} from '@mui/material';
import '../css/Filtros.css'

function Filtros() {
    const { filters, applyFilters } = useContext(FilterContext);
    const [pendingFilters, setPendingFilters] = useState(filters); // Gerencia localmente as alterações
    const navigate = useNavigate();

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPendingFilters((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleApply = () => {
        applyFilters(pendingFilters);
        navigate('/flats');
    };

    return (
        <Box className="filters-container">
            <Typography variant="h6" gutterBottom>
                O que procura?
            </Typography>
            <Stack spacing={2}>
                <TextField
                    label="Cidade"
                    name="city"
                    value={pendingFilters.city || ''}
                    onChange={handleFilterChange}
                    placeholder="Ex.: Lisboa"
                    fullWidth
                />
                <TextField
                    label="Preço Mínimo (€)"
                    name="minPrice"
                    type="number"
                    value={pendingFilters.minPrice || ''}
                    onChange={handleFilterChange}
                    placeholder="Ex.: 500"
                    fullWidth
                />
                <TextField
                    label="Preço Máximo (€)"
                    name="maxPrice"
                    type="number"
                    value={pendingFilters.maxPrice || ''}
                    onChange={handleFilterChange}
                    placeholder="Ex.: 1500"
                    fullWidth
                />
                <Typography className='ac-text'>Ar condicionado?</Typography>
                <FormControlLabel
                    control={
                        <Checkbox
                            name="hasAc"
                            checked={pendingFilters.hasAc || false}
                            onChange={handleFilterChange}
                        />
                    }
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleApply}
                    sx={{ mt: 2 }}
                >
                    Aplicar Filtros
                </Button>
            </Stack>
        </Box>
    );
}

export default Filtros;