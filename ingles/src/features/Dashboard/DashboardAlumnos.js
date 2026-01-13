import React, { useState, useMemo, useEffect } from 'react';
import '../../styles/DashboardAlumnos.css';
import api from '../../api/axios';

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

function DashboardAlumnos({ alumno }) {
  // Obtener datos del alumno logueado
  const alumnoLogueado = alumno || JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  // Estados para datos del estudiante desde la API
  const [datosPersonales, setDatosPersonales] = useState(null);
  const [grupoActual, setGrupoActual] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalEditarDatos, setModalEditarDatos] = useState(false);
  const [datosEditables, setDatosEditables] = useState({ email: '', telefono: '', direccion: '' });

  // Cargar datos desde la base de datos
  useEffect(() => {
    const cargarDatos = async () => {
      const nControl = alumnoLogueado.nControl || alumnoLogueado.numero_control;
      if (!nControl) return;
      
      try {
        setIsLoading(true);
        
        // Cargar datos del estudiante desde la API
        try {
          const estudianteResponse = await api.get(`/alumnos/${nControl}`);
          setDatosPersonales(estudianteResponse.data);
          setDatosEditables({
            email: estudianteResponse.data.email || '',
            telefono: estudianteResponse.data.telefono || '',
            direccion: estudianteResponse.data.direccion || ''
          });
        } catch (error) {
          console.error('Error al cargar datos del estudiante:', error);
          // Fallback a localStorage si falla la API
          setDatosPersonales(alumnoLogueado);
        }
        
        // Cargar grupo actual del estudiante
        try {
          const grupoResponse = await api.get(`/alumnos/${nControl}/grupo`);
          if (grupoResponse.data.success && grupoResponse.data.grupo) {
            setGrupoActual(grupoResponse.data.grupo);
          } else {
            setGrupoActual(null);
          }
        } catch (error) {
          console.error('Error al cargar grupo del estudiante:', error);
          setGrupoActual(null);
        }
        
        // Cargar asistencias del estudiante
        try {
          const asistenciasResponse = await api.get(`/asistencias/historial/${nControl}`);
          if (asistenciasResponse.data.success) {
            setAttendanceRecords(asistenciasResponse.data.historial || []);
          } else {
            setAttendanceRecords([]);
          }
        } catch (error) {
          console.error('Error al cargar asistencias:', error);
          setAttendanceRecords([]);
        }
        
      } catch (error) {
        console.error('Error al cargar datos del estudiante:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    cargarDatos();
  }, []);

  // Estados de los Modales (solo para ver datos, ya no editar)
  const [modals, setModals] = useState({
    personal: false
  });

  // Manejadores para editar datos personales
  const handleEditarDatos = () => {
    setModalEditarDatos(true);
  };

  const handleCerrarModalEditar = () => {
    setModalEditarDatos(false);
    // Restaurar valores originales si se cancela
    setDatosEditables({
      email: datosPersonales?.email || '',
      telefono: datosPersonales?.telefono || '',
      direccion: datosPersonales?.direccion || ''
    });
  };

  const handleGuardarDatos = async () => {
    try {
      // Usar nControl o numero_control según lo que esté disponible
      const nControl = alumnoLogueado.nControl || alumnoLogueado.numero_control;
      
      console.log('Enviando datos:', datosEditables);
      console.log('nControl del alumno:', nControl);
      console.log('URL:', `/alumnos/${nControl}/datos-personales`);
      
      const response = await api.patch(`/alumnos/${nControl}/datos-personales`, datosEditables);
      
      console.log('Respuesta del servidor:', response.data);
      
      if (response.data.success) {
        // Actualizar datos personales en el estado
        setDatosPersonales(prev => ({
          ...prev,
          ...datosEditables
        }));
        
        // Actualizar localStorage también
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        localStorage.setItem('currentUser', JSON.stringify({
          ...currentUser,
          ...datosEditables
        }));
        
        alert('Datos actualizados exitosamente');
        setModalEditarDatos(false);
      }
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Respuesta del error:', error.response?.data);
      console.error('Status del error:', error.response?.status);
      
      const mensajeError = error.response?.data?.message || 'Error al actualizar los datos. Por favor, intenta nuevamente.';
      alert(mensajeError);
    }
  };

  const handleCambioInput = (e) => {
    const { name, value } = e.target;
    setDatosEditables(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // --- Cálculos de Estadísticas ---
  const stats = useMemo(() => {
    if (!Array.isArray(attendanceRecords)) {
      return { asistencias: 0, faltas: 0, retardos: 0, porcentaje: 0 };
    }
    
    const total = attendanceRecords.length;
    if (total === 0) return { asistencias: 0, faltas: 0, retardos: 0, porcentaje: 0 };

    // Contar asistencias y faltas basado en el campo 'presente' o 'tipo'
    const asistencias = attendanceRecords.filter(r => r.presente === true || r.tipo === 'Asistencia').length;
    const faltas = attendanceRecords.filter(r => r.presente === false || r.tipo === 'Falta').length;
    const porcentaje = total > 0 ? Math.round((asistencias / total) * 100) : 0;

    return { asistencias, faltas, retardos: 0, porcentaje };
  }, [attendanceRecords]);

  // --- Manejadores de Modales ---
  const toggleModal = (modalName, isOpen) => {
    setModals(prev => ({ ...prev, [modalName]: isOpen }));
  };

  if (isLoading) {
    return (
      <div className="da-container">
        <div className="da-header">
          <h1>Cargando información...</h1>
        </div>
      </div>
    );
  }

  const nombreCompleto = datosPersonales 
    ? `${datosPersonales.nombre || ''} ${datosPersonales.apellidoPaterno || ''} ${datosPersonales.apellidoMaterno || ''}`.trim()
    : 'Estudiante';

  return (
    <div className="da-container">
      <div className="da-header">
        <h1>Mi Progreso Académico</h1>
        <p>{nombreCompleto}</p>
      </div>

      {/* Sección: Datos Personales */}
      <section className="da-section section-purple">
        <div className="da-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>
            <div className="da-section-icon icon-bg-purple">👤</div>
            Datos Personales
          </h2>
          <button 
            className="createbutton" 
            onClick={handleEditarDatos}
            style={{ fontSize: '0.9rem', padding: '8px 16px' }}
          >
            ✏️ Editar Datos
          </button>
        </div>
        <div className="da-info-grid">
          <div className="da-info-item">
            <span className="da-info-label">Número de Control</span>
            <span className="da-info-value">{datosPersonales?.nControl || alumnoLogueado?.nControl || alumnoLogueado?.numero_control || 'N/A'}</span>
          </div>
          <div className="da-info-item">
            <span className="da-info-label">Nombre Completo</span>
            <span className="da-info-value">{nombreCompleto}</span>
          </div>
          <div className="da-info-item">
            <span className="da-info-label">Correo</span>
            <span className="da-info-value">{datosPersonales?.email || 'N/A'}</span>
          </div>
          <div className="da-info-item">
            <span className="da-info-label">CURP</span>
            <span className="da-info-value">{datosPersonales?.CURP || 'N/A'}</span>
          </div>
          <div className="da-info-item">
            <span className="da-info-label">Teléfono</span>
            <span className="da-info-value">{datosPersonales?.telefono || 'N/A'}</span>
          </div>
          <div className="da-info-item">
            <span className="da-info-label">Género</span>
            <span className="da-info-value">{datosPersonales?.genero || 'N/A'}</span>
          </div>
          <div className="da-info-item">
            <span className="da-info-label">Dirección</span>
            <span className="da-info-value">{datosPersonales?.direccion || 'N/A'}</span>
          </div>
        </div>
      </section>

      {/* Sección: Registro de Asistencias */}
      <section className="da-section section-green">
        <div className="da-section-header">
          <h2>
            <div className="da-section-icon icon-bg-green">📋</div>
            Mi Registro de Asistencias
          </h2>
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
                <h4>% Asistencia</h4>
                <p className="da-stat-value" style={{ color: '#3b82f6' }}>{stats.porcentaje}%</p>
              </div>
            </div>

            <div className="da-table-wrapper">
              <table className="da-attendance-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Grupo</th>
                    <th>Nivel</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(attendanceRecords) && attendanceRecords.sort((a,b) => new Date(b.fecha) - new Date(a.fecha)).map((record, index) => (
                    <tr key={index}>
                      <td>{new Date(record.fecha).toLocaleDateString('es-MX')}</td>
                      <td>{record.grupo_nombre || 'N/A'}</td>
                      <td>{record.nivel_nombre || 'N/A'}</td>
                      <td>
                        <span className={`da-attendance-badge ${record.presente || record.tipo === 'Asistencia' ? 'badge-asistencia' : 'badge-falta'}`}>
                          {record.presente || record.tipo === 'Asistencia' ? 'Asistencia' : 'Falta'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {/* Modal para Editar Datos Personales */}
      {modalEditarDatos && (
        <div className="modal-overlay" onClick={handleCerrarModalEditar}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>✏️ Editar Datos Personales</h2>
              <button className="modal-close" onClick={handleCerrarModalEditar}>×</button>
            </div>
            <div className="modal-body" style={{ padding: '20px' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  name="email"
                  value={datosEditables.email}
                  onChange={handleCambioInput}
                  className="form-input"
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                  Teléfono *
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={datosEditables.telefono}
                  onChange={handleCambioInput}
                  className="form-input"
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                  Dirección
                </label>
                <textarea
                  name="direccion"
                  value={datosEditables.direccion}
                  onChange={handleCambioInput}
                  className="form-input"
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', minHeight: '80px', resize: 'vertical' }}
                  placeholder="Calle, número, colonia, ciudad..."
                />
              </div>
            </div>
            <div className="modal-footer" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', padding: '15px 20px', borderTop: '1px solid #eee' }}>
              <button className="deletebutton" onClick={handleCerrarModalEditar}>
                Cancelar
              </button>
              <button className="createbutton" onClick={handleGuardarDatos}>
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default DashboardAlumnos;