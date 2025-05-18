import React, { useEffect, useState } from 'react';
import { getReservas, cancelarReserva, pagarReserva } from '../services/reservas';
import { getTalleres } from '../services/talleres';
import './MisReservas.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function MisReservas() {
  const [reservas, setReservas] = useState([]);
  const [talleres, setTalleres] = useState([]);
  const [loading, setLoading] = useState(true);
  const email = localStorage.getItem('usuarioEmail');
  const navigate = useNavigate();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [datosTarjeta, setDatosTarjeta] = useState({
    numero: '',
    cvv: '',
    vencimiento: ''
    });
    const abrirModalPago = (reservaId) => {
    setReservaSeleccionada(reservaId);
    setMostrarModal(true);
    };


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


  const nombreTaller = (id) => {
    const taller = talleres.find(t => t.id === id);
    return taller ? taller.nombre : `Taller #${id}`;
  };

  const handleCancelar = async (id) => {
    await cancelarReserva(id);
    setReservas(r => r.map(res => res.id === id ? { ...res, estado: 'cancelada' } : res));
  };

  const handlePago = async (id) => {
    await pagarReserva(id);
    setReservas(r => r.map(res => res.id === id ? { ...res, pagado: true } : res));
  };

  return (
  <>
    <header className="header-principal">
      <h1>MasterCook Academy</h1>
      <div className="perfil-nav">
        <button onClick={() => navigate('/inicio')}>📚 Cursos</button>
        <button onClick={() => navigate('/perfil')}>👤 Perfil</button>
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

    <div className="mis-reservas">
      <h2>Mis Reservas</h2>
      {loading ? (
        <p>Cargando reservas...</p>
      ) : reservas.length === 0 ? (
        <p>No tienes reservas aún.</p>
      ) : (
        <div className="reservas-lista">
          {reservas.map((r) => (
            <div key={r.id} className={`reserva-card ${r.estado}`}>
              <h3>{nombreTaller(r.taller_id)}</h3>
              <p>Estado: <strong>{r.estado}</strong></p>
              <p>Pagado: <strong>{r.pagado ? 'Sí' : 'No'}</strong></p>
              <div className="acciones">
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
          ))}
        </div>
      )}
    </div>
    {mostrarModal && (
        <div
            className="modal-pago"
            onClick={(e) => {
            if (e.target.className === 'modal-pago') {
                setMostrarModal(false);
            }
            }}>
        <div className="modal-contenido">
          <h3>Simular Pago</h3>
          <input
            placeholder="Número de tarjeta"
            value={datosTarjeta.numero}
            onChange={(e) =>
              setDatosTarjeta({ ...datosTarjeta, numero: e.target.value })
            }
          />
          <input
            placeholder="CVV"
            value={datosTarjeta.cvv}
            onChange={(e) =>
              setDatosTarjeta({ ...datosTarjeta, cvv: e.target.value })
            }
          />
          <input
            placeholder="Vencimiento (MM/AA)"
            value={datosTarjeta.vencimiento}
            onChange={(e) =>
              setDatosTarjeta({ ...datosTarjeta, vencimiento: e.target.value })
            }
          />
          <div className="modal-acciones">
            <button onClick={() => setMostrarModal(false)}>Cancelar</button>
            <button
              onClick={async () => {
                try {
                  const res = await fetch("http://localhost:5004/pagar", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(datosTarjeta),
                  });
                  const json = await res.json();
                  if (res.ok) {
                    await handlePago(reservaSeleccionada);
                    toast.success("✅ " + json.mensaje + " (" + json.tipo + ")", {icon: '✅',
                    style: {
                    background: '#E6F4EA',
                    color: '#2E7D32'}});
                    setMostrarModal(false);
                  } else {
                    toast.error("❌ " + json.error);
                  }
                } catch (e) {
                  toast.error("Error al contactar el servicio de pagos.");
                }
              }}
            >
              Pagar
            </button>
          </div>
        </div>
      </div>
    )}
  </>
);
}
