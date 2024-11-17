import { Routes, Route } from 'react-router-dom';
import Register from './componentes/Register';
import Home from './componentes/Home';
import Login from './componentes/Login';
import  {AuthContextProvider}  from './config/authcontex';
import  {UserContextProvider}  from './config/usercontex';
import FlatsForm from './componentes/Flats';
import Teste from './componentes/Teste';


function App() {
  return (
    <AuthContextProvider>
      <UserContextProvider>
        <Routes>
          <Route path='/teste' element={<Teste />} />
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/flats' element={<FlatsForm />} />
        </Routes>
    </UserContextProvider>
  </AuthContextProvider>
  );
}

export default App;