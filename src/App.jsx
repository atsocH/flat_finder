import { Routes, Route } from 'react-router-dom';
import Register from './componentes/Register';
import Home from './componentes/Home';
import Login from './componentes/Login';
import { AuthContextProvider } from './config/authcontex';

function App() {
  return (
    <AuthContextProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
        </Routes>
    </AuthContextProvider>
  );
}

export default App;