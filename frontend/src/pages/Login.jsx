import React, { useState } from 'react';
import { login } from '../services/auth';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => { 
  try {
    const res = await login(email, password);

    localStorage.setItem('usuarioEmail', email);

    toast.success(`🔓 ${res.data.message}`, {
      icon: '✅',
      style: {
        background: '#E6F4EA',
        color: '#2E7D32'
      }
    });

    navigate('/inicio');
  } catch (err) {
    toast.error(`❌ ${err.response?.data?.error || 'Error al iniciar sesión'}`);
  }
};


  return (
    <div className="login-screen">
      <div className="login-left">
        <form className="login-form" onSubmit={(e) => e.preventDefault()}>
          <div className="login-icon">👤</div>
          <h2>INICIAR SESIÓN</h2>

          <label>Correo</label>
          <input
            type="email"
            placeholder="CORREO"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Contraseña</label>
          <input
            type="password"
            placeholder="CONTRASEÑA"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn-login" onClick={handleLogin}>INICIAR SESIÓN</button>
          <button className="btn-volver" onClick={() => navigate('/')}>⬅ VOLVER AL MENÚ</button>
          <p className="no-cuenta">¿No tienes una cuenta?</p>
          <button className="btn-volver" onClick={() => navigate('/Register')}>
            👉 REGÍSTRATE AQUÍ
          </button>
        </form>
      </div>

      <div className="login-right">
        <img src="/Logo_Mastercook.png" alt="Logo MasterCook" className="logo-img" />
      </div>

      {/* Onda decorativa al fondo */}
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
