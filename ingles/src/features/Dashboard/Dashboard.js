import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/perfil-usuario.css';

// Dashboard adaptado: no incluye la barra superior del HTML original.
function PerfilUsuario({ alumnos = [], profesores = [], administradores = [], niveles = [], modalidades = [], grupos = [] }) {
  // Totales defensivos
  const totalAlumnos = Array.isArray(alumnos) ? alumnos.length : 0;
  const totalAlumnosActivos = (Array.isArray(alumnos) ? alumnos.filter(a => a.estado === 'Activo').length : 0);
  const totalProfesoresActivos = (Array.isArray(profesores) ? profesores.filter(p => p.estado === 'Activo').length : 0);
  const totalAdministradores = Array.isArray(administradores) ? administradores.length : 0;
  const totalNiveles = Array.isArray(niveles) ? niveles.length : 0;
  const totalModalidades = Array.isArray(modalidades) ? modalidades.length : 0;
  const totalGrupos = Array.isArray(grupos) ? grupos.length : 0;

  // Conteo por nivel y modalidad (se recalcula en cada render para reflejar cambios en tiempo real)
  const conteoPorNivel = {};
  (Array.isArray(niveles) ? niveles : []).forEach(n => { conteoPorNivel[n.nombre] = 0; });
  (Array.isArray(alumnos) ? alumnos : []).forEach(al => {
    if (al && al.nivel && Object.prototype.hasOwnProperty.call(conteoPorNivel, al.nivel)) {
      conteoPorNivel[al.nivel] = (conteoPorNivel[al.nivel] || 0) + 1;
    }
  });

  const conteoPorModalidad = {};
  (Array.isArray(modalidades) ? modalidades : []).forEach(m => { conteoPorModalidad[m.nombre] = 0; });
  (Array.isArray(alumnos) ? alumnos : []).forEach(al => {
    if (al && al.modalidad && Object.prototype.hasOwnProperty.call(conteoPorModalidad, al.modalidad)) {
      conteoPorModalidad[al.modalidad] = (conteoPorModalidad[al.modalidad] || 0) + 1;
    }
  });

  // Para las barras: calcular máximo para normalizar anchos
  const nivelCounts = Object.values(conteoPorNivel);
  const maxNivelCount = nivelCounts.length ? Math.max(...nivelCounts) : 1;

  return (
    <main className="dashboard-container">
      <div className="welcome-section">
        <h2 className="main-title">Dashboard</h2>
        <p className="main-subtitle">Bienvenido al Sistema de Gestión Escolar.</p>
      </div>

      <div className="stats-grid">
        <Link to="/lista-estudiantes" className="stat-card-link">
          <div className="stat-card students-card">
            <div className="stat-card-info">
              <p className="stat-card-title">ALUMNOS REGISTRADOS (Activos)</p>
              <p className="stat-card-value">{totalAlumnosActivos}</p>
              <p className="stat-card-detail">Total: {totalAlumnos}</p>
            </div>
            <div className="stat-card-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" className="stat-card-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Link>

        <Link to="/lista-profesores" className="stat-card-link">
          <div className="stat-card teachers-card">
            <div className="stat-card-info">
              <p className="stat-card-title">PROFESORES ACTIVOS</p>
              <p className="stat-card-value">{totalProfesoresActivos}</p>
              <p className="stat-card-detail">Total: {Array.isArray(profesores) ? profesores.length : 0}</p>
            </div>
            <div className="stat-card-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" className="stat-card-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>
          </div>
        </Link>

        <Link to="/lista-administradores" className="stat-card-link">
          <div className="stat-card admins-card">
            <div className="stat-card-info">
              <p className="stat-card-title">ADMINISTRADORES</p>
              <p className="stat-card-value">{totalAdministradores}</p>
              <p className="stat-card-detail">Personal completo</p>
            </div>
            <div className="stat-card-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" className="stat-card-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </Link>

  <Link to="/lista-niveles" className="stat-card-link">
          <div className="stat-card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
            <div className="stat-card-info">
              <p className="stat-card-title">NIVELES</p>
              <p className="stat-card-value">{totalNiveles}</p>
              <p className="stat-card-detail">Ver niveles</p>
            </div>
            <div className="stat-card-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" className="stat-card-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </Link>

  <Link to="/lista-modalidad" className="stat-card-link">
          <div className="stat-card" style={{ borderLeft: '4px solid #9b5cf6' }}>
            <div className="stat-card-info">
              <p className="stat-card-title">MODALIDADES</p>
              <p className="stat-card-value">{totalModalidades}</p>
              <p className="stat-card-detail">Ver modalidades</p>
            </div>
            <div className="stat-card-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" className="stat-card-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Link>

        <Link to="/lista-grupos" className="stat-card-link">
          <div className="stat-card" style={{ borderLeft: '4px solid #6b21a8' }}>
            <div className="stat-card-info">
              <p className="stat-card-title">GRUPOS ACTIVOS</p>
              <p className="stat-card-value">{totalGrupos}</p>
              <p className="stat-card-detail">Ver grupos</p>
            </div>
            <div className="stat-card-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" className="stat-card-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Horarios - nuevo botón que dirige a la lista de horarios */}
        <Link to="/lista-horarios" className="stat-card-link">
          <div className="stat-card" style={{ borderLeft: '4px solid #2b6cb0' }}>
            <div className="stat-card-info">
              <p className="stat-card-title">HORARIOS</p>
              <p className="stat-card-value">Ver</p>
              <p className="stat-card-detail">Horarios de profesores</p>
            </div>
            <div className="stat-card-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" className="stat-card-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a1 1 0 011 1v1h2V3a1 1 0 112 0v1h1a2 2 0 012 2v9a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 112 0v1h2V3a1 1 0 011-1zM7 9h6v2H7V9z" />
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Barra dinámica: Estudiantes por Nivel (se actualiza en tiempo real según props) */}
      <div className="card academic-levels-card" style={{ marginTop: 20 }}>
        <h3 className="card-section-title">Estudiantes por Nivel</h3>
        <div className="levels-grid" style={{ display: 'block' }}>
          {(Array.isArray(niveles) ? niveles : []).map((nivel) => {
            const count = conteoPorNivel[nivel.nombre] || 0;
            const pct = Math.round((count / (maxNivelCount || 1)) * 100);
            return (
              <div key={nivel.id} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ width: 140, fontSize: 12, color: '#374151' }}>{nivel.nombre}</div>
                  <div style={{ flex: 1, background: '#e6e6e6', borderRadius: 999, height: 24, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'var(--color-primary, #7A1F5C)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8, color: '#fff', fontSize: 12 }}>{count}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default PerfilUsuario;