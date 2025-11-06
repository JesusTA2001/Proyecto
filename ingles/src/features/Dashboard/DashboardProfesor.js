import React from "react";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "../../styles/dashboardProfesor.css"; // opcional si luego quieres CSS personalizado
// Importa los estilos compartidos para las tarjetas
import '../../styles/perfil-usuario.css'; 
import '../../styles/PortalCalificaciones.css';


function DashboardProfesor({ data, profesor, gruposAsignados = [] }) {
  
  const [totalGrupos, setTotalGrupos] = useState(0);
  const [totalEstudiantes, setTotalEstudiantes] = useState(0);
  const [promedioGeneral, setPromedioGeneral] = useState(0);

  // Calcular valores dinámicos
  useEffect(() => {
    setTotalGrupos(gruposAsignados.length); 

    if (data && data.length > 0) {
      setTotalEstudiantes(data.length);

      // Promedio general simulado (como lo tenías)
      const promedio = 8 + Math.random() * 1; 
      setPromedioGeneral(promedio.toFixed(1));
    }
  }, [data, gruposAsignados]);

  return (
    <div className="portal-container" style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <main className="flex-1 flex flex-col gap-6">
        <div className="stats-grid">
          
          {/* --- CORRECCIÓN AQUÍ --- */}
          {/* Este Link ahora apunta a "/profesor/mis-grupos" */}
          <Link to="/profesor/mis-grupos" className="stat-card-link">
            <div className="stat-card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
              <div className="stat-card-info">
                <p className="stat-card-title">TOTAL GRUPOS</p>
                <p className="stat-card-value">{totalGrupos}</p>
              </div>
              <div className="stat-card-icon-wrapper" style={{ backgroundColor: 'var(--color-primary-light, #f3e8ff)', color: 'var(--color-primary, #7A1F5C)' }}>👥</div>
            </div>
          </Link>

          {/* Tarjeta 2: Total Estudiantes (Este puede ir a portal-calificaciones o mis-grupos) */}
          <Link to="/profesor/portal-calificaciones" className="stat-card-link">
            <div className="stat-card" style={{ borderLeft: '4px solid #2563eb' }}>
              <div className="stat-card-info">
                <p className="stat-card-title">TOTAL ESTUDIANTES</p>
                <p className="stat-card-value">{totalEstudiantes}</p>
              </div>
              <div className="stat-card-icon-wrapper" style={{ backgroundColor: '#dbeafe', color: '#2563eb' }}>🎓</div>
            </div>
          </Link>

          {/* Tarjeta 3: Asistencia Hoy */}
          <Link to="/profesor/asistencia" className="stat-card-link">
            <div className="stat-card" style={{ borderLeft: '4px solid #16a34a' }}>
              <div className="stat-card-info">
                <p className="stat-card-title">ASISTENCIA HOY</p>
                <p className="stat-card-value">Ir</p>
              </div>
              <div className="stat-card-icon-wrapper" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>📅</div>
            </div>
          </Link>

          {/* Tarjeta 4: Promedio General (Simulado) */ }
          <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
            <div className="stat-card-info">
              <p className="stat-card-title">PROMEDIO GENERAL (Sim.)</p>
              <p className="stat-card-value">{promedioGeneral}</p>
            </div>
            <div className="stat-card-icon-wrapper" style={{ backgroundColor: '#fef3c7', color: '#f59e0b' }}>⭐</div>
          </div>

          {/* Tarjeta 5: Asignar Calificaciones */ }
          <Link to="/profesor/calificaciones" className="stat-card-link" style={{ marginLeft: 0 }}>
            <div className="stat-card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
              <div className="stat-card-info">
                <p className="stat-card-title">ASIGNAR CALIFICACIONES</p>
                <p className="stat-card-value">Ir</p>
              </div>
              <div className="stat-card-icon-wrapper" style={{ backgroundColor: 'var(--color-primary-light, #f3e8ff)', color: 'var(--color-primary, #7A1F5C)' }}>✏️</div>
            </div>
          </Link>
          
          {/* Tarjeta 6: Portal de Alumnos */ }
          <Link to="/profesor/portal-calificaciones" className="stat-card-link">
            <div className="stat-card" style={{ borderLeft: '4px solid #0891b2' }}> {/* Color cian */}
              <div className="stat-card-info">
                <p className="stat-card-title">PORTAL DE ALUMNOS</p>
                <p className="stat-card-value">Ver</p>
              </div>
              <div className="stat-card-icon-wrapper" style={{ backgroundColor: '#cffafe', color: '#0891b2' }}>📓</div>
            </div>
          </Link>

        </div>

        {/* Sección de grupos (Lista en el dashboard) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-white rounded-lg shadow-sm p-6 flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              📘 Mis Grupos Asignados
            </h2>
            {gruposAsignados.length > 0 ? (
              gruposAsignados.map((grupo) => (
                <div
                  key={grupo.id}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800">{grupo.nombre}</p>
                    <p className="text-sm text-gray-600">
                      {grupo.modalidad} - {grupo.dia} ({grupo.horaInicio} - {grupo.horaFin})
                    </p>
                  </div>
                  <span className="grade-badge" style={{ backgroundColor: '#f3e8ff', color: 'var(--color-primary)'}}>
                    {grupo.alumnoIds.length} estudiantes
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center p-4">No tienes grupos asignados.</p>
            )}
          </div>

          {/* Estudiantes por Grupo (Gráfico de barras) */}
          <div className="card-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              📊 Estudiantes por Grupo
            </h2>
            <div className="flex flex-col gap-4">
             {gruposAsignados.length > 0 && totalEstudiantes > 0 ? (
                gruposAsignados.map((grupo) => {
                  const porcentaje = Math.max(
                    1, 
                    (grupo.alumnoIds.length / totalEstudiantes) * 100
                  );
                  return (
                    <div key={grupo.id}>
                      <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                        <span>{grupo.nombre}</span>
                        <span>{grupo.alumnoIds.length}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{ 
                            width: `${porcentaje}%`, 
                            backgroundColor: 'var(--color-primary)' 
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })
             ) : (
                <p className="text-gray-500 text-center p-4">No hay datos de estudiantes para mostrar.</p>
             )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardProfesor;