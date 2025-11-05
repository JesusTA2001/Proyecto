import React, { useState, useEffect, useMemo } from 'react';
// Importamos los nuevos estilos
import '../../styles/PortalCalificaciones.css'; 

// Función para cargar calificaciones desde localStorage
const loadGrades = () => {
  try {
    const data = localStorage.getItem('allGrades');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

// --- Funciones de utilidad ---

// Devuelve la clase CSS según la calificación
function getGradeClass(grade) {
  const val = Number(grade);
  if (val >= 9) return 'grade-excellent';
  if (val >= 8) return 'grade-good';
  if (val >= 7) return 'grade-regular';
  return 'grade-poor';
}

// Devuelve la etiqueta de texto según la calificación
function getGradeLabel(grade) {
  const val = Number(grade);
  if (val >= 9) return 'Excelente';
  if (val >= 8) return 'Muy Bueno';
  if (val >= 7) return 'Bueno';
  return 'Necesita Mejorar';
}

// Obtiene las iniciales de un nombre
function getInitials(name) {
  if (!name) return '??';
  const parts = name.split(' ');
  return parts.length >= 2 ? parts[0][0] + parts[1][0] : parts[0][0] + (parts[0][1] || '');
}

// --- Componente Principal ---

function PortalCalificaciones({ profesor, alumnos = [], grupos = [], profesores = [] }) {
  const [selectedGrupoId, setSelectedGrupoId] = useState('');
  const [selectedAlumnoId, setSelectedAlumnoId] = useState('');
  
  // Carga todas las calificaciones desde localStorage
  const [allGrades, setAllGrades] = useState(loadGrades);

  // Filtra los alumnos que pertenecen al grupo seleccionado
  const alumnosEnGrupo = useMemo(() => {
    if (!selectedGrupoId) return [];
    const grupo = grupos.find(g => g.id === selectedGrupoId);
    if (!grupo || !grupo.alumnoIds) return [];
    
    // Mapea los IDs a los objetos de alumno completos
    return grupo.alumnoIds
      .map(id => alumnos.find(a => a.numero_control === id))
      .filter(Boolean); // Filtra por si algún alumno no se encontró
  }, [selectedGrupoId, grupos, alumnos]);

  // Obtiene el objeto completo del alumno seleccionado
  const selectedAlumno = useMemo(() => {
    if (!selectedAlumnoId) return null;
    return alumnos.find(a => a.numero_control === selectedAlumnoId) || null;
  }, [selectedAlumnoId, alumnos]);

  // Obtiene el nombre del grupo seleccionado
  const selectedGrupoNombre = useMemo(() => {
    if (!selectedGrupoId) return '';
    return grupos.find(g => g.id === selectedGrupoId)?.nombre || '';
  }, [selectedGrupoId, grupos]);

  // Filtra las calificaciones solo para el alumno seleccionado
  const calificacionesDelAlumno = useMemo(() => {
    if (!selectedAlumnoId) return [];
    return allGrades
      .filter(g => g.student_id === selectedAlumnoId)
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Ordena por fecha (más nuevas primero)
  }, [selectedAlumnoId, allGrades]);

  // Calcula todas las estadísticas para el alumno
  const studentStats = useMemo(() => {
    if (calificacionesDelAlumno.length === 0) {
      return {
        totalEvaluations: 0,
        overallAverage: 0,
        highestGrade: 0,
        lowestGrade: 0,
        lastEvaluationDate: null,
        subjectAverages: {},
        recentGrades: []
      };
    }

    const grades = calificacionesDelAlumno.map(g => g.grade);
    const total = grades.reduce((sum, g) => sum + g, 0);
    const overallAverage = total / grades.length;
    const highestGrade = Math.max(...grades);
    const lowestGrade = Math.min(...grades);
    const lastEvaluationDate = calificacionesDelAlumno[0]?.date; // Ya está ordenado

    // Agrupa por tipo de examen (en lugar de "materia")
    const subjectGrades = {};
    calificacionesDelAlumno.forEach(grade => {
      const subject = grade.exam_type || 'General';
      if (!subjectGrades[subject]) {
        subjectGrades[subject] = [];
      }
      subjectGrades[subject].push(grade.grade);
    });

    const subjectAverages = {};
    Object.keys(subjectGrades).forEach(subject => {
      const grades = subjectGrades[subject];
      subjectAverages[subject] = grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
    });

    return {
      totalEvaluations: calificacionesDelAlumno.length,
      overallAverage,
      highestGrade,
      lowestGrade,
      lastEvaluationDate,
      subjectAverages,
      recentGrades: calificacionesDelAlumno.slice(0, 5) // Las 5 más recientes
    };
  }, [calificacionesDelAlumno]);

  // --- Handlers ---

  const handleGrupoChange = (e) => {
    setSelectedGrupoId(e.target.value);
    setSelectedAlumnoId(''); // Resetea el alumno al cambiar de grupo
  };

  const handleAlumnoChange = (e) => {
    setSelectedAlumnoId(e.target.value);
  };
  
  // Calcula los datos del gráfico circular
  const circumference = 2 * Math.PI * 50;
  const progressPercentage = (studentStats.overallAverage / 10) * 100;
  const strokeDasharray = `${(progressPercentage / 100) * circumference} ${circumference}`;

  return (
    <div className="portal-container">
      {/* Selector de Estudiante */}
      <div className="card-white p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> 
          Seleccionar Estudiante
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Grupo (Asignados a ti)</label>
            <select value={selectedGrupoId} onChange={handleGrupoChange} className="form-select">
              <option value="">Seleccionar grupo...</option>
              {grupos.map(g => (
                <option key={g.id} value={g.id}>{g.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Estudiante</label>
            <select value={selectedAlumnoId} onChange={handleAlumnoChange} className="form-select" disabled={!selectedGrupoId}>
              <option value="">{selectedGrupoId ? "Seleccionar estudiante..." : "Primero selecciona un grupo..."}</option>
              {alumnosEnGrupo.map(a => (
                <option key={a.numero_control} value={a.numero_control}>{a.nombre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Panel de Carga (Opcional, si no hay alumno) */}
      {!selectedAlumno && (
        <div className="card-white p-6 text-center text-gray-500">
          <p>Selecciona un grupo y un estudiante para ver sus calificaciones.</p>
        </div>
      )}

      {/* Panel del Estudiante (se muestra si hay un alumno) */}
      {selectedAlumno && (
        <div id="student-dashboard" className="fade-in">
          {/* Tarjeta de Info del Estudiante */}
          <div className="card-white p-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="student-avatar w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {getInitials(selectedAlumno.nombre)}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800">{selectedAlumno.nombre}</h2>
                <p className="text-gray-600">{selectedGrupoNombre}</p>
                <p className="text-sm text-gray-500">ID: {selectedAlumno.numero_control}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Promedio General</p>
                <p className="text-3xl font-bold text-purple-600">
                  {studentStats.overallAverage.toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          {/* Tarjetas de Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="stats-card rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Evaluaciones</p>
                  <p className="text-2xl font-bold text-gray-800">{studentStats.totalEvaluations}</p>
                </div>
                <div className="icon-wrapper bg-purple">
                  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
              </div>
            </div>
            <div className="stats-card rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Calificación Más Alta</p>
                  <p className="text-2xl font-bold text-green-600">{studentStats.highestGrade.toFixed(1)}</p>
                </div>
                <div className="icon-wrapper bg-green">
                  <svg className="icon icon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
              </div>
            </div>
            <div className="stats-card rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Calificación Más Baja</p>
                  <p className="text-2xl font-bold text-red-600">{studentStats.lowestGrade.toFixed(1)}</p>
                </div>
                <div className="icon-wrapper bg-red">
                  <svg className="icon icon-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                </div>
              </div>
            </div>
            <div className="stats-card rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Última Evaluación</p>
                  <p className="text-lg font-bold text-gray-800">
                    {studentStats.lastEvaluationDate ? new Date(studentStats.lastEvaluationDate).toLocaleDateString('es-ES') : '--'}
                  </p>
                </div>
                <div className="icon-wrapper bg-blue">
                  <svg className="icon icon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Principal (Resumen, Progreso, Reciente) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Resumen Académico (por Tipo de Examen) */}
            <div className="card-white rounded-lg shadow-sm p-6 card-hover">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="icon icon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> 
                Resumen Académico
              </h3>
              <div className="space-y-3">
                {Object.keys(studentStats.subjectAverages).length > 0 ? (
                  Object.entries(studentStats.subjectAverages).map(([subject, average]) => (
                    <div key={subject} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">{subject}</span>
                      <span className={`grade-badge ${getGradeClass(average)}`}>
                        {average.toFixed(1)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-4"><p>No hay promedios por tipo</p></div>
                )}
              </div>
            </div>

            {/* Gráfico de Progreso */}
            <div className="card-white rounded-lg shadow-sm p-6 card-hover">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="icon icon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> 
                Progreso de Calificaciones
              </h3>
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="progress-ring w-32 h-32" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                    <circle 
                      cx="60" 
                      cy="60" 
                      r="50" 
                      stroke="#8b45c1" 
                      strokeWidth="8" 
                      fill="none" 
                      strokeLinecap="round" 
                      className="progress-circle" 
                      strokeDasharray={strokeDasharray} 
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{progressPercentage.toFixed(0)}%</p>
                      <p className="text-xs text-gray-500">Promedio</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">Promedio general: {studentStats.overallAverage.toFixed(1)} / 10</p>
              </div>
            </div>

            {/* Rendimiento Reciente */}
            <div className="card-white rounded-lg shadow-sm p-6 card-hover">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="icon icon-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> 
                Rendimiento Reciente
              </h3>
              <div className="space-y-3">
                {studentStats.recentGrades.length > 0 ? (
                  studentStats.recentGrades.map(grade => (
                    <div key={grade.__id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{grade.exam_type}</p>
                        <p className="text-sm text-gray-600">{new Date(grade.date).toLocaleDateString('es-ES')}</p>
                      </div>
                      <span className={`grade-badge ${getGradeClass(grade.grade)}`}>
                        {grade.grade.toFixed(1)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-4"><p>No hay evaluaciones recientes</p></div>
                )}
              </div>
            </div>
          </div>

          {/* Tabla de Calificaciones Detallada */}
          <div className="card-white rounded-lg shadow-sm p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 8l2 2 4-4" /></svg> 
              Historial de Calificaciones
            </h3>
            <div className="overflow-x-auto">
              <table className="table-fixed-layout">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Tipo Evaluación</th>
                    <th>Calificación</th>
                    <th>Profesor</th>
                    <th>Comentarios</th>
                  </tr>
                </thead>
                <tbody>
                  {calificacionesDelAlumno.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center p-8 text-gray-500">
                        No hay calificaciones registradas para este estudiante
                      </td>
                    </tr>
                  ) : (
                    calificacionesDelAlumno.map(grade => (
                      <tr key={grade.__id}>
                        <td>{new Date(grade.date).toLocaleDateString('es-ES')}</td>
                        <td>{grade.exam_type}</td>
                        <td>
                          <span className={`grade-badge ${getGradeClass(grade.grade)}`}>
                            {grade.grade.toFixed(1)} - {getGradeLabel(grade.grade)}
                          </span>
                        </td>
                        <td>{grade.teacher_name || 'N/A'}</td>
                        <td>{grade.comments || 'Sin comentarios'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PortalCalificaciones;