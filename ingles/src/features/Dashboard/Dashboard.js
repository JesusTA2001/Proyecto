import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/perfil-usuario.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Dashboard adaptado: no incluye la barra superior del HTML original.
function PerfilUsuario({ alumnos = [], profesores = [], administradores = [], grupos = [] }) {
  // Totales defensivos
  const totalAlumnos = Array.isArray(alumnos) ? alumnos.length : 0;
  const totalAlumnosActivos = (Array.isArray(alumnos) ? alumnos.filter(a => a.estado === 'Activo').length : 0);
  const totalProfesoresActivos = (Array.isArray(profesores) ? profesores.filter(p => p.estado === 'Activo').length : 0);
  const totalAdministradores = Array.isArray(administradores) ? administradores.length : 0;
  const totalGrupos = Array.isArray(grupos) ? grupos.length : 0;

  // Conteo por ubicación (Tecnológico vs Centro de Idiomas)
  const conteoPorUbicacion = {};
  (Array.isArray(alumnos) ? alumnos : []).forEach(al => {
    const ubicacion = al.ubicacion || 'Sin ubicación';
    conteoPorUbicacion[ubicacion] = (conteoPorUbicacion[ubicacion] || 0) + 1;
  });

  // Para las barras: calcular máximo para normalizar anchos
  const ubicacionCounts = Object.values(conteoPorUbicacion);
  const maxUbicacionCount = ubicacionCounts.length ? Math.max(...ubicacionCounts) : 1;

  // --- Configuración gráfica horizontal (Estudiantes por Ubicación) ---
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  const ubicacionLabels = Object.keys(conteoPorUbicacion);
  const ubicacionData = ubicacionLabels.map(l => conteoPorUbicacion[l] || 0);
  const colores = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'];
  const ubicacionChartData = {
    labels: ubicacionLabels,
    datasets: [
      {
        label: 'Estudiantes',
        data: ubicacionData,
        backgroundColor: ubicacionLabels.map((_, i) => colores[i % colores.length]),
        borderRadius: 8,
        maxBarThickness: 80,
        barPercentage: 0.6,
        categoryPercentage: 0.7
      }
    ]
  };

  const ubicacionChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, title: { display: false } },
    layout: { padding: { top: 8, right: 12, bottom: 8, left: 12 } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1, color: '#374151', font: { size: 12 } }, grid: { color: '#edf2f7' } }, x: { ticks: { autoSkip: false, color: '#374151', font: { size: 12 } }, grid: { color: '#f3f4f6' } } },
    elements: { bar: { borderRadius: 8, borderSkipped: false } }
  };

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

        {/* Periodos - nuevo botón para administrar periodos */}
        <Link to="/administrar-periodos" className="stat-card-link">
          <div className="stat-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
            <div className="stat-card-info">
              <p className="stat-card-title">ADMINISTRAR PERIODOS</p>
              <p className="stat-card-value">Gestionar</p>
              <p className="stat-card-detail">Periodos escolares</p>
            </div>
            <div className="stat-card-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" className="stat-card-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Barra dinámica: Estudiantes por Ubicación */}
      <div className="card academic-levels-card" style={{ marginTop: 20 }}>
        <h3 className="card-section-title">Estudiantes por Ubicación</h3>
        <div style={{ width: '100%', marginTop: 8 }}>
          {ubicacionLabels.length > 0 ? (
            <div style={{ height: Math.min(Math.max(ubicacionLabels.length * 64, 300), 520), width: '100%' }}>
              <Bar data={ubicacionChartData} options={ubicacionChartOptions} />
            </div>
          ) : (
            <p className="text-gray-500 text-center p-4">No hay datos para mostrar.</p>
          )}
        </div>
      </div>
    </main>
  );
}

export default PerfilUsuario;