import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import '../../styles/DashboardAlumnos.css';

function MisCalificaciones() {
  const [datosPersonales, setDatosPersonales] = useState(null);
  const [calificaciones, setCalificaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setIsLoading(true);
        const alumnoLogueado = JSON.parse(localStorage.getItem('currentUser') || '{}');
        
        if (!alumnoLogueado.numero_control) {
          console.error('No se encontró número de control');
          return;
        }

        // Cargar datos personales
        setDatosPersonales(alumnoLogueado);

        // Cargar calificaciones del estudiante
        try {
          const response = await api.get(`/calificaciones/estudiante/${alumnoLogueado.numero_control}`);
          setCalificaciones(response.data.calificaciones || []);
        } catch (error) {
          console.error('Error al cargar calificaciones:', error);
          setCalificaciones([]);
        }

      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatos();
  }, []);

  if (isLoading) {
    return (
      <div className="da-container">
        <div className="da-header">
          <h1>Cargando calificaciones...</h1>
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
        <h1>Mis Calificaciones</h1>
        <p>{nombreCompleto}</p>
      </div>

      {/* Tabla de Calificaciones */}
      <section className="da-section section-blue">
        <div className="da-section-header">
          <h2>
            <div className="da-section-icon icon-bg-blue">📊</div>
            Historial de Calificaciones
          </h2>
        </div>

        {calificaciones.length === 0 ? (
          <div className="da-empty-state">
            <p>No tienes calificaciones registradas aún.</p>
          </div>
        ) : (
          <div className="da-table-wrapper">
            <table className="da-attendance-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Periodo</th>
                  <th>Nivel</th>
                  <th>Grupo</th>
                  <th>Profesor</th>
                  <th>Parcial 1</th>
                  <th>Parcial 2</th>
                  <th>Parcial 3</th>
                  <th>Final</th>
                </tr>
              </thead>
              <tbody>
                {calificaciones.map((cal, index) => (
                  <tr key={index}>
                    <td>{cal.periodo_nombre || 'N/A'}</td>
                    <td>{cal.nivel_nombre || 'N/A'}</td>
                    <td>{cal.grupo_nombre || 'N/A'}</td>
                    <td>{cal.profesor_nombre || 'N/A'}</td>
                    <td>
                      <span style={{ 
                        fontWeight: 'bold', 
                        color: cal.parcial1 >= 70 ? '#22c55e' : '#ef4444' 
                      }}>
                        {cal.parcial1 !== null ? cal.parcial1 : '-'}
                      </span>
                    </td>
                    <td>
                      <span style={{ 
                        fontWeight: 'bold', 
                        color: cal.parcial2 >= 70 ? '#22c55e' : '#ef4444' 
                      }}>
                        {cal.parcial2 !== null ? cal.parcial2 : '-'}
                      </span>
                    </td>
                    <td>
                      <span style={{ 
                        fontWeight: 'bold', 
                        color: cal.parcial3 >= 70 ? '#22c55e' : '#ef4444' 
                      }}>
                        {cal.parcial3 !== null ? cal.parcial3 : '-'}
                      </span>
                    </td>
                    <td>
                      <span style={{ 
                        fontWeight: 'bold', 
                        fontSize: '1.1rem',
                        color: cal.final >= 70 ? '#22c55e' : '#ef4444' 
                      }}>
                        {cal.final !== null ? cal.final : '-'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Resumen de calificaciones */}
        {calificaciones.length > 0 && (
          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '1rem', color: '#374151' }}>Resumen</h3>
            <div className="da-stats-row">
              <div className="da-stat-box">
                <h4>Total de Cursos</h4>
                <p className="da-stat-value" style={{ color: '#3b82f6' }}>
                  {calificaciones.length}
                </p>
              </div>
              <div className="da-stat-box">
                <h4>Promedio General</h4>
                <p className="da-stat-value" style={{ color: '#6366f1' }}>
                  {calificaciones.length > 0 
                    ? (calificaciones.reduce((sum, cal) => sum + (cal.final || 0), 0) / calificaciones.length).toFixed(1)
                    : 'N/A'
                  }
                </p>
              </div>
              <div className="da-stat-box">
                <h4>Cursos Aprobados</h4>
                <p className="da-stat-value" style={{ color: '#22c55e' }}>
                  {calificaciones.filter(cal => cal.final >= 70).length}
                </p>
              </div>
              <div className="da-stat-box">
                <h4>Cursos Reprobados</h4>
                <p className="da-stat-value" style={{ color: '#ef4444' }}>
                  {calificaciones.filter(cal => cal.final < 70 && cal.final !== null).length}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default MisCalificaciones;
