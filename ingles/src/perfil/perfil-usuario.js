import React from 'react';
import { Link } from 'react-router-dom';
import '../hojas-de-estilo/perfil-usuario.css'; // Asegúrate de que este archivo CSS tenga los estilos que te proporcioné.
import '../imagenes/TecZamora.png';

function PerfilUsuario() {
  return (
    <main className="dashboard-container">
      <div className="welcome-section">
        <h2 className="main-title">Panel de Control</h2>
        <p className="main-subtitle">Bienvenido al sistema de gestión escolar - Resumen ejecutivo</p>
      </div>

      {/* --- Rejilla de Métricas con Enlaces --- */}
      <div className="stats-grid">
        
        {/* Tarjeta de Alumnos */}
        <Link to="/lista-estudiantes" className="stat-card-link">
          <div className="stat-card students-card">
            <div className="stat-card-info">
              <p className="stat-card-title">ALUMNOS REGISTRADOS</p>
              <p className="stat-card-value">1,247</p>
              <p className="stat-card-detail positive-detail">+12% este mes</p>
            </div>
            <div className="stat-card-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" className="stat-card-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Tarjeta de Profesores */}
        <Link to="/lista-profesores" className="stat-card-link">
          <div className="stat-card teachers-card">
            <div className="stat-card-info">
              <p className="stat-card-title">PROFESORES ACTIVOS</p>
              <p className="stat-card-value">89</p>
              <p className="stat-card-detail">3 nuevos contratados</p>
            </div>
            <div className="stat-card-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" className="stat-card-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Tarjeta de Administradores */}
        <Link to="/lista-administradores" className="stat-card-link">
          <div className="stat-card admins-card">
            <div className="stat-card-info">
              <p className="stat-card-title">ADMINISTRADORES</p>
              <p className="stat-card-value">12</p>
              <p className="stat-card-detail">Personal completo</p>
            </div>
            <div className="stat-card-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" className="stat-card-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* --- Sección de Niveles Académicos (sin cambios) --- */}
      <div className="card academic-levels-card">
        <h3 className="card-section-title">Niveles Académicos</h3>
        <div className="levels-grid">
            <div className="level-item"><span>Nivel Intro</span> <strong>89</strong></div>
            <div className="level-item"><span>Nivel 1</span> <strong>156</strong></div>
            <div className="level-item"><span>Nivel 2</span> <strong>203</strong></div>
            <div className="level-item"><span>Nivel 3</span> <strong>187</strong></div>
            <div className="level-item"><span>Nivel 4</span> <strong>234</strong></div>
            <div className="level-item"><span>Nivel 5</span> <strong>198</strong></div>
            <div className="level-item"><span>Nivel 6</span> <strong>180</strong></div>
            <div className="level-item"><span>Conversacion 1</span> <strong>180</strong></div>
            <div className="level-item"><span>Conversacion 2</span> <strong>180</strong></div>
            <div className="level-item"><span>Diplomado 1</span> <strong>180</strong></div>
            <div className="level-item"><span>Diplomado 2</span> <strong>180</strong></div>
            <div className="level-item-total">
                <span>Total</span>
                <strong>1,247</strong>
            </div>
        </div>
      </div>
    </main>
  );
}

export default PerfilUsuario;