import React, { useState } from 'react';
import { register, login } from '../services/auth';
import './LoginRegister.css';
import { useNavigate } from 'react-router-dom';

export default function LoginRegister() {
  const navigate = useNavigate(); // 🔄 Aquí va
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const res = await register(email, password);
      alert(`✔️ ${res.data.message}`);
      // navigate('/inicio'); // Si quieres redirigir también al registrarse
    } catch (err) {
      alert(`❌ ${err.response?.data?.error || 'Error al registrar'}`);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await login(email, password);
      alert(`🔓 ${res.data.message}`);
      navigate('/inicio'); // Redirige a la página principal
    } catch (err) {
      alert(`❌ ${err.response?.data?.error || 'Error al iniciar sesión'}`);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Login / Registro</h2>
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleRegister}>Registrarse</button>
      <button onClick={handleLogin}>Iniciar sesión</button>
    </div>
  );
}
