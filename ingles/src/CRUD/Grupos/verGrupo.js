import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../hojas-de-estilo/listaEstudiante.css'; // Reutilizar estilos

// Recibe grupos, profesores y alumnos como props
function VerGrupo({ grupos, profesores, alumnos }) {
  const { id } = useParams();
  const grupo = grupos.find(g => g.id === id);

  if (!grupo) {
    return <div className="detail-container"><h2>Grupo no encontrado</h2>{/* ... botón volver ... */}</div>;
  }

  const profesor = profesores.find(p => p.numero_empleado === grupo.profesorId);
  // Obtener los datos completos de los alumnos del grupo (máximo 20)
  const alumnosEnGrupo = grupo.alumnoIds.slice(0, 20).map(alumnoId =>
    alumnos.find(a => a.numero_control === alumnoId)
  ).filter(Boolean); // Filtrar por si algún ID no se encuentra

  return (
    <div className="detail-container">
      <Link to="/lista-grupos" className="back-button-link">
         <button className="createbutton">Volver a la lista</button>
      </Link>
      <h2>{grupo.nombre}</h2>

      <h3 className="detail-section-title">Información del Grupo</h3>
      <div className="detail-grid">
        <p><strong>Nivel:</strong> {grupo.nivel}</p>
        <p><strong>Modalidad:</strong> {grupo.modalidad}</p>
        <p><strong>Ubicación:</strong> {grupo.ubicacion}</p>
        <p><strong>Profesor:</strong> {profesor ? profesor.nombre : 'No asignado'}</p>
        <p><strong>Total Alumnos:</strong> {grupo.alumnoIds.length}</p>
      </div>

      <h3 className="detail-section-title">Alumnos Inscritos (Primeros 20)</h3>
      {alumnosEnGrupo.length > 0 ? (
        <table className="alumnos-table" style={{ marginTop: '15px' }}>
          <thead>
            <tr>
              <th>Número de Control</th>
              <th>Nombre</th>
              <th>Correo</th>
            </tr>
          </thead>
          <tbody>
            {alumnosEnGrupo.map(alumno => (
              <tr key={alumno.numero_control}>
                <td>{alumno.numero_control}</td>
                <td>{alumno.nombre}</td>
                <td>{alumno.correo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay alumnos asignados a este grupo.</p>
      )}
       {grupo.alumnoIds.length > 20 && (
            <p style={{marginTop: '10px', fontStyle: 'italic'}}>Mostrando los primeros 20 de {grupo.alumnoIds.length} alumnos.</p>
       )}
    </div>
  );
}

export default VerGrupo;