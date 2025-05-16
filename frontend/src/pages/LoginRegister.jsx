import React, { useState } from 'react';
import { register } from '../services/auth';
import './LoginRegister.css';

export default function LoginRegister() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [pass1, setPass1] = useState('');
  const [pass2, setPass2] = useState('');

  const handleRegister = async () => {
    if (pass1 !== pass2) {
      alert('❌ Las contraseñas no coinciden');
      return;
    }

    try {
      const res = await register({ nombre, email, password: pass1 });
      alert(`✔️ ${res.data.message}`);
    } catch (err) {
      alert(`❌ ${err.response?.data?.error || 'Error al registrar'}`);
    }
  };

  return (
    <div className="registro-screen">
      <div className="registro-form">
        <div className="registro-icon">👤</div>
        <h2>REGISTRO DE USUARIO</h2>

        <label>Nombre</label>
        <input
          type="text"
          placeholder="USUARIO"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <label>Correo</label>
        <input
          type="email"
          placeholder="USUARIO"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Contraseña</label>
        <input
          type="password"
          placeholder="USUARIO"
          value={pass1}
          onChange={(e) => setPass1(e.target.value)}
        />

        <label>Confirmar contraseña</label>
        <input
          type="password"
          placeholder="USUARIO"
          value={pass2}
          onChange={(e) => setPass2(e.target.value)}
        />

        <hr />
        <button className="btn-registrar" onClick={handleRegister}>REGÍSTRATE</button>
      </div>

      <div className="registro-lateral">
        <img src="/logo-mc.png" alt="Logo" className="logo-img" />
        <h1 className="titulo-logo">
          MASTERCOOK<br /><span>ACADEMY</span>
        </h1>

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
    </div>
  );
}
