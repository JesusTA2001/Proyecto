import React from 'react';
import { Link } from 'react-router-dom';
import '../hojas-de-estilo/perfil-usuario.css';
import '../imagenes/TecZamora.png';

// 1. Acepta los props de App.js
function PerfilUsuario({ alumnos, profesores, administradores, niveles, modalidades }) {
  
  // 2. Calcula los totales
  const totalAlumnos = alumnos.length;
  // Puedes ser más específico, por ejemplo, solo contar activos
  const totalAlumnosActivos = alumnos.filter(a => a.estado === 'Activo').length;
  const totalProfesoresActivos = profesores.filter(p => p.estado === 'Activo').length;
  const totalAdministradores = administradores.length;

  // 3. Calcula los conteos por Nivel y Modalidad
  // (Usamos useMemo para evitar recalcular en cada render, pero por simplicidad lo haremos directo)
  // (Si el rendimiento se vuelve lento, se puede optimizar con React.useMemo)

  const conteoPorNivel = {};
  for (const nivel of niveles) {
      conteoPorNivel[nivel.nombre] = 0; // Inicializa todos los niveles en 0
  }
  for (const alumno of alumnos) {
      if (conteoPorNivel.hasOwnProperty(alumno.nivel)) {
          conteoPorNivel[alumno.nivel]++; // Suma 1 si el alumno tiene ese nivel
      }
  }

  const conteoPorModalidad = {};
  for (const mod of modalidades) {
      conteoPorModalidad[mod.nombre] = 0; // Inicializa todas las modalidades en 0
  }
  for (const alumno of alumnos) {
      if (conteoPorModalidad.hasOwnProperty(alumno.modalidad)) {
          conteoPorModalidad[alumno.modalidad]++; // Suma 1
      }
  }


  return (
    <main className="dashboard-container">
      <div className="welcome-section">
        <h2 className="main-title">Dashboard</h2>
        <p className="main-subtitle">Bienvenido al Sistema de Gestión Escolar.</p>
      </div>

      {/* --- Rejilla de Métricas con Enlaces (DATOS DINÁMICOS) --- */}
      <div className="stats-grid">
        
        {/* Tarjeta de Alumnos */}
        <Link to="/lista-estudiantes" className="stat-card-link">
          <div className="stat-card students-card">
            <div className="stat-card-info">
              <p className="stat-card-title">ALUMNOS REGISTRADOS (Activos)</p>
              {/* 4. Muestra la variable calculada */}
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

        {/* Tarjeta de Profesores */}
        <Link to="/lista-profesores" className="stat-card-link">
          <div className="stat-card teachers-card">
            <div className="stat-card-info">
              <p className="stat-card-title">PROFESORES ACTIVOS</p>
               {/* 4. Muestra la variable calculada */}
              <p className="stat-card-value">{totalProfesoresActivos}</p>
              <p className="stat-card-detail">Total: {profesores.length}</p>
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
               {/* 4. Muestra la variable calculada */}
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
      </div>

      {/* --- Sección de Niveles Académicos (DATOS DINÁMICOS) --- */}
      <div className="card academic-levels-card">
        <h3 className="card-section-title">Alumnos por Nivel Académico</h3>
        <div className="levels-grid">
            {/* 4. Mapea sobre la lista de niveles y muestra el conteo */}
            {niveles.map(nivel => (
              <div className="level-item" key={nivel.id}>
                  <span>{nivel.nombre}</span>
                  <strong>{conteoPorNivel[nivel.nombre] || 0}</strong>
              </div>
            ))}
            
            <div className="level-item-total">
                <span>Total Alumnos</span>
                <strong>{totalAlumnos}</strong>
            </div>
        </div>
      </div>
      
      {/* --- Sección de Modalidad (DATOS DINÁMICOS) --- */}
        <div className="card academic-levels-card">
        <h3 className="card-section-title">Alumnos por Modalidad</h3>
        <div className="levels-grid">
            {/* 4. Mapea sobre la lista de modalidades y muestra el conteo */}
            {modalidades.map(mod => (
                 <div className="level-item" key={mod.id}>
                    <span>{mod.nombre}</span>
                    <strong>{conteoPorModalidad[mod.nombre] || 0}</strong>
                 </div>
            ))}
           
            <div className="level-item-total">
                <span>Total Alumnos</span>
                <strong>{totalAlumnos}</strong>
            </div>
        </div>
      </div>
    </main>
  );
}

export default PerfilUsuario;