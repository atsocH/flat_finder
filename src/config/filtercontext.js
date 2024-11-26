import { createContext, useState, useEffect } from 'react';

export const FilterContext = createContext();

export const FilterContextProvider = ({ children }) => {
    const [filters, setFilters] = useState(() => {
        const storedFilters = localStorage.getItem('filters');
        return storedFilters
            ? JSON.parse(storedFilters)
            : { city: '', minPrice: '', maxPrice: '', hasAc: false };
    });

    useEffect(() => {
        localStorage.setItem('filters', JSON.stringify(filters));
    }, [filters]);

    const applyFilters = (newFilters) => {
        setFilters((prevFilters) => ({
            city: '',
            minPrice: '',
            maxPrice: '',
            hasAc: false,
            ...prevFilters,
            ...newFilters,
        }));
    };


    return (
        <FilterContext.Provider
            value={{
                filters,
                applyFilters,
            }}
        >
            {children}
        </FilterContext.Provider>
    );
};