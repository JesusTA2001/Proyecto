import React, { useState, useEffect, useMemo } from 'react';
// Importamos los nuevos estilos
import '../../styles/ControlAsistencia.css'; 

// Función para obtener iniciales
function getInitials(name) {
  if (!name) return '??';
  const parts = name.split(' ');
  return parts.length >= 2 ? parts[0][0] + parts[1][0] : parts[0][0] + (parts[0][1] || '');
}

// Key para localStorage
const ASISTENCIA_KEY = 'allAsistencias';

// Función para cargar asistencias
const loadAsistencias = () => {
  try {
    const data = localStorage.getItem(ASISTENCIA_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
};

// Componente Toast para notificaciones
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      {message}
    </div>
  );
}

// --- Componente Principal ---
function ControlAsistencia({ profesor, alumnos = [], grupos = [] }) {
  const [selectedGrupoId, setSelectedGrupoId] = useState('');
  // Guardamos las asistencias por [grupoId][fecha][alumnoId]
  const [allAsistencias, setAllAsistencias] = useState(loadAsistencias);
  const [currentDate] = useState(new Date().toISOString().slice(0, 10)); // Formato AAAA-MM-DD
  const [currentDateString] = useState(new Date().toLocaleDateString('es-ES'));
  
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isSaving, setIsSaving] = useState(false);

  // Filtra los alumnos que pertenecen al grupo seleccionado
  const alumnosEnGrupo = useMemo(() => {
    if (!selectedGrupoId) return [];
    const grupo = grupos.find(g => g.id === selectedGrupoId);
    if (!grupo || !grupo.alumnoIds) return [];
    
    return grupo.alumnoIds
      .map(id => alumnos.find(a => a.numero_control === id))
      .filter(Boolean); // Filtra por si algún alumno no se encontró
  }, [selectedGrupoId, grupos, alumnos]);

  // Obtiene el nombre del grupo seleccionado
  const selectedGrupoNombre = useMemo(() => {
    if (!selectedGrupoId) return 'N/A';
    return grupos.find(g => g.id === selectedGrupoId)?.nombre || 'N/A';
  }, [selectedGrupoId, grupos]);

  // Obtiene el estado de asistencia actual para la UI
  const asistenciaHoy = useMemo(() => {
    if (!selectedGrupoId || !allAsistencias[selectedGrupoId] || !allAsistencias[selectedGrupoId][currentDate]) {
      return {};
    }
    return allAsistencias[selectedGrupoId][currentDate];
  }, [allAsistencias, selectedGrupoId, currentDate]);

  // Calcula las estadísticas
  const stats = useMemo(() => {
    const total = alumnosEnGrupo.length;
    const presentes = Object.values(asistenciaHoy).filter(s => s === 'presente').length;
    const ausentes = Object.values(asistenciaHoy).filter(s => s === 'ausente').length;
    const percentage = total > 0 ? Math.round((presentes / total) * 100) : 0;
    
    return { total, presentes, ausentes, percentage };
  }, [alumnosEnGrupo, asistenciaHoy]);

  // --- Handlers ---

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  const handleGrupoChange = (e) => {
    setSelectedGrupoId(e.target.value);
  };

  // Función para marcar la asistencia de UN alumno
  const handleMarkAttendance = (alumnoId, status) => {
    if (!selectedGrupoId) return;

    setAllAsistencias(prev => {
      const newAsistencias = { ...prev };
      // Asegurarse que las estructuras de objeto existan
      if (!newAsistencias[selectedGrupoId]) newAsistencias[selectedGrupoId] = {};
      if (!newAsistencias[selectedGrupoId][currentDate]) newAsistencias[selectedGrupoId][currentDate] = {};

      // Establecer el nuevo estado
      newAsistencias[selectedGrupoId][currentDate][alumnoId] = status;
      return newAsistencias;
    });
  };

  // Función para marcar TODOS
  const handleMarkAll = (status) => {
    if (!selectedGrupoId || alumnosEnGrupo.length === 0) return;

    setAllAsistencias(prev => {
      const newAsistencias = { ...prev };
      if (!newAsistencias[selectedGrupoId]) newAsistencias[selectedGrupoId] = {};
      if (!newAsistencias[selectedGrupoId][currentDate]) newAsistencias[selectedGrupoId][currentDate] = {};

      // Aplicar a todos los alumnos del grupo seleccionado
      alumnosEnGrupo.forEach(alumno => {
        newAsistencias[selectedGrupoId][currentDate][alumno.numero_control] = status;
      });

      return newAsistencias;
    });
  };

  // Limpiar selección de HOY
  const handleClearAll = () => {
    if (!selectedGrupoId) return;

    setAllAsistencias(prev => {
      const newAsistencias = { ...prev };
      if (newAsistencias[selectedGrupoId] && newAsistencias[selectedGrupoId][currentDate]) {
        // Borra solo las asistencias del día de hoy para este grupo
        delete newAsistencias[selectedGrupoId][currentDate];
      }
      return newAsistencias;
    });
    showToast('Asistencia limpiada', 'info');
  };

  // Guardar en localStorage
  const handleSave = () => {
    if (Object.keys(asistenciaHoy).length === 0) {
      return showToast('No hay asistencias para guardar', 'error');
    }
    
    setIsSaving(true);
    try {
      localStorage.setItem(ASISTENCIA_KEY, JSON.stringify(allAsistencias));
      
      setTimeout(() => {
        setIsSaving(false);
        showToast('Asistencia guardada con éxito', 'success');
      }, 500); // Simula un pequeño retraso
      
    } catch (e) {
      setIsSaving(false);
      showToast('Error al guardar en localStorage', 'error');
    }
  };


  return (
    <div className="portal-container" style={{ backgroundColor: '#f9fafb' }}>
      {/* Notificación Toast */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(prev => ({ ...prev, show: false }))} 
        />
      )}

      {/* Header (simplificado, ya que estamos dentro de LayoutProfesor) */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Control de Asistencia</h2>
            <p className="text-gray-600">Registra la asistencia de tus grupos para la fecha de hoy: <strong>{currentDateString}</strong></p>
          </div>
          <div className="flex items-center space-x-4">
            <select value={selectedGrupoId} onChange={handleGrupoChange} className="form-select" style={{ minWidth: '200px' }}>
              <option value="">Selecciona un grupo...</option>
              {grupos.map(g => (
                <option key={g.id} value={g.id}>{g.nombre}</option>
              ))}
            </select>
            <button 
              id="save-attendance" 
              className="action-btn save" 
              onClick={handleSave} 
              disabled={isSaving || !selectedGrupoId}
            >
              {isSaving ? <span className="loading-spinner"></span> : null}
              {isSaving ? 'Guardando...' : 'Guardar Asistencia'}
            </button>
          </div>
        </div>
      </div>

      {/* Tarjeta de Estadísticas */}
      <div className="card-shadow mb-6 fade-in">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Grupo Actual</p>
            <p className="text-xl font-bold text-purple-600">{selectedGrupoNombre}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Fecha</p>
            <p className="text-xl font-bold text-gray-800">{currentDateString}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Estudiantes</p>
            <p className="text-xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Presentes</p>
            <p className="text-xl font-bold text-green-600">{stats.presentes}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Ausentes</p>
            <p className="text-xl font-bold text-red-600">{stats.ausentes}</p>
          </div>
        </div>
        
        {/* Barra de Progreso */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Porcentaje de Asistencia</span>
            <span className="text-sm font-semibold text-purple-600">{stats.percentage}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fg" style={{ width: `${stats.percentage}%` }}></div>
          </div>
        </div>
      </div>

      {/* Grid de Estudiantes */}
      <div className="card-shadow fade-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Lista de Estudiantes</h3>
          <div className="flex items-center space-x-4">
            <button className="action-btn green" onClick={() => handleMarkAll('presente')}>
              ✓ Marcar Todos Presentes
            </button>
            <button className="action-btn red" onClick={() => handleMarkAll('ausente')}>
              ✗ Marcar Todos Ausentes
            </button>
            <button className="action-btn gray" onClick={handleClearAll}>
              🔄 Limpiar Todo
            </button>
          </div>
        </div>
        
        {!selectedGrupoId ? (
          <div className="text-center text-gray-500 py-12">
            <p>Selecciona un grupo para ver la lista de estudiantes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {alumnosEnGrupo.map(alumno => {
              const status = asistenciaHoy[alumno.numero_control]; // 'presente', 'ausente', o undefined
              return (
                <div key={alumno.numero_control} className="student-card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="student-avatar-circle">
                        <span>{getInitials(alumno.nombre)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{alumno.nombre}</p>
                        <p className="text-xs text-gray-500">ID: {alumno.numero_control}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className={`attendance-btn present-btn ${status === 'presente' ? 'active-present' : ''}`}
                      onClick={() => handleMarkAttendance(alumno.numero_control, 'presente')}
                    >
                      ✓ Presente
                    </button>
                    <button 
                      className={`attendance-btn absent-btn ${status === 'ausente' ? 'active-absent' : ''}`}
                      onClick={() => handleMarkAttendance(alumno.numero_control, 'ausente')}
                    >
                      ✗ Ausente
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ControlAsistencia;