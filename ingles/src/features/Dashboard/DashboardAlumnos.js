import React, { useState, useMemo, useEffect } from 'react';
import '../../styles/DashboardAlumnos.css';
import { initialAlumnos } from '../../data/alumnos';

// Colores para los niveles
const nivelColors = {
  'Nivel Intro': '#6b7280',
  'Nivel 1': '#ef4444',
  'Nivel 2': '#f97316',
  'Nivel 3': '#eab308',
  'Nivel 4': '#84cc16',
  'Nivel 5': '#22c55e',
  'Nivel 6': '#10b981',
  'Diplomado 1': '#3b82f6',
  'Diplomado 2': '#6366f1'
};

// Datos simulados iniciales para asistencia (ya que no están en data/alumnos.js)
const initialAttendance = [
  { id: 1, fecha: '2023-10-01', tipo: 'Asistencia', observaciones: '' },
  { id: 2, fecha: '2023-10-03', tipo: 'Asistencia', observaciones: '' },
  { id: 3, fecha: '2023-10-05', tipo: 'Falta', observaciones: 'Justificada' },
  { id: 4, fecha: '2023-10-08', tipo: 'Retardo', observaciones: 'Llegada tarde 10min' },
];

function DashboardAlumnos() {
  // Simulamos que el alumno logueado es el primero de la lista o uno específico
  // En una app real, esto vendría del contexto de autenticación
  const [student, setStudent] = useState(initialAlumnos[0] || {
    numero_control: '', nombre: '', carrera: '', nivel: ''
  });

  // Estados para datos adicionales
  const [progress, setProgress] = useState({
    nivel: student.nivel || 'Nivel 1',
    porcentaje: 45 // Valor inicial simulado
  });
  
  const [attendanceRecords, setAttendanceRecords] = useState(initialAttendance);

  // Estados de los Modales
  const [modals, setModals] = useState({
    personal: false,
    progress: false,
    attendance: false
  });

  // Formularios
  const [personalForm, setPersonalForm] = useState({ ...student, semestre: 1 }); // Semestre simulado
  const [progressForm, setProgressForm] = useState({ ...progress });
  const [attendanceForm, setAttendanceForm] = useState({ fecha: '', tipo: 'Asistencia', observaciones: '' });

  // --- Cálculos de Estadísticas ---
  const stats = useMemo(() => {
    const total = attendanceRecords.length;
    if (total === 0) return { asistencias: 0, faltas: 0, retardos: 0, porcentaje: 0 };

    const asistencias = attendanceRecords.filter(r => r.tipo === 'Asistencia').length;
    const faltas = attendanceRecords.filter(r => r.tipo === 'Falta').length;
    const retardos = attendanceRecords.filter(r => r.tipo === 'Retardo').length;
    const porcentaje = Math.round((asistencias / total) * 100);

    return { asistencias, faltas, retardos, porcentaje };
  }, [attendanceRecords]);

  // --- Manejadores de Modales ---
  const toggleModal = (modalName, isOpen) => {
    setModals(prev => ({ ...prev, [modalName]: isOpen }));
    // Resetear formularios al abrir si es necesario
    if (isOpen) {
      if (modalName === 'personal') setPersonalForm({ ...student, semestre: personalForm.semestre });
      if (modalName === 'progress') setProgressForm({ ...progress });
      if (modalName === 'attendance') setAttendanceForm({ fecha: new Date().toISOString().slice(0, 10), tipo: 'Asistencia', observaciones: '' });
    }
  };

  // --- Manejadores de Submit ---
  const handlePersonalSubmit = (e) => {
    e.preventDefault();
    setStudent(prev => ({
      ...prev,
      numero_control: personalForm.numero_control,
      nombre: personalForm.nombre,
      carrera: personalForm.carrera
    }));
    // Guardar semestre en el estado local del formulario o extender el objeto estudiante si fuera necesario
    toggleModal('personal', false);
  };

  const handleProgressSubmit = (e) => {
    e.preventDefault();
    setProgress({
      nivel: progressForm.nivel,
      porcentaje: parseInt(progressForm.porcentaje)
    });
    // Actualizar también el nivel en el objeto estudiante principal para consistencia visual
    setStudent(prev => ({ ...prev, nivel: progressForm.nivel }));
    toggleModal('progress', false);
  };

  const handleAttendanceSubmit = (e) => {
    e.preventDefault();
    const newRecord = {
      id: Date.now(),
      ...attendanceForm
    };
    setAttendanceRecords(prev => [newRecord, ...prev]); // Añadir al principio
    toggleModal('attendance', false);
  };

  const handleDeleteAttendance = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este registro?')) {
      setAttendanceRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <div className="da-container">
      <div className="da-header">
        <h1>Mi Progreso Académico</h1>
        <p>{student.nombre || 'Estudiante'}</p>
      </div>

      {/* Sección: Datos Personales */}
      <section className="da-section section-purple">
        <div className="da-section-header">
          <h2>
            <div className="da-section-icon icon-bg-purple">👤</div>
            Datos Personales
          </h2>
          <button className="da-add-button" onClick={() => toggleModal('personal', true)}>
            Editar Información
          </button>
        </div>
        <div className="da-info-grid">
          <div className="da-info-item">
            <span className="da-info-label">Número de Control</span>
            <span className="da-info-value">{student.numero_control}</span>
          </div>
          <div className="da-info-item">
            <span className="da-info-label">Nombre Completo</span>
            <span className="da-info-value">{student.nombre}</span>
          </div>
          <div className="da-info-item">
            <span className="da-info-label">Carrera</span>
            <span className="da-info-value">{student.carrera}</span>
          </div>
          <div className="da-info-item">
            <span className="da-info-label">Semestre (Simulado)</span>
            <span className="da-info-value">{personalForm.semestre}°</span>
          </div>
          <div className="da-info-item">
            <span className="da-info-label">Correo</span>
            <span className="da-info-value">{student.correo}</span>
          </div>
        </div>
      </section>

      {/* Sección: Avance en Inglés */}
      <section className="da-section section-blue">
        <div className="da-section-header">
          <h2>
            <div className="da-section-icon icon-bg-blue">📚</div>
            Mi Avance en Inglés
          </h2>
          <button className="da-add-button" onClick={() => toggleModal('progress', true)}>
            Actualizar Avance
          </button>
        </div>
        
        <div className="da-progress-container">
          <div className="da-stats-row">
            <div className="da-stat-box">
              <h4>Nivel Actual</h4>
              <p className="da-stat-value">{progress.nivel}</p>
            </div>
            <div className="da-stat-box">
              <h4>Progreso en Nivel</h4>
              <p className="da-stat-value">{progress.porcentaje}%</p>
            </div>
          </div>
          
          <div style={{ marginTop: '1.5rem' }}>
            <span className="da-nivel-badge-large" style={{ backgroundColor: nivelColors[progress.nivel] || '#3b82f6' }}>
              {progress.nivel}
            </span>
            <div className="da-progress-bar-large">
              <div 
                className="da-progress-fill-large" 
                style={{ 
                  width: `${progress.porcentaje}%`, 
                  backgroundColor: nivelColors[progress.nivel] || '#3b82f6' 
                }}
              >
                {progress.porcentaje}%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección: Registro de Asistencias */}
      <section className="da-section section-green">
        <div className="da-section-header">
          <h2>
            <div className="da-section-icon icon-bg-green">📋</div>
            Registro de Asistencias
          </h2>
          <button className="da-add-button" onClick={() => toggleModal('attendance', true)}>
            + Registrar Asistencia
          </button>
        </div>

        {attendanceRecords.length === 0 ? (
          <div className="da-empty-state">
            <p>No hay registros de asistencia.</p>
          </div>
        ) : (
          <>
            <div className="da-stats-row">
              <div className="da-stat-box">
                <h4>Asistencias</h4>
                <p className="da-stat-value" style={{ color: '#22c55e' }}>{stats.asistencias}</p>
              </div>
              <div className="da-stat-box">
                <h4>Faltas</h4>
                <p className="da-stat-value" style={{ color: '#ef4444' }}>{stats.faltas}</p>
              </div>
              <div className="da-stat-box">
                <h4>Retardos</h4>
                <p className="da-stat-value" style={{ color: '#f97316' }}>{stats.retardos}</p>
              </div>
              <div className="da-stat-box">
                <h4>% Asistencia</h4>
                <p className="da-stat-value" style={{ color: '#3b82f6' }}>{stats.porcentaje}%</p>
              </div>
            </div>

            <div className="da-table-wrapper">
              <table className="da-attendance-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Observaciones</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.sort((a,b) => new Date(b.fecha) - new Date(a.fecha)).map(record => (
                    <tr key={record.id}>
                      <td>{record.fecha}</td>
                      <td>
                        <span className={`da-attendance-badge badge-${record.tipo.toLowerCase()}`}>
                          {record.tipo}
                        </span>
                      </td>
                      <td>{record.observaciones || '-'}</td>
                      <td>
                        <button className="da-delete-button" onClick={() => handleDeleteAttendance(record.id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {/* --- MODALES --- */}

      {/* Modal Datos Personales */}
      {modals.personal && (
        <div className="da-modal-overlay" onClick={(e) => e.target.className === 'da-modal-overlay' && toggleModal('personal', false)}>
          <div className="da-modal-content">
            <h3>Editar Información Personal</h3>
            <form onSubmit={handlePersonalSubmit}>
              <div className="da-form-group">
                <label>Número de Control</label>
                <input 
                  type="text" 
                  value={personalForm.numero_control} 
                  onChange={e => setPersonalForm({...personalForm, numero_control: e.target.value})} 
                  required 
                />
              </div>
              <div className="da-form-group">
                <label>Nombre Completo</label>
                <input 
                  type="text" 
                  value={personalForm.nombre} 
                  onChange={e => setPersonalForm({...personalForm, nombre: e.target.value})} 
                  required 
                />
              </div>
              <div className="da-form-group">
                <label>Carrera</label>
                <input 
                  type="text" 
                  value={personalForm.carrera} 
                  onChange={e => setPersonalForm({...personalForm, carrera: e.target.value})} 
                  required 
                />
              </div>
              <div className="da-form-group">
                <label>Semestre</label>
                <input 
                  type="number" 
                  min="1" max="12"
                  value={personalForm.semestre} 
                  onChange={e => setPersonalForm({...personalForm, semestre: e.target.value})} 
                  required 
                />
              </div>
              <div className="da-modal-buttons">
                <button type="button" className="da-btn-cancel" onClick={() => toggleModal('personal', false)}>Cancelar</button>
                <button type="submit" className="da-btn-submit">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Progreso */}
      {modals.progress && (
        <div className="da-modal-overlay" onClick={(e) => e.target.className === 'da-modal-overlay' && toggleModal('progress', false)}>
          <div className="da-modal-content">
            <h3>Actualizar Avance en Inglés</h3>
            <form onSubmit={handleProgressSubmit}>
              <div className="da-form-group">
                <label>Nivel Actual</label>
                <select 
                  value={progressForm.nivel} 
                  onChange={e => setProgressForm({...progressForm, nivel: e.target.value})}
                  required
                >
                  {Object.keys(nivelColors).map(nivel => (
                    <option key={nivel} value={nivel}>{nivel}</option>
                  ))}
                </select>
              </div>
              <div className="da-form-group">
                <label>Porcentaje de Avance (%)</label>
                <input 
                  type="number" 
                  min="0" max="100"
                  value={progressForm.porcentaje} 
                  onChange={e => setProgressForm({...progressForm, porcentaje: e.target.value})} 
                  required 
                />
              </div>
              <div className="da-modal-buttons">
                <button type="button" className="da-btn-cancel" onClick={() => toggleModal('progress', false)}>Cancelar</button>
                <button type="submit" className="da-btn-submit">Actualizar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Asistencia */}
      {modals.attendance && (
        <div className="da-modal-overlay" onClick={(e) => e.target.className === 'da-modal-overlay' && toggleModal('attendance', false)}>
          <div className="da-modal-content">
            <h3>Registrar Asistencia Manual</h3>
            <form onSubmit={handleAttendanceSubmit}>
              <div className="da-form-group">
                <label>Fecha</label>
                <input 
                  type="date" 
                  value={attendanceForm.fecha} 
                  onChange={e => setAttendanceForm({...attendanceForm, fecha: e.target.value})} 
                  required 
                />
              </div>
              <div className="da-form-group">
                <label>Tipo</label>
                <select 
                  value={attendanceForm.tipo} 
                  onChange={e => setAttendanceForm({...attendanceForm, tipo: e.target.value})}
                  required
                >
                  <option value="Asistencia">Asistencia</option>
                  <option value="Falta">Falta</option>
                  <option value="Retardo">Retardo</option>
                </select>
              </div>
              <div className="da-form-group">
                <label>Observaciones</label>
                <textarea 
                  value={attendanceForm.observaciones} 
                  onChange={e => setAttendanceForm({...attendanceForm, observaciones: e.target.value})} 
                  placeholder="Opcional"
                  rows="3"
                />
              </div>
              <div className="da-modal-buttons">
                <button type="button" className="da-btn-cancel" onClick={() => toggleModal('attendance', false)}>Cancelar</button>
                <button type="submit" className="da-btn-submit">Registrar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default DashboardAlumnos;