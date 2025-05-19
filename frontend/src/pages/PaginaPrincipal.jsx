import React, { useEffect, useRef, useState } from 'react';
import { getTalleres } from '../services/talleres';
import { crearReserva } from '../services/reservas';
import { useNavigate } from 'react-router-dom';
import './PaginaPrincipal.css';
import { toast } from 'react-toastify';

export default function PaginaPrincipal() {
  const navigate = useNavigate();
  const correoUsuario = localStorage.getItem('usuarioEmail');

  const [showMenu, setShowMenu] = useState(false);
  const [showPrecioMenu, setShowPrecioMenu] = useState(false);
  const [showFechaMenu, setShowFechaMenu] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');

  const menuRef = useRef();
  const precioRef = useRef();
  const fechaRef = useRef();

  const handleReservar = async (tallerId) => {
    try {
      if (!correoUsuario) {
        toast.error("Debes iniciar sesión para reservar.");
        return;
      }
      await crearReserva(correoUsuario, tallerId);
      toast.success("✅ Reserva creada correctamente.");
    } catch (err) {
      toast.error("❌ Error al crear la reserva");
      console.error(err);
    }
  };

  const [talleres, setTalleres] = useState([]);
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
      if (precioRef.current && !precioRef.current.contains(e.target)) {
        setShowPrecioMenu(false);
      }
      if (fechaRef.current && !fechaRef.current.contains(e.target)) {
        setShowFechaMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categorias = ['Todas', ...new Set(talleres.map(t => t.categoria))];

  const talleresFiltrados = talleres
    .filter(t => t.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .filter(t => categoriaSeleccionada === 'Todas' || t.categoria === categoriaSeleccionada)
    .sort((a, b) => {
      if (ordenFecha) {
        return ordenFecha === 'asc'
          ? new Date(a.fecha) - new Date(b.fecha)
          : new Date(b.fecha) - new Date(a.fecha);
      }
      if (ordenPrecio) {
        return ordenPrecio === 'asc' ? a.precio - b.precio : b.precio - a.precio;
      }
      return 0;
    });

  return (
    <>
      <header className="full-width-header">
        <div className="user-icon" ref={menuRef} onClick={() => setShowMenu(!showMenu)}>
          <img src="/Perfil.png" alt="Perfil" className="user-icon-inner" />
          {showMenu && (
            <div className="user-dropdown">
              <button onClick={() => navigate('/perfil')}>👤 Perfil</button>
              <button onClick={() => navigate('/mis-reservas')}>📋 Mis Reservas</button>
              <button onClick={() => {
                localStorage.removeItem('usuarioEmail');
                toast.info('Sesión cerrada con éxito');
                navigate('/');
              }}>🚪 Cerrar sesión</button>
            </div>
          )}
        </div>

        <div className="header-center">
          <span className="search-prompt">¿Buscas un taller en específico?</span>
          <div className="search-container">
            <input
              type="text"
              className="search-bar"
              placeholder="Buscar..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <button className="search-button">
              <img src="/Lupa.png" alt="Buscar" className="search-icon" />
            </button>
          </div>
        </div>
      </header>

      <main className="full-width-main">
        <div className="recommendations-header full-width-section">
          <h1 className="recommendations-title">RECOMENDACIONES</h1>
          <div className="sort-options">
            <span>ORDENAR POR</span>

            <div className="sort-group" ref={precioRef}>
              <button className="sort-button" onClick={() => setShowPrecioMenu(!showPrecioMenu)}>PRECIO</button>
              {showPrecioMenu && (
                <div className="dropdown-menu">
                  <button onClick={() => { setOrdenPrecio('asc'); setShowPrecioMenu(false); }}>Más bajo a más alto</button>
                  <button onClick={() => { setOrdenPrecio('desc'); setShowPrecioMenu(false); }}>Más alto a más bajo</button>
                </div>
              )}
            </div>

            <div className="sort-group" ref={fechaRef}>
              <button className="sort-button" onClick={() => setShowFechaMenu(!showFechaMenu)}>FECHA</button>
              {showFechaMenu && (
                <div className="dropdown-menu">
                  <button onClick={() => { setOrdenFecha('asc'); setShowFechaMenu(false); }}>Más antigua a más reciente</button>
                  <button onClick={() => { setOrdenFecha('desc'); setShowFechaMenu(false); }}>Más reciente a más antigua</button>
                </div>
              )}
            </div>

            <select
              className="sort-button"
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            >
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="courses-container full-width-section">
          {loading ? <p>Cargando talleres...</p> : talleresFiltrados.map(taller => (
            <div className="course-card" key={taller.id}>
              <div className="image-container">
                <img src={taller.imagen || '/placeholder.jpg'} alt={taller.nombre} className="course-image" />
              </div>
              <div className="course-content">
                <h2 className="course-name">{taller.nombre}</h2>
                <p className="course-description">{taller.descripcion || 'Descripción no disponible'}</p>
                <div className="course-details">
                  <span className="course-date">📅 {taller.fecha}</span>
                  <span className="course-price">💰 Q{taller.precio}</span>
                </div>
                <button className="reserve-button" onClick={() => handleReservar(taller.id)}>
                  {taller.cupo > 0 ? 'RESERVAR' : 'NO HAY CUPOS'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
