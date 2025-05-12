import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Perfil.css';

export default function Perfil() {
  const navigate = useNavigate();
  const [datos, setDatos] = useState({
    nombre: 'Juan Pérez',
    correo: 'test@email.com',
    telefono: '5555-5555',
    direccion: 'Ciudad de Guatemala',
    rol: 'Estudiante',
    nacimiento: '1995-01-01',
  });
  const [guardado, setGuardado] = useState(false);

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleGuardar = () => {
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  };

  return (
    <>
      <header className="header-principal">
        <h1>MasterCook Academy</h1>
        <div className="perfil-nav">
          <button onClick={() => navigate('/inicio')}>📚 Cursos</button>
          <button onClick={() => navigate('/mis-reservas')}>📋 Mis Reservas</button>
          <button onClick={() => navigate('/')}>🚪 Cerrar sesión</button>
        </div>
      </header>

      <div className="espaciador-header" />
      <div className="perfil-container">
        <h2>Mi Perfil</h2>

        <label>Nombre completo:
          <input name="nombre" value={datos.nombre} onChange={handleChange} />
        </label>

        <label>Correo:
          <input name="correo" value={datos.correo} disabled />
        </label>

        <label>Teléfono:
          <input name="telefono" value={datos.telefono} onChange={handleChange} />
        </label>

        <label>Dirección:
          <input name="direccion" value={datos.direccion} onChange={handleChange} />
        </label>

        <label>Rol:
          <select name="rol" value={datos.rol} onChange={handleChange}>
            <option value="Estudiante">Estudiante</option>
            <option value="Chef">Chef</option>
            <option value="Instructor">Instructor</option>
          </select>
        </label>

        <label>Fecha de nacimiento:
          <input type="date" name="nacimiento" value={datos.nacimiento} onChange={handleChange} />
        </label>

        <button onClick={handleGuardar}>Guardar Cambios</button>
        {guardado && <p className="guardado">✅ Cambios guardados</p>}
      </div>
    </>
  );
}
