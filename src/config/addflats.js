import { createContext, useState } from 'react';

export const AddFlat = createContext();

export const AddFlatContextProvider = () => {
    const [flatName, setFlatName] = useState('');
    const [cityName, setCityName] = useState('');
    const [streetName, setStreetName] = useState('');
    const [streetNumber, setStreetNumber] = useState(0);
    const [area, setArea] = useState(0);
    const [hasAc, setHasAc] = useState(false);
    const [yearBuilt, setYearBuilt] = useState(null);
    const [rentPrice, setRentPrice] = useState(0);
    const [image, setImage] = useState('');

    return (
        <AddFlat.Provider value={{
            flatName, setFlatName,
            cityName, setCityName,
            streetName, setStreetName,
            streetNumber, setStreetNumber,
            area, setArea,
            hasAc, setHasAc,
            yearBuilt, setYearBuilt,
            rentPrice, setRentPrice,
            image, setImage,
        }}>
        </AddFlat.Provider>
    );
};