import React, { useEffect, useState } from 'react';
import { getTalleres } from '../services/talleres';
import { useNavigate } from 'react-router-dom';
import './PaginaPrincipal.css';
import { crearReserva } from '../services/reservas';


export default function PaginaPrincipal() {
  const navigate = useNavigate();
  const handleReservar = async (tallerId) => {
    try {
      const email = 'test@email.com'; // Aquí luego se usará el usuario autenticado
      const res = await crearReserva(email, tallerId);
      alert(`✅ Reserva creada correctamente.`);
    } catch (err) {
      alert('❌ Error al crear la reserva');
      console.error(err);
    }
  };

  const [talleres, setTalleres] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [ordenFecha, setOrdenFecha] = useState('');
  const [ordenPrecio, setOrdenPrecio] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTalleres()
      .then((data) => {
        setTalleres(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al obtener talleres', err);
        setLoading(false);
      });
  }, []);

  const categorias = ['Todas', ...new Set(talleres.map((t) => t.categoria))];

  let talleresFiltrados = talleres.filter(t =>
    t.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
    (categoriaSeleccionada === 'Todas' || t.categoria === categoriaSeleccionada)
  );

  if (ordenFecha) {
    talleresFiltrados.sort((a, b) =>
      ordenFecha === 'asc'
        ? new Date(a.fecha) - new Date(b.fecha)
        : new Date(b.fecha) - new Date(a.fecha)
    );
  }

  if (ordenPrecio) {
    talleresFiltrados.sort((a, b) =>
      ordenPrecio === 'asc' ? a.precio - b.precio : b.precio - a.precio
    );
  }

  return (
    <>
      <header className="header-principal">
        <h1>MasterCook Academy</h1>
        <div className="perfil-nav">
          <button onClick={() => navigate('/mis-reservas')}>📋 Mis Reservas</button>
          <button onClick={() => navigate('/perfil')}>👤 Perfil</button>
          <button onClick={() => navigate('/')}>🚪 Cerrar sesión</button>
        </div>
      </header>
      <div className="espaciador-header" />
      <div className="pagina-principal">
      <div className="categorias-menu">
        {categorias.map((cat) => (
          <button
            key={cat}
            className={`categoria-btn ${cat === categoriaSeleccionada ? 'activa' : ''}`}
            onClick={() => setCategoriaSeleccionada(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="filtros-bar">
        <input
          type="text"
          placeholder="Buscar taller por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select value={ordenFecha} onChange={(e) => setOrdenFecha(e.target.value)}>
          <option value="">Ordenar por fecha</option>
          <option value="asc">Fecha ↑</option>
          <option value="desc">Fecha ↓</option>
        </select>
        <select value={ordenPrecio} onChange={(e) => setOrdenPrecio(e.target.value)}>
          <option value="">Ordenar por precio</option>
          <option value="asc">Precio ↑</option>
          <option value="desc">Precio ↓</option>
        </select>
      </div>

      {loading ? (
        <p className="cargando">Cargando talleres...</p>
      ) : (
        <div className="talleres-grid">
          {talleresFiltrados.map((taller) => (
            <div className="card-taller" key={taller.id}>
              <img
                src={taller.imagen || 'https://via.placeholder.com/300x180.png?text=Taller'}
                alt={taller.nombre}
              />
              <div className="contenido">
                <h3>{taller.nombre}</h3>
                <p className="descripcion">{taller.descripcion || 'Descripción no disponible.'}</p>
                <div className="info">
                  <span>📅 {taller.fecha}</span>
                  <span>⏱️ {taller.duracion || '20 horas'}</span>
                </div>
                <p className="precio">💰 Q{taller.precio || '—'}</p>
                <div className="categoria">{taller.categoria}</div>
                <button
                      className="btn-detalles"
                      onClick={() => handleReservar(taller.id)}
                    >
                      Reservar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <footer className="footer">
        <img src="/logo-mc.png" alt="MasterCook Academy" />
        <p>“Descubre el arte de cocinar con pasión.”</p>
      </footer>
    </div>
    </>
  );
}
