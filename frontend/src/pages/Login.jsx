import React, { useState } from 'react';
import { login } from '../services/auth';
import './Login.css';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await login(email, password);
      alert(`🔓 ${res.data.message}`);
      navigate('/inicio');
    } catch (err) {
      alert(`❌ ${err.response?.data?.error || 'Error al iniciar sesión'}`);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-left">
        <div className="form-wrapper">
          <div className="icon-user">👤</div>
          <input
            type="email"
            placeholder="CORREO"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="CONTRASEÑA"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn-login" onClick={handleLogin}>INICIAR SESIÓN</button>
          <p className="no-cuenta">¿Aún no tienes cuenta?</p>
          <a className="registro-link" href="/registro">REGÍSTRATE ✔️</a>
        </div>
      </div>
            <div className="login-right">
                <img src="/logo-mc.png" alt="Logo MasterCook" className="logo-img" />
                <h1 className="titulo-logo">
                MASTERCOOK<br /><span>ACADEMY</span>
                </h1>
            </div>
            <div className="custom-shape-divider-bottom-1747431304">
        <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
        >
            <path
            d="M321.39,56.44C197.78,82.3,91.13,95.09,0,87.75V0H1200V27.35c-114.41,31.87-218.16,41.65-320.57,42.5C747.89,71.12,631.43,48.13,495.58,52.94,439.18,55.14,382.39,64,321.39,56.44Z"
            className="shape-fill"
            ></path>
        </svg>
        </div>

    </div>
    
  );
}
