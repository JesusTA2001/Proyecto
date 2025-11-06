import React, { useState, useMemo } from 'react';
// Importamos los nuevos estilos
import '../../styles/MisGrupos.css'; 
// Reutilizamos el modal de "Ver Grupo"
import VerGrupoModal from '../Grupos/VerGrupoModal'; 
// Hook para navegación (si se usa el modal)
import { useNavigate } from 'react-router-dom';

// --- Funciones de ayuda del CSS ---
function getGradeColor(grade) {
  if (grade >= 9) return 'text-green-600';
  if (grade >= 8) return 'text-blue-600';
  if (grade >= 7) return 'text-yellow-600';
  return 'text-red-600';
}

function getAttendanceColor(rate) {
  if (rate >= 95) return 'bg-green-500';
  if (rate >= 90) return 'bg-blue-500';
  if (rate >= 85) return 'bg-yellow-500';
  return 'bg-red-500';
}
// --- Fin de funciones de ayuda ---


/**
 * Muestra una lista de los grupos asignados al profesor logueado.
 * @param {object} props
 * @param {Array} props.gruposAsignados - La lista de grupos YA FILTRADOS para este profesor.
 * @param {Array} props.alumnos - La lista COMPLETA de alumnos.
 * @param {Array} props.profesores - La lista COMPLETA de profesores.
 */
