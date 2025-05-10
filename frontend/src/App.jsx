import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegister from './pages/LoginRegister';
import PaginaPrincipal from './pages/PaginaPrincipal';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/inicio" element={<PaginaPrincipal />} />
      </Routes>
    </Router>
  );
}
export default App;
