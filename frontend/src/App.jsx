import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegister from './pages/LoginRegister';
import PaginaPrincipal from './pages/PaginaPrincipal';
import LandingPage from './pages/LandingPage';
import MisReservas from './pages/MisReservas';
import Perfil from './pages/Perfil';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/Register" element={<LoginRegister />} />
        <Route path="/inicio" element={<PaginaPrincipal />} />
        <Route path="/mis-reservas" element={<MisReservas />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}
export default App;
