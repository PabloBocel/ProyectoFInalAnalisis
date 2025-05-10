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
      <header className="landing-header">
        <div className="logo">MASTERCOOK ACADEMY</div>
        <nav>
          <button onClick={scrollToCursos}>Home</button>
          {/* Contact eliminado */}
        </nav>
      </header>

      <section className="hero">
  <div className="hero-content">
    <h1>MasterCook Academy</h1>
    <p>Descubre el arte de cocinar con pasión.</p>
    <div className="hero-buttons">
      <button onClick={() => navigate('/login')}>Iniciar sesión</button>
      <button onClick={() => navigate('/login')}>Registrarse</button>
    </div>
  </div>
</section>


      <section id="cursos" className="cursos-section">
        <h2>Cursos destacados</h2>
        <div className="cursos-grid">
          <div className="curso-card">Cocina Internacional</div>
          <div className="curso-card">Repostería Creativa</div>
          <div className="curso-card">Cocina Saludable</div>
          <div className="curso-card">Técnicas Avanzadas</div>
        </div>
      </section>
    </>
  );
}
