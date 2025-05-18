import { useNavigate } from 'react-router-dom';
import { obtenerPerfil, actualizarPerfil } from '../services/auth';
import './Perfil.css';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';


const correoUsuario = localStorage.getItem('usuarioEmail');

export default function Perfil() {
  const navigate = useNavigate();
  const [datos, setDatos] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    direccion: '',
    rol: '',
    nacimiento: '',
  });
  const [guardado, setGuardado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
  };


  const handleGuardar = async () => {
  try {
    await actualizarPerfil(correoUsuario, {
      nombre: datos.nombre,
      telefono: datos.telefono,
      direccion: datos.direccion,
      nacimiento: datos.nacimiento
    });
    toast.success('✅ Cambios guardados correctamente');
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  } catch (err) {
    console.error("Error al actualizar perfil", err);
    toast.error("❌ Error al guardar los datos");
  }
};


useEffect(() => {
  if (!correoUsuario) return;

  obtenerPerfil(correoUsuario)
    .then((perfil) => {
      setDatos(perfil);
    })
    .catch((err) => {
      console.error("Error al cargar perfil", err);
    });
}, []);


  return (
    <>
      <header className="header-principal">
        <h1>MasterCook Academy</h1>
        <div className="perfil-nav">
          <button onClick={() => navigate('/inicio')}>📚 Cursos</button>
          <button onClick={() => navigate('/mis-reservas')}>📋 Mis Reservas</button>
          <button
            onClick={() => {
              localStorage.removeItem('usuarioEmail');
              toast.info('Sesión cerrada con éxito');
              navigate('/');
            }}
          >
            🚪 Cerrar sesión
          </button>
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
          <input name="rol" value="Estudiante" disabled />
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
