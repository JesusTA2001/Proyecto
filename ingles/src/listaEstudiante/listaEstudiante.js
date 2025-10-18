import React, { useState } from "react";
import { Link } from "react-router-dom";
import '../hojas-de-estilo/listaEstudiante.css';

function ListaEstudiante({ alumnos, toggleEstado }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAlumnos = alumnos.filter(alumno => {
    const term = searchTerm.toLowerCase();
    // Si no hay término de búsqueda, muestra todos los alumnos
    if (!term) return true;
    
    return (
      alumno.nombre.toLowerCase().includes(term) ||
      alumno.numero_control.toLowerCase().includes(term) ||
      // --- CORRECCIÓN AQUÍ: Usamos startsWith para el estado ---
      alumno.estado.toLowerCase().startsWith(term)
    );
  });

  return (
    <div className="lista-container">
      <div className="lista-header">
        <div className="header-actions">
          <input 
            type="text" 
            placeholder="🔍 Buscar por Nombre, N° de Control o Estado..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link to="/crear-alumno">
            <button className='createbutton'>Nuevo Alumno</button>
          </Link>
        </div>
      </div>

      <table className="alumnos-table">
        <thead>
          <tr>
            <th>Número de Control</th>
            <th>Nombre Completo</th>
            <th>Carrera</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredAlumnos.length > 0 ? (
            filteredAlumnos.map((alumno) => (
              <tr key={alumno.numero_control}>
                <td>{alumno.numero_control}</td>
                <td>{alumno.nombre}</td>
                <td>{alumno.carrera}</td>
                <td>
                  <button 
                    className={`estado-button ${alumno.estado === 'Activo' ? 'activo' : 'inactivo'}`}
                    onClick={() => toggleEstado(alumno.numero_control, 'alumno')}
                  >
                    {alumno.estado}
                  </button>
                </td>
                <td className="acciones-cell">
                  <Link to={`/ver-alumno/${alumno.numero_control}`} title="Ver Detalles">
                    <button className='view-button icon-button'>👁️</button>
                  </Link>
                  <Link to={`/modificar-alumno/${alumno.numero_control}`} title="Modificar">
                    <button className='modifybutton icon-button'>✏️</button>
                  </Link>
                  <Link to={`/eliminar-alumno/${alumno.numero_control}`} title="Eliminar">
                    <button className='deletebutton icon-button'>🗑️</button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-results-cell">
                No existen Alumnos con ese Nombre o Número de Control, corrobora que tu información sea correcta.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ListaEstudiante;