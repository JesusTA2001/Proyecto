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

  // Cargar datos desde la base de datos
  useEffect(() => {
    const cargarDatos = async () => {
      if (!alumnoLogueado.numero_control) return;
      
      try {
        setIsLoading(true);
        
        // Cargar datos del estudiante desde la API (si tienes endpoint)
        // Por ahora usamos los datos del localStorage que vienen del login
        setDatosPersonales(alumnoLogueado);
        
        // Cargar grupo actual del estudiante
        // TODO: Crear endpoint para obtener grupo actual del estudiante
        // const grupoResponse = await api.get(`/estudiantes/${alumnoLogueado.numero_control}/grupo-actual`);
        // setGrupoActual(grupoResponse.data);
        
        // Cargar asistencias del estudiante
        try {
          const asistenciasResponse = await api.get(`/asistencias/historial/${alumnoLogueado.numero_control}`);
          setAttendanceRecords(asistenciasResponse.data || []);
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
  }, [alumnoLogueado.numero_control]);

  // Estados de los Modales (solo para ver datos, ya no editar)
  const [modals, setModals] = useState({
    personal: false
  });

  // --- Cálculos de Estadísticas ---
  const stats = useMemo(() => {
    if (!Array.isArray(attendanceRecords)) {
      return { asistencias: 0, faltas: 0, retardos: 0, porcentaje: 0 };
    }
    
    const total = attendanceRecords.length;
    if (total === 0) return { asistencias: 0, faltas: 0, retardos: 0, porcentaje: 0 };

    const asistencias = attendanceRecords.filter(r => r.presente || r.tipo === 'Asistencia').length;
    const faltas = total - asistencias; // Los que no están en la lista son faltas
    const porcentaje = Math.round((asistencias / total) * 100);

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
        <div className="da-section-header">
          <h2>
            <div className="da-section-icon icon-bg-purple">👤</div>
            Datos Personales
          </h2>
        </div>
        <div className="da-info-grid">
          <div className="da-info-item">
            <span className="da-info-label">Número de Control</span>
            <span className="da-info-value">{datosPersonales?.numero_control || 'N/A'}</span>
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
        </div>
      </section>

      {/* Sección: Avance en Inglés */}
      <section className="da-section section-blue">
        <div className="da-section-header">
          <h2>
            <div className="da-section-icon icon-bg-blue">📚</div>
            Mi Nivel de Inglés
          </h2>
        </div>
        
        <div className="da-progress-container">
          <div className="da-stats-row">
            <div className="da-stat-box">
              <h4>Nivel Actual</h4>
              <p className="da-stat-value">{grupoActual?.nivel || 'Sin asignar'}</p>
            </div>
            <div className="da-stat-box">
              <h4>Grupo</h4>
              <p className="da-stat-value">{grupoActual?.nombre || 'Sin grupo'}</p>
            </div>
          </div>
          
          {grupoActual && (
            <div style={{ marginTop: '1.5rem' }}>
              <span className="da-nivel-badge-large" style={{ backgroundColor: nivelColors[grupoActual.nivel] || '#3b82f6' }}>
                {grupoActual.nivel}
              </span>
            </div>
          )}
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
                        <span className={`da-attendance-badge badge-asistencia`}>
                          Asistencia
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

    </div>
  );
}

export default DashboardAlumnos;