import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  const scrollToCursos = () => {
    const section = document.getElementById('cursos');
    section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1 onClick={scrollToCursos} style={{ cursor: 'pointer' }}>MasterCook Academy</h1>
          <p>Descubre el arte de cocinar con pasión.</p>
          <div className="hero-buttons">
            <button onClick={() => navigate('/Login')}>Iniciar sesión</button>
            <button onClick={() => navigate('/Register')}>Registrarse</button>
          </div>
        </div>
      </section>

      <section id="cursos" className="cursos-section">
        <h2>Cursos destacados</h2>
        <div className="cursos-grid">
          <div className="curso-card">
            <h3>Cocina Internacional</h3>
            <p>Aprende a preparar platillos de todo el mundo con técnicas auténticas.</p>
            <p>⭐️⭐️⭐️⭐️☆ (4.5/5)</p>
          </div>
          <div className="curso-card">
            <h3>Repostería Creativa</h3>
            <p>Desde cupcakes hasta pasteles temáticos. Despierta tu creatividad.</p>
            <p>⭐️⭐️⭐️⭐️⭐️ (5/5)</p>
          </div>
          <div className="curso-card">
            <h3>Cocina Saludable</h3>
            <p>Platos balanceados y deliciosos. Ideal para un estilo de vida saludable.</p>
            <p>⭐️⭐️⭐️⭐️☆ (4.3/5)</p>
          </div>
          <div className="curso-card">
            <h3>Técnicas Avanzadas</h3>
            <p>Domina las habilidades de chef: cortes, salsas, emplatado y más.</p>
            <p>⭐️⭐️⭐️⭐️⭐️ (5/5)</p>
          </div>
        </div>
      </section>
    </>
  );
}
