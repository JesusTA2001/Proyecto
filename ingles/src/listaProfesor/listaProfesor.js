import React, { useState } from "react";
import { Link } from "react-router-dom";
import '../hojas-de-estilo/listaEstudiante.css';

function ListaProfesor({ profesores, toggleEstado }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProfesores = profesores.filter(profesor => {
    const term = searchTerm.toLowerCase();
    // Si no hay término de búsqueda, muestra todos los profesores
    if (!term) return true;
    
    return (
      profesor.nombre.toLowerCase().includes(term) ||
      profesor.numero_empleado.toLowerCase().includes(term) ||
      // Se usa startsWith para diferenciar "activo" de "inactivo"
      profesor.estado.toLowerCase().startsWith(term)
    );
  });

  return (
    <div className="lista-container">
      <div className="lista-header">
        <div className="header-actions">
          <input 
            type="text" 
            placeholder="🔍 Buscar por Nombre, N° de Empleado o Estado..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link to="/crear-profesor">
            <button className='createbutton'>Nuevo Profesor</button>
          </Link>
        </div>
      </div>

      <table className="alumnos-table">
        <thead>
          <tr>
            <th>Número de Empleado</th>
            <th>Nombre Completo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* Lógica para mostrar resultados o el mensaje de "no encontrado" */}
          {filteredProfesores.length > 0 ? (
            filteredProfesores.map((profesor) => (
              <tr key={profesor.numero_empleado}>
                <td>{profesor.numero_empleado}</td>
                <td>{profesor.nombre}</td>
                <td>
                  <button 
                    className={`estado-button ${profesor.estado === 'Activo' ? 'activo' : 'inactivo'}`}
                    onClick={() => toggleEstado(profesor.numero_empleado, 'profesor')}
                  >
                    {profesor.estado}
                  </button>
                </td>
                <td className="acciones-cell">
                   <Link to={`/ver-profesor/${profesor.numero_empleado}`} title="Ver Detalles">
                    <button className='view-button icon-button'>👁️</button>
                  </Link>
                  <Link to={`/modificar-profesor/${profesor.numero_empleado}`} title="Modificar">
                    <button className='modifybutton icon-button'>✏️</button>
                  </Link>
                  <Link to={`/eliminar-profesor/${profesor.numero_empleado}`} title="Eliminar">
                    <button className='deletebutton icon-button'>🗑️</button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-results-cell">
                No existe un Profesor con ese Número de Empleado o Nombre, corrobora que tu información sea correcta.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ListaProfesor;