import { useContext } from 'react';
import { UserContext } from '../config/usercontex';

const Teste = () => {
    const { user } = useContext(UserContext);

    return <p>Bem-vindo, {user}!</p>;
};

export default Teste;