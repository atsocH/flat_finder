import { createContext, useState} from 'react';

export const UserContext = createContext();

export const UserContextProvider = ({children}) => {
    const [user, setUser] = useState('');
    const [userUID, setUserID] = useState('');


    return (
        <UserContext.Provider value={{
            user,
            setUser,
            userUID,
            setUserID,
        }}>
            {children}
        </UserContext.Provider>
    )
}


