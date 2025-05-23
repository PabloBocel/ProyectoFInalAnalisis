import React, { useEffect, useRef, useState } from 'react';
import { getTalleres } from '../services/talleres';
import { crearReserva, getReservas } from '../services/reservas';
import { useNavigate } from 'react-router-dom';
import './PaginaPrincipal.css';
import { toast } from 'react-toastify';

export default function PaginaPrincipal() {
  const navigate = useNavigate();
  const correoUsuario = localStorage.getItem('usuarioEmail');

  const [misReservas, setMisReservas] = useState([]);
  const [talleres, setTalleres] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [ordenFecha, setOrdenFecha] = useState('');
  const [ordenPrecio, setOrdenPrecio] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [loading, setLoading] = useState(true);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [tallerSeleccionado, setTallerSeleccionado] = useState(null);
  const [datosTarjeta, setDatosTarjeta] = useState({ numero: '', cvv: '', vencimiento: '' });

  const menuRef = useRef();
  const precioRef = useRef();
  const fechaRef = useRef();
  const [showMenu, setShowMenu] = useState(false);
  const [showPrecioMenu, setShowPrecioMenu] = useState(false);
  const [showFechaMenu, setShowFechaMenu] = useState(false);

  useEffect(() => {
  getTalleres()
    .then(setTalleres)
    .catch(console.error)
    .finally(() => setLoading(false)); 

  if (correoUsuario)
    getReservas(correoUsuario).then(setMisReservas).catch(console.error);
}, []);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
      if (precioRef.current && !precioRef.current.contains(e.target)) setShowPrecioMenu(false);
      if (fechaRef.current && !fechaRef.current.contains(e.target)) setShowFechaMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePagarYReservar = async () => {
    if (!tallerSeleccionado?.id) return toast.error("Taller inválido");

    try {
      const resPago = await fetch("http://localhost:5004/pagar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosTarjeta)
      });
      const dataPago = await resPago.json();

      if (!resPago.ok) return toast.error("❌ " + dataPago.error);

      await crearReserva(correoUsuario, tallerSeleccionado.id);
      toast.success("✅ Reserva creada correctamente");

      setMostrarModal(false);
      setDatosTarjeta({ numero: '', cvv: '', vencimiento: '' });
      getReservas(correoUsuario).then(setMisReservas);
    } catch (error) {
      toast.error("❌ Error al contactar el servicio de pagos");
      console.error(error);
    }
  };

  const categorias = ['Todas', ...new Set(talleres.map(t => t.categoria))];

  const talleresFiltrados = talleres
    .filter(t => t.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .filter(t => categoriaSeleccionada === 'Todas' || t.categoria === categoriaSeleccionada)
    .sort((a, b) => {
      if (ordenFecha) return ordenFecha === 'asc' ? new Date(a.fecha) - new Date(b.fecha) : new Date(b.fecha) - new Date(a.fecha);
      if (ordenPrecio) return ordenPrecio === 'asc' ? a.precio - b.precio : b.precio - a.precio;
      return 0;
    });

  return (
    <>
      <header className="full-width-header">
        <div className="user-icon" ref={menuRef} onClick={() => setShowMenu(!showMenu)}>
          <img src="/Perfil.png" alt="Perfil" className="user-icon-inner" />
          {showMenu && (
            <div className="user-dropdown">
              <button onClick={() => navigate('/perfil')}> Perfil</button>
              <button onClick={() => navigate('/mis-reservas')}>Mis Reservas</button>
              <button onClick={() => { localStorage.removeItem('usuarioEmail'); toast.info('Sesión cerrada'); navigate('/'); }}>Cerrar sesión</button>
            </div>
          )}
        </div>
        <div className="header-center">
          <span className="search-prompt">¿Buscas un taller en específico?</span>
          <div className="search-container">
            <input type="text" className="search-bar" placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            <button className="search-button">
              <img src="/Lupa.png" alt="Buscar" className="search-icon" />
            </button>
          </div>
        </div>
        <img src="/Logo_Mastercook.png" alt="Logo MasterCook" className="logo-mastercook" />
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
                  <button onClick={() => { setOrdenFecha('asc'); setShowFechaMenu(false); }}>Más antigua</button>
                  <button onClick={() => { setOrdenFecha('desc'); setShowFechaMenu(false); }}>Más reciente</button>
                </div>
              )}
            </div>
            <select className="sort-button" value={categoriaSeleccionada} onChange={(e) => setCategoriaSeleccionada(e.target.value)}>
              {categorias.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
            </select>
          </div>
        </div>

        <div className="courses-container full-width-section">
          {loading ? <p>Cargando talleres...</p> : talleresFiltrados.map(taller => {
            const yaReservadoPagado = misReservas.some(r => r.taller_id === taller.id && r.pagado);
            const sinCupo = taller.cupo >= taller.cupo_total;

            return (
              <div className="course-card" key={taller.id}>
                <div className="course-content">
                  <h2 className="course-name">{taller.nombre}</h2>
                  <p className="course-description">{taller.descripcion || 'Descripción no disponible'}</p>
                  <div className="course-details">
                    <span className="course-date">📅 {taller.fecha}</span>
                    <span className="course-price">💰 Q{taller.precio}</span>
                    <p className="course-cupos">🎟️ Cupos: {taller.cupo}/{taller.cupo_total}</p>
                  </div>
                  <button
                    className="reserve-button"
                    disabled={sinCupo || yaReservadoPagado}
                    style={{
                      backgroundColor: sinCupo || yaReservadoPagado ? '#ccc' : '#6B8E23',
                      cursor: sinCupo || yaReservadoPagado ? 'not-allowed' : 'pointer'
                    }}
                    onClick={() => { setTallerSeleccionado(taller); setMostrarModal(true); }}
                  >
                    {sinCupo ? 'NO HAY CUPOS' : yaReservadoPagado ? 'YA RESERVADO' : 'RESERVAR'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {mostrarModal && (
          <div className="modal-pago" onClick={(e) => e.target.className === 'modal-pago' && setMostrarModal(false)}>
            <div className="modal-contenido">
              <h3>Pagar Taller</h3>
              <input placeholder="Número de tarjeta" value={datosTarjeta.numero} onChange={(e) => setDatosTarjeta({ ...datosTarjeta, numero: e.target.value })} />
              <input placeholder="CVV" value={datosTarjeta.cvv} onChange={(e) => setDatosTarjeta({ ...datosTarjeta, cvv: e.target.value })} />
              <input placeholder="Vencimiento (MM/AA)" value={datosTarjeta.vencimiento} onChange={(e) => setDatosTarjeta({ ...datosTarjeta, vencimiento: e.target.value })} />
              <div className="modal-acciones">
                <button onClick={() => setMostrarModal(false)}>Cancelar</button>
                <button onClick={handlePagarYReservar}>Pagar y Reservar</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
