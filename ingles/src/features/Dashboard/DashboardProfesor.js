import React from "react";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "../../styles/dashboardProfesor.css"; // opcional si luego quieres CSS personalizado

// MODIFICADO: Añadimos 'gruposAsignados'
function DashboardProfesor({ data, profesor, gruposAsignados = [] }) {
  
  // MODIFICADO: Usamos 'gruposAsignados' para el total
  const [totalGrupos, setTotalGrupos] = useState(0);
  const [totalEstudiantes, setTotalEstudiantes] = useState(0);
  const [promedioGeneral, setPromedioGeneral] = useState(0);
  const [asistenciaHoy, setAsistenciaHoy] = useState(0);

  // Calcular valores dinámicos
  useEffect(() => {
    // MODIFICADO: Lógica de grupos
    setTotalGrupos(gruposAsignados.length); 

    if (data && data.length > 0) {
      setTotalEstudiantes(data.length);

      // Promedio general simulado (como lo tenías)
      const promedio = 8 + Math.random() * 1; 
      setPromedioGeneral(promedio.toFixed(1));

      // Asistencia simulada (como lo tenías)
      const asistencia = 85 + Math.random() * 10;
      setAsistenciaHoy(asistencia.toFixed(0));
    }
  // MODIFICADO: Añadimos 'gruposAsignados' a las dependencias
  }, [data, gruposAsignados]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header (Tu código original) */}
      <header className="bg-[#7A1F5C] text-white shadow-lg p-4 flex justify-between items-center">
        {/* Tu header aquí */}
      </header>

      {/* Contenido principal */}
      <main className="flex-1 p-6 flex flex-col gap-6">
        {/* Tarjetas de estadísticas (Tu código original) */}
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

          {/* --- AÑADIDO: Botón Asistencia Hoy --- */}
          {/* Usa el emoji 📅 que ya tenías para "Asistencia Hoy" simulada */}
          <Link to="/profesor/asistencia" className="stat-card-link">
            <div className="stat-card" style={{ borderLeft: '4px solid #16a34a' }}>
              <div className="stat-card-info">
                <p className="stat-card-title">ASISTENCIA HOY</p>
                <p className="stat-card-value">Ir</p>
              </div>
              <div className="stat-card-icon-wrapper">📅</div>
            </div>
          </Link>

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
          
          {/* --- AÑADIDO: Botón Portal de Alumnos --- */}
          <Link to="/profesor/portal-calificaciones" className="stat-card-link">
            <div className="stat-card" style={{ borderLeft: '4px solid #0891b2' }}> {/* Color cian */}
              <div className="stat-card-info">
                <p className="stat-card-title">PORTAL DE ALUMNOS</p>
                <p className="stat-card-value">Ver</p>
              </div>
              <div className="stat-card-icon-wrapper">📓</div>
            </div>
          </Link>

        </div>

        {/* Sección de grupos (Tu código original) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              📘 Mis Grupos Asignados
            </h2>
            {/* MODIFICADO: Usamos gruposAsignados para la lista */
            gruposAsignados.map((grupo) => {
              const grupoAlumnos = data.filter((a) => a.grupo_actual_id === grupo.id); // Asumiendo que 'data' (alumnos) tiene 'grupo_actual_id'
              return (
                <div
                  key={grupo.id}
                  className="flex justify-between bg-gray-50 p-3 rounded-lg items-center"
                >
                  <div>
                    <p className="font-medium text-gray-800">{grupo.nombre}</p>
                    <p className="text-sm text-gray-600">
                      {grupo.modalidad} - {grupo.dia}
                    </p>
                  </div>
                  <span className="bg-purple-100 text-[#7A1F5C] px-3 py-1 rounded-full text-sm font-medium">
                    {grupo.alumnoIds.length} estudiantes
                  </span>
                </div>
              );
            })}
          </div>

          {/* Estudiantes por Grupo (Tu código original) */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              📊 Estudiantes por Grupo
            </h2>
            <div className="flex flex-col gap-3">
              {gruposAsignados.map((grupo) => {
                const porcentaje = Math.min(
                  100,
                  (grupo.alumnoIds.length / totalEstudiantes) * 100
                );
                return (
                  <div key={grupo.id}>
                    <div className="flex justify-between text-sm font-medium text-gray-700">
                      <span>{grupo.nombre}</span>
                      <span>{grupo.alumnoIds.length}</span>
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

// (Tu subcomponente StatCard - no se usa en este código, pero lo dejo por si acaso)
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