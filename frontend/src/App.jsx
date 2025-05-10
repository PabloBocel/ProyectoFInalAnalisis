import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegister from './pages/LoginRegister';
import PaginaPrincipal from './pages/PaginaPrincipal';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route path="/inicio" element={<PaginaPrincipal />} />
      </Routes>
    </Router>
  );
}

export default App;