function MisGrupos({ profesor, gruposAsignados = [], alumnos = [], profesores = [] }) {
  const navigate = useNavigate(); // Opcional, si quieres que "Ver Detalles" navegue

  // Estados para el modal "Ver Detalles"
  const [openView, setOpenView] = useState(false);
  const [selectedGrupo, setSelectedGrupo] = useState(null);

  // --- Lógica de Estadísticas ---
  const stats = useMemo(() => {
    const totalGrupos = gruposAsignados.length;
    const totalEstudiantes = gruposAsignados.reduce((sum, g) => sum + (g.alumnoIds?.length || 0), 0);
    
    // NOTA: Los promedios de calificaciones y asistencia no están en tus
    // datos. Los simularemos como en el HTML de Canva.
    const promedioGeneral = totalGrupos > 0 ? (Math.random() * 1.5 + 7.5).toFixed(1) : '0.0'; // Simulado
    const asistenciaPromedio = totalGrupos > 0 ? Math.floor(Math.random() * 10 + 88) : 0; // Simulado

    return { totalGrupos, totalEstudiantes, promedioGeneral, asistenciaPromedio };
  }, [gruposAsignados]);

  // --- Lógica de la Lista de Grupos ---
  // Simulamos datos de asistencia y promedio para cada grupo
  const gruposConDatosSimulados = useMemo(() => {
    return gruposAsignados.map(grupo => ({
      ...grupo,
      // Datos reales
      group_id: grupo.id,
      group_name: grupo.nombre,
      student_count: grupo.alumnoIds?.length || 0,
      schedule: `${grupo.dia} ${grupo.horaInicio}-${grupo.horaFin}`,
      classroom: grupo.ubicacion, // Usamos ubicación como aula
      
      // Datos simulados (como en el HTML de Canva)
      average_grade: parseFloat((Math.random() * 2 + 7).toFixed(1)),
      attendance_rate: Math.floor(Math.random() * 15 + 85),
    }));
  }, [gruposAsignados]);

  // Estado y lógica para ordenar la lista
  const [sortCriteria, setSortCriteria] = useState('name');
  
  const sortedGrupos = useMemo(() => {
    const sorted = [...gruposConDatosSimulados];
    switch(sortCriteria) {
      case 'name':
        sorted.sort((a, b) => a.group_name.localeCompare(b.group_name));
        break;
      case 'students':
        sorted.sort((a, b) => b.student_count - a.student_count);
        break;
      case 'grade':
        sorted.sort((a, b) => b.average_grade - a.average_grade);
        break;
      case 'attendance':
        sorted.sort((a, b) => b.attendance_rate - a.attendance_rate);
        break;
      default:
        break;
    }
    return sorted;
  }, [gruposConDatosSimulados, sortCriteria]);


  // Handler para el botón "Ver Detalles"
  const handleViewDetails = (grupoId) => {
    // Buscamos el grupo original (con los datos reales, no los simulados)
    const grupoOriginal = gruposAsignados.find(g => g.id === grupoId);
    if (grupoOriginal) {
      setSelectedGrupo(grupoOriginal);
      setOpenView(true);
    }
    // Opcional: navegar a la página de detalles si lo prefieres
    // navigate(`/ver-grupo/${grupoId}`);
  };

  return (
    <div className="portal-container" style={{ backgroundColor: '#f9fafb' }}>
      
      {/* Quick Stats (Tarjeta de Estadísticas) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Grupos */}
        <div className="card-white rounded-lg p-6 card-shadow fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Grupos</p>
              <p className="text-3xl font-bold text-purple-600">{stats.totalGrupos}</p>
            </div>
            <div className="icon-wrapper bg-purple">
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
          </div>
        </div>
        {/* Total Estudiantes */}
        <div className="card-white rounded-lg p-6 card-shadow fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Estudiantes</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalEstudiantes}</p>
            </div>
            <div className="icon-wrapper bg-blue">
              <svg className="icon icon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
          </div>
        </div>
        {/* Promedio General (Simulado) */}
        <div className="card-white rounded-lg p-6 card-shadow fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Promedio General (Sim.)</p>
              <p className="text-3xl font-bold text-green-600">{stats.promedioGeneral}</p>
            </div>
            <div className="icon-wrapper bg-green">
                <svg className="icon icon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
          </div>
        </div>
        {/* Asistencia Promedio (Simulado) */}
        <div className="card-white rounded-lg p-6 card-shadow fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Asistencia Prom. (Sim.)</p>
              <p className="text-3xl font-bold text-orange-600">{stats.asistenciaPromedio}%</p>
            </div>
            <div className="icon-wrapper" style={{ backgroundColor: '#feeddd', color: '#ea580c' }}>
                <svg className="icon icon-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Grupos */}
      {/* Omitimos la sección del gráfico y la actividad reciente por ahora */}
      <div className="card-white rounded-lg p-6 card-shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Lista de Grupos</h3>
          <div className="flex items-center space-x-4">
            <select 
              id="sort-groups" 
              className="form-select" 
              value={sortCriteria}
              onChange={(e) => setSortCriteria(e.target.value)}
            >
              <option value="name">Ordenar por Nombre</option>
              <option value="students">Ordenar por Estudiantes</option>
              <option value="grade">Ordenar por Promedio (Sim.)</option>
              <option value="attendance">Ordenar por Asistencia (Sim.)</option>
            </select>
          </div>
        </div>
        
        <div id="groups-list" className="space-y-4">
          {sortedGrupos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              <p>No tienes grupos asignados</p>
            </div>
          ) : (
            sortedGrupos.map(group => (
              <div key={group.group_id} className="flex items-center justify-between p-4 group-card">
                <div className="flex items-center space-x-4">
                  <div className="group-card-icon">
                    <span>{group.group_id.substring(0, 4)}</span> {/* Acorta el ID si es largo */}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{group.group_name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>📍 {group.classroom}</span>
                      <span>🕒 {group.schedule}</span>
                      <span>👥 {group.student_count} estudiantes</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Prom. (Sim.)</p>
                      <p className={`font-bold ${getGradeColor(group.average_grade)}`}>{group.average_grade.toFixed(1)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Asis. (Sim.)</p>
                      <div className="flex items-center space-x-2">
                        <div className="progress-bar w-16">
                          <div className={`progress-fill ${getAttendanceColor(group.attendance_rate)}`} style={{width: `${group.attendance_rate}%`}}></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{group.attendance_rate}%</span>
                      </div>
                    </div>
                    <button 
                      className="group-card-button" 
                      onClick={() => handleViewDetails(group.group_id)}
                    >
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal para Ver Detalles del Grupo */}
      <VerGrupoModal 
        open={openView} 
        onClose={() => setOpenView(false)} 
        grupo={selectedGrupo} 
        profesores={profesores} // Pasa la lista completa de profesores
        alumnos={alumnos}     // Pasa la lista completa de alumnos
      />
    </div>
  );
}

export default MisGrupos;