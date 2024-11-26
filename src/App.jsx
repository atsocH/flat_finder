import { Routes, Route } from 'react-router-dom';
import Register from './componentes/Register';
import Login from './componentes/Login';
import HomePrincipal from './componentes/HomePrincipal';
import Flats from './componentes/Flats';
import FlatsForm from './componentes/FlatsForm';
import Teste from './componentes/Teste';
import Profile from './componentes/Profile';
import  {AuthContextProvider}  from './config/authcontex';
import  {UserContextProvider}  from './config/usercontex';
import  {FilterContextProvider}  from './config/filtercontext';


function App() {
  return (
    <AuthContextProvider>
      <UserContextProvider>
        <FilterContextProvider>
            <Routes>
              <Route path='/teste' element={<Teste />} />
              <Route path='/flats' element={<Flats />} />
              <Route path='/' element={<HomePrincipal />} />
              <Route path='/register' element={<Register />} />
              <Route path='/login' element={<Login />} />
              <Route path='/flatsform' element={<FlatsForm />} />
              <Route path='/profile' element={<Profile />} />
            </Routes>
        </FilterContextProvider>  
    </UserContextProvider>
  </AuthContextProvider>
  );
}

export default App;