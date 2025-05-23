import React, { useEffect, useRef, useState } from 'react';
import { getReservas, cancelarReserva } from '../services/reservas';
import { getTalleres } from '../services/talleres';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './MisReservas.css';

export default function MisReservas() {
  const [reservas, setReservas] = useState([]);
  const [talleres, setTalleres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [verCanceladas, setVerCanceladas] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [reservaPorCancelar, setReservaPorCancelar] = useState(null);

  const email = localStorage.getItem('usuarioEmail');
  const navigate = useNavigate();
  const menuRef = useRef();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!email) return;

    Promise.all([getReservas(email), getTalleres()])
      .then(([res, talls]) => {
        const soloPagadas = res.filter(r => r.pagado);
        setReservas(soloPagadas);
        setTalleres(talls);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al cargar', err);
        setLoading(false);
      });
  }, []);

  const nombreTaller = (id) => talleres.find(t => t.id === id)?.nombre || `Taller #${id}`;
  const precioTaller = (id) => talleres.find(t => t.id === id)?.precio || '--';
  const fechaTaller = (id) => talleres.find(t => t.id === id)?.fecha || '--';
  const cupoTaller = (id) => {
    const t = talleres.find(t => t.id === id);
    return t ? `${t.cupo}/${t.cupo_total}` : '--';
  };

  const handleCancelar = async (id) => {
    await cancelarReserva(id);
    setReservas(r => r.map(res => res.id === id ? { ...res, estado: 'cancelada' } : res));
    toast.success('Reserva cancelada exitosamente.');
  };

  const reservasMostradas = reservas.filter(r =>
    (verCanceladas ? r.estado === 'cancelada' : r.estado !== 'cancelada') &&
    nombreTaller(r.taller_id).toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <header className="full-width-header">
        <div className="user-icon" ref={menuRef} onClick={() => setShowMenu(!showMenu)}>
          <img src="/Perfil.png" alt="Perfil" className="user-icon-inner" />
          {showMenu && (
            <div className="user-dropdown">
              <button onClick={() => navigate('/perfil')}>Perfil</button>
              <button onClick={() => navigate('/inicio')}>Cursos</button>
              <button onClick={() => {
                localStorage.removeItem('usuarioEmail');
                toast.info('Sesión cerrada con éxito');
                navigate('/');
              }}>Cerrar sesión</button>
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

        <img src="/Logo_Mastercook.png" alt="MasterCook Academy" className="logo-mastercook" />
      </header>

      <main className="reservation-main">
        <h1 className="reservation-title">MIS RESERVAS</h1>

        <div className="tabs-container">
          <button className={verCanceladas ? '' : 'active-tab'} onClick={() => setVerCanceladas(false)}>Activas</button>
          <button className={verCanceladas ? 'active-tab' : ''} onClick={() => setVerCanceladas(true)}>Canceladas</button>
        </div>

        {loading ? (
          <p>Cargando reservas...</p>
        ) : reservasMostradas.length === 0 ? (
          <p>{verCanceladas ? 'No tienes reservas canceladas.' : 'No tienes reservas activas.'}</p>
        ) : (
          <div className="reservas-grid">
            {reservasMostradas.map((r) => (
              <div key={r.id} className="reserva-card hoverable" onClick={() => {
                setReservaSeleccionada(r);
                setMostrarDetalle(true);
              }}>
                <div className="reserva-info">
                  <h3 className="reserva-titulo">{nombreTaller(r.taller_id)}</h3>
                  <p><strong>Estado:</strong> {r.estado}</p>
                  <p><strong>Pagado:</strong> Sí</p>

                  {!verCanceladas && r.estado !== 'completada' && (
                    <div className="reserva-acciones">
                      <button onClick={(e) => {
                        e.stopPropagation();
                        setReservaPorCancelar(r);
                        setMostrarConfirmacion(true);
                      }}>❌ Cancelar</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {mostrarDetalle && reservaSeleccionada && (
          <div className="modal-pago" onClick={(e) => e.target.className === 'modal-pago' && setMostrarDetalle(false)}>
            <div className="modal-contenido">
              <h3>Detalles del Taller</h3>
              <p><strong>Nombre:</strong> {nombreTaller(reservaSeleccionada.taller_id)}</p>
              <p><strong>Fecha:</strong> {fechaTaller(reservaSeleccionada.taller_id)}</p>
              <p><strong>Cupos:</strong> {cupoTaller(reservaSeleccionada.taller_id)}</p>
              <p><strong>Precio:</strong> Q{precioTaller(reservaSeleccionada.taller_id)}</p>
              <div className="modal-acciones">
                <button onClick={() => setMostrarDetalle(false)}>Cerrar</button>
              </div>
            </div>
          </div>
        )}

        {mostrarConfirmacion && reservaPorCancelar && (
          <div className="modal-pago" onClick={(e) => e.target.className === 'modal-pago' && setMostrarConfirmacion(false)}>
            <div className="modal-contenido">
              <h3>¿Estás seguro de cancelar tu reserva?</h3>
              <p>Esta acción es irreversible, ten en cuenta lo siguiente:</p>
              <ul>
                <li><strong>1. No se reembolsará lo ya cancelado</strong></li>
                <li><strong>2. No podrás reservar el mismo taller hasta que se publique una fecha nueva para el mismo</strong></li>
              </ul>
              <div className="modal-acciones">
                <button onClick={() => {
                  setMostrarConfirmacion(false);
                  setReservaPorCancelar(null);
                }}>
                    No, regresar
                </button>
                <button onClick={async () => {
                  await handleCancelar(reservaPorCancelar.id);
                  setMostrarConfirmacion(false);
                  setReservaPorCancelar(null);
                }}>
                    Sí, estoy de acuerdo
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
