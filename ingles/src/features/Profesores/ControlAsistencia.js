import React, { useState, useEffect, useMemo } from 'react';
import '../../styles/ControlAsistencia.css'; 
import { Snackbar, Alert } from '@mui/material';
import api from '../../api/axios';

// Función para obtener iniciales
function getInitials(name) {
  if (!name) return '??';
  const parts = name.split(' ');
  return parts.length >= 2 ? parts[0][0] + parts[1][0] : parts[0][0] + (parts[0][1] || '');
}

// --- Componente Principal ---
function ControlAsistencia({ profesor, alumnos = [], grupos = [] }) {
  const [selectedGrupoId, setSelectedGrupoId] = useState('');
  // Guardamos las asistencias localmente como un Set de nControl (solo los presentes)
  const [asistenciasPresentes, setAsistenciasPresentes] = useState(new Set());
  const [currentDate] = useState(new Date().toISOString().slice(0, 10)); // Formato AAAA-MM-DD
  
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [asistenciaYaGuardada, setAsistenciaYaGuardada] = useState(false);

  // Filtra los alumnos que pertenecen al grupo seleccionado
  const alumnosEnGrupo = useMemo(() => {
    if (!selectedGrupoId) return [];
    
    console.log('🔍 Buscando grupo:', selectedGrupoId, typeof selectedGrupoId);
    console.log('📚 Grupos disponibles:', grupos.map(g => ({ id: g.id, tipo: typeof g.id, nombre: g.nombre })));
    
    const grupo = grupos.find(g => g.id === parseInt(selectedGrupoId));
    console.log('✅ Grupo encontrado:', grupo);
    
    if (!grupo || !grupo.alumnoIds) {
      console.log('⚠️ Grupo no tiene alumnoIds:', grupo);
      return [];
    }
    
    console.log('👥 AlumnoIds en grupo:', grupo.alumnoIds);
    console.log('📋 Alumnos totales disponibles:', alumnos.length);
    
    const alumnosDelGrupo = grupo.alumnoIds
      .map(id => {
        const alumno = alumnos.find(a => a.numero_control === id);
        console.log(`🔎 Buscando alumno ${id}:`, alumno ? 'Encontrado' : 'NO encontrado');
        return alumno;
      })
      .filter(Boolean); // Filtra por si algún alumno no se encontró
    
    console.log('✅ Alumnos del grupo:', alumnosDelGrupo.length);
    return alumnosDelGrupo;
  }, [selectedGrupoId, grupos, alumnos]);

  // Cargar asistencias cuando cambia el grupo
  useEffect(() => {
    if (selectedGrupoId) {
      cargarAsistencias();
    } else {
      setAsistenciasPresentes(new Set());
    }
  }, [selectedGrupoId, currentDate]);

  // Función para cargar asistencias desde la API
  const cargarAsistencias = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/asistencias/grupo', {
        params: {
          id_Grupo: selectedGrupoId,
          fecha: currentDate
        }
      });

      if (response.data.success) {
        const presentes = response.data.presentes || [];
        setAsistenciasPresentes(new Set(presentes));
        
        // Si hay al menos un registro de asistencia (presente o ausente), ya fue guardada
        // Como solo guardamos presentes, si hay registros significa que ya se tomó asistencia
        const yaHayRegistros = presentes.length > 0;
        setAsistenciaYaGuardada(yaHayRegistros);
        
        if (yaHayRegistros) {
          showToast('La asistencia para esta fecha ya fue registrada anteriormente', 'info');
        }
      }
    } catch (error) {
      console.error('Error al cargar asistencias:', error);
      if (error.response?.status !== 404) {
        showToast('Error al cargar asistencias', 'error');
      }
      setAsistenciasPresentes(new Set());
      setAsistenciaYaGuardada(false);
    } finally {
      setIsLoading(false);
    }
  };

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

    setAsistenciasPresentes(prev => {
      const newSet = new Set(prev);
      if (status === 'presente') {
        newSet.add(alumnoId);
      } else {
        newSet.delete(alumnoId);
      }
      return newSet;
    });
  };

  // Función para marcar TODOS
  const handleMarkAll = (status) => {
    if (!selectedGrupoId || alumnosEnGrupo.length === 0) return;

    if (status === 'presente') {
      // Agregar todos los alumnos
      const todosLosIds = alumnosEnGrupo.map(a => a.numero_control);
      setAsistenciasPresentes(new Set(todosLosIds));
    } else {
      // Limpiar todos
      setAsistenciasPresentes(new Set());
    }
  };

  // Guardar en la base de datos
  const handleSave = async () => {
    if (!selectedGrupoId) {
      return showToast('Selecciona un grupo primero', 'error');
    }
    
    if (asistenciaYaGuardada) {
      return showToast('La asistencia para esta fecha ya fue registrada', 'error');
    }
    
    setIsSaving(true);
    try {
      // Preparar datos para enviar
      const asistencias = alumnosEnGrupo.map(alumno => ({
        nControl: alumno.numero_control,
        presente: asistenciasPresentes.has(alumno.numero_control)
      }));

      const response = await api.post('/asistencias/guardar-masivas', {
        id_Grupo: selectedGrupoId,
        fecha: currentDate,
        asistencias
      });

      if (response.data.success) {
        showToast(
          `Asistencia guardada: ${response.data.totalPresentes} presentes, ${response.data.totalAusentes} ausentes`, 
          'success'
        );
        // Marcar como ya guardada después de guardar exitosamente
        setAsistenciaYaGuardada(true);
      }
    } catch (error) {
      console.error('Error al guardar asistencia:', error);
      
      // Si el backend indica que ya fue registrada
      if (error.response?.data?.yaRegistrada) {
        showToast(error.response.data.message || 'La asistencia ya fue registrada', 'error');
        setAsistenciaYaGuardada(true);
      } else {
        showToast('Error al guardar la asistencia', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <div className="portal-container" style={{ backgroundColor: '#f9fafb' }}>
      {/* Notificación (Snackbar + Alert) */}
      <Snackbar
        open={toast.show}
        autoHideDuration={3500}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      >
        <Alert onClose={() => setToast(prev => ({ ...prev, show: false }))} severity={toast.type === 'error' ? 'error' : toast.type === 'info' ? 'info' : 'success'} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>

      {/* Nota: Se eliminó la cabecera de estadísticas para simplificar la vista.
          El selector de grupo y el botón de guardar se muestran ahora junto a la lista de estudiantes.
      */}

      {/* Grid de Estudiantes */}
      <div className="card-shadow fade-in">
            <div className="flex items-center justify-between mb-6">
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <select value={selectedGrupoId} onChange={handleGrupoChange} className="form-select" style={{ minWidth: '220px' }}>
                <option value="">Selecciona un grupo...</option>
                {grupos.map(g => (
                  <option key={g.id} value={g.id}>{g.nombre}</option>
                ))}
              </select>
              <h3 className="text-lg font-semibold text-gray-800" style={{ margin: 0 }}>
                Lista de Estudiantes - {currentDate}
              </h3>
              <button 
                id="save-attendance" 
                className="action-btn save" 
                onClick={handleSave} 
                disabled={isSaving || !selectedGrupoId || asistenciaYaGuardada}
                style={{ marginLeft: 8, opacity: asistenciaYaGuardada ? 0.5 : 1 }}
                title={asistenciaYaGuardada ? 'La asistencia ya fue registrada para esta fecha' : 'Guardar asistencia'}
              >
                {isSaving ? <span className="loading-spinner"></span> : null}
                {isSaving ? 'Guardando...' : asistenciaYaGuardada ? 'Ya Registrado' : 'Guardar Asistencia'}
              </button>
              {asistenciaYaGuardada && (
                <span style={{ color: '#f59e0b', fontSize: '0.875rem', fontWeight: '500' }}>
                  ⚠️ Asistencia ya registrada
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button className="action-btn green" onClick={() => handleMarkAll('presente')}>
                ✓ Marcar Todos Presentes
              </button>
              <button className="action-btn red" onClick={() => handleMarkAll('ausente')}>
                ✗ Marcar Todos Ausentes
              </button>
            </div>
          </div>
        
        {!selectedGrupoId ? (
          <div className="text-center text-gray-500 py-12">
            <p>Selecciona un grupo para ver la lista de estudiantes.</p>
          </div>
        ) : isLoading ? (
          <div className="text-center text-gray-500 py-12">
            <span className="loading-spinner" style={{ display: 'inline-block' }}></span>
            <p>Cargando asistencias...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {alumnosEnGrupo.map(alumno => {
              const estaPresente = asistenciasPresentes.has(alumno.numero_control);
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
                      className={`attendance-btn present-btn ${estaPresente ? 'active-present' : ''}`}
                      onClick={() => handleMarkAttendance(alumno.numero_control, 'presente')}
                    >
                      ✓ Presente
                    </button>
                    <button 
                      className={`attendance-btn absent-btn ${!estaPresente ? 'active-absent' : ''}`}
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