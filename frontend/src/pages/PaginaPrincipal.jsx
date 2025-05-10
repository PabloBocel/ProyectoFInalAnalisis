import React, { useEffect, useState } from 'react';
import { getTalleres } from '../services/talleres';
import './PaginaPrincipal.css';

export default function PaginaPrincipal() {
  const [talleres, setTalleres] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
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

  const talleresFiltrados = categoriaSeleccionada === 'Todas'
    ? talleres
    : talleres.filter((t) => t.categoria === categoriaSeleccionada);

  return (
    <div className="pagina-container">
      <h2>Talleres Disponibles</h2>

      <select
        value={categoriaSeleccionada}
        onChange={(e) => setCategoriaSeleccionada(e.target.value)}
      >
        {categorias.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {loading ? (
        <p>Cargando talleres...</p>
      ) : (
        <div className="talleres-grid">
          {talleresFiltrados.map((taller) => (
            <div className="taller-card" key={taller.id}>
              <h3>{taller.nombre}</h3>
              <p><strong>Categoría:</strong> {taller.categoria}</p>
              <p><strong>Fecha:</strong> {taller.fecha}</p>
              <p><strong>Precio:</strong> Q{taller.precio}</p>
              <p><strong>Cupo:</strong> {taller.cupo}</p>
              <button>Reservar</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
