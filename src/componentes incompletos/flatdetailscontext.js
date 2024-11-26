import { createContext, useState } from 'react';

// Create Context
export const FlatDetailsContext = createContext();

// Provide Context
export const FlatDetailsContextProvider = ({ children }) => {
    const [selectedFlat, setSelectedFlat] = useState(null);

    return (
        <FlatDetailsContext.Provider value={{ selectedFlat, setSelectedFlat }}>
            {children}
        </FlatDetailsContext.Provider>
    );
};