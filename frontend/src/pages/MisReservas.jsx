import React, { useEffect, useRef, useState } from 'react';
import { getReservas, cancelarReserva, pagarReserva } from '../services/reservas';
import { getTalleres } from '../services/talleres';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './MisReservas.css';

export default function MisReservas() {
  const [reservas, setReservas] = useState([]);
  const [talleres, setTalleres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const email = localStorage.getItem('usuarioEmail');
  const navigate = useNavigate();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [datosTarjeta, setDatosTarjeta] = useState({
    numero: '',
    cvv: '',
    vencimiento: ''
  });

  const menuRef = useRef();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!email) return;

    Promise.all([getReservas(email), getTalleres()])
      .then(([res, talls]) => {
        setReservas(res);
        setTalleres(talls);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al cargar', err);
        setLoading(false);
      });
  }, []);

  const nombreTaller = (id) => talleres.find(t => t.id === id)?.nombre || `Taller #${id}`;
  const imagenTaller = (id) => talleres.find(t => t.id === id)?.imagen || '/placeholder.jpg';
  const precioTaller = (id) => talleres.find(t => t.id === id)?.precio || '--';
  const fechaTaller = (id) => talleres.find(t => t.id === id)?.fecha || '--';

  const handleCancelar = async (id) => {
    await cancelarReserva(id);
    setReservas(r => r.map(res => res.id === id ? { ...res, estado: 'cancelada' } : res));
  };

  const handlePago = async (id) => {
    await pagarReserva(id);
    setReservas(r => r.map(res => res.id === id ? { ...res, pagado: true } : res));
  };

  const abrirModalPago = (reservaId) => {
    setReservaSeleccionada(reservaId);
    setMostrarModal(true);
  };

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

        {loading ? (
          <p>Cargando reservas...</p>
        ) : reservas.length === 0 ? (
          <p>No tienes reservas aún.</p>
        ) : (
          <div className="reservas-grid">
            {reservas.map((r) => (
              <div key={r.id} className="reserva-card">
                <div className="reserva-imagen">
                  <img src={imagenTaller(r.taller_id)} alt={nombreTaller(r.taller_id)} />
                  <div className="course-date-price">
                    <span>{fechaTaller(r.taller_id)}</span>
                    <span>Q.{precioTaller(r.taller_id)}</span>
                  </div>
                </div>

                <div className="reserva-info">
                  <h3 className="reserva-titulo">{nombreTaller(r.taller_id)}</h3>
                  <p><strong>Estado:</strong> {r.estado}</p>
                  <p><strong>Pagado:</strong> {r.pagado ? 'Sí' : 'No'}</p>

                  <div className="reserva-acciones">
                    {r.estado !== 'cancelada' && (
                      <>
                        {!r.pagado && (
                          <button onClick={() => abrirModalPago(r.id)}>💳 Pagar</button>
                        )}
                        <button onClick={() => handleCancelar(r.id)}>❌ Cancelar</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {mostrarModal && (
        <div className="modal-pago" onClick={(e) => e.target.className === 'modal-pago' && setMostrarModal(false)}>
          <div className="modal-contenido">
            <h3>Pago</h3>
            <input placeholder="Número de tarjeta" value={datosTarjeta.numero} onChange={e => setDatosTarjeta({ ...datosTarjeta, numero: e.target.value })} />
            <input placeholder="CVV" value={datosTarjeta.cvv} onChange={e => setDatosTarjeta({ ...datosTarjeta, cvv: e.target.value })} />
            <input placeholder="Vencimiento (MM/AA)" value={datosTarjeta.vencimiento} onChange={e => setDatosTarjeta({ ...datosTarjeta, vencimiento: e.target.value })} />

            <div className="modal-acciones">
              <button onClick={() => setMostrarModal(false)}>Cancelar</button>
              <button onClick={async () => {
                try {
                  const res = await fetch("http://localhost:5004/pagar", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(datosTarjeta),
                  });
                  const json = await res.json();
                  if (res.ok) {
                    await handlePago(reservaSeleccionada);
                    toast.success("✅ " + json.mensaje + " (" + json.tipo + ")", {
                      icon: '✅',
                      style: {
                        background: '#E6F4EA',
                        color: '#2E7D32'
                      }
                    });
                    setMostrarModal(false);
                  } else {
                    toast.error("❌ " + json.error);
                  }
                } catch (e) {
                  toast.error("Error al contactar el servicio de pagos.");
                }
              }}>
                Pagar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
