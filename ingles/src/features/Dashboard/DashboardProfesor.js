import React from "react";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "../../styles/dashboardProfesor.css"; // opcional si luego quieres CSS personalizado

function DashboardProfesor({ data, profesor }) {
  const [totalGrupos, setTotalGrupos] = useState(0);
  const [totalEstudiantes, setTotalEstudiantes] = useState(0);
  const [promedioGeneral, setPromedioGeneral] = useState(0);
  const [asistenciaHoy, setAsistenciaHoy] = useState(0);

  // Calcular valores dinámicos a partir del arreglo "data"
  useEffect(() => {
    if (data && data.length > 0) {
      // Ejemplo: agrupar por nivel o grupo
      const grupos = new Set(data.map((alumno) => alumno.nivel));
      setTotalGrupos(grupos.size);
      setTotalEstudiantes(data.length);

      // Promedio general simulado si no hay campo de calificación
      const promedio = 8 + Math.random() * 1; // simula 8.0 - 9.0
      setPromedioGeneral(promedio.toFixed(1));

      // Asistencia simulada (en %)
      const asistencia = 85 + Math.random() * 10;
      setAsistenciaHoy(asistencia.toFixed(0));
    }
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-[#7A1F5C] text-white shadow-lg p-4 flex justify-between items-center">
      </header>

      {/* Contenido principal */}
      <main className="flex-1 p-6 flex flex-col gap-6">
        {/* Tarjetas de estadísticas rápidas (usar mismo estilo que Dashboard admin) */}
        <div className="stats-grid">
          <Link to="/lista-grupos" className="stat-card-link">
            <div className="stat-card" style={{ borderLeft: '4px solid #7A1F5C' }}>
              <div className="stat-card-info">
                <p className="stat-card-title">TOTAL GRUPOS</p>
                <p className="stat-card-value">{totalGrupos}</p>
              </div>
              <div className="stat-card-icon-wrapper">👥</div>
            </div>
          </Link>

          <Link to="/lista-estudiantes" className="stat-card-link">
            <div className="stat-card" style={{ borderLeft: '4px solid #2563eb' }}>
              <div className="stat-card-info">
                <p className="stat-card-title">TOTAL ESTUDIANTES</p>
                <p className="stat-card-value">{totalEstudiantes}</p>
              </div>
              <div className="stat-card-icon-wrapper">🎓</div>
            </div>
          </Link>

          <div className="stat-card" style={{ borderLeft: '4px solid #16a34a' }}>
            <div className="stat-card-info">
              <p className="stat-card-title">ASISTENCIA HOY</p>
              <p className="stat-card-value">{`${asistenciaHoy}%`}</p>
            </div>
            <div className="stat-card-icon-wrapper">📅</div>
          </div>

          <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
            <div className="stat-card-info">
              <p className="stat-card-title">PROMEDIO GENERAL</p>
              <p className="stat-card-value">{promedioGeneral}</p>
            </div>
            <div className="stat-card-icon-wrapper">⭐</div>
          </div>

          {/* Tarjeta para asignar calificaciones */}
          <Link to="/profesor/calificaciones" className="stat-card-link" style={{ marginLeft: 0 }}>
            <div className="stat-card" style={{ borderLeft: '4px solid #7A1F5C' }}>
              <div className="stat-card-info">
                <p className="stat-card-title">ASIGNAR CALIFICACIONES</p>
                <p className="stat-card-value">Ir</p>
              </div>
              <div className="stat-card-icon-wrapper">✏️</div>
            </div>
          </Link>
        </div>

        {/* Sección de grupos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mis Grupos Asignados */}
          <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              📘 Mis Grupos Asignados
            </h2>
            {Array.from(new Set(data.map((a) => a.nivel))).map((nivel) => {
              const grupoAlumnos = data.filter((a) => a.nivel === nivel);
              return (
                <div
                  key={nivel}
                  className="flex justify-between bg-gray-50 p-3 rounded-lg items-center"
                >
                  <div>
                    <p className="font-medium text-gray-800">{nivel}</p>
                    <p className="text-sm text-gray-600">
                      {grupoAlumnos[0]?.modalidad || "Modalidad desconocida"}
                    </p>
                  </div>
                  <span className="bg-purple-100 text-[#7A1F5C] px-3 py-1 rounded-full text-sm font-medium">
                    {grupoAlumnos.length} estudiantes
                  </span>
                </div>
              );
            })}
          </div>

          {/* Estudiantes por Grupo */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              📊 Estudiantes por Grupo
            </h2>
            <div className="flex flex-col gap-3">
              {Array.from(new Set(data.map((a) => a.nivel))).map((nivel) => {
                const grupoAlumnos = data.filter((a) => a.nivel === nivel);
                const porcentaje = Math.min(
                  100,
                  (grupoAlumnos.length / totalEstudiantes) * 100
                );
                return (
                  <div key={nivel}>
                    <div className="flex justify-between text-sm font-medium text-gray-700">
                      <span>{nivel}</span>
                      <span>{grupoAlumnos.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="h-2 rounded-full bg-[#7A1F5C]"
                        style={{ width: `${porcentaje}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Subcomponente para tarjetas de estadísticas
function StatCard({ color, icon, label, value }) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-4 border-l-4 ${color} flex items-center gap-3`}
    >
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export default DashboardProfesor;