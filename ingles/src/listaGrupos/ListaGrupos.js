import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../hojas-de-estilo/listaEstudiante.css'; // Reutilizar estilos

// Recibe grupos, profesores y alumnos como props
function ListaGrupos({ grupos, profesores, alumnos }) {
  const [searchTerm, setSearchTerm] = useState('');
  // const [currentPage, setCurrentPage] = useState(1); // Añadir paginación después
  // const ITEMS_PER_PAGE = 20;

  // Lógica de filtrado (puedes añadir filtros por nivel, ubicación, etc.)
  const filteredGrupos = grupos.filter(grupo =>
    grupo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grupo.nivel.toLowerCase().includes(searchTerm.toLowerCase())
    // Añadir más condiciones de filtro si es necesario
  );

  // Lógica de paginación (similar a ListaEstudiante)
  // const totalPages = Math.ceil(filteredGrupos.length / ITEMS_PER_PAGE);
  // const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  // const endIndex = startIndex + ITEMS_PER_PAGE;
  // const paginatedGrupos = filteredGrupos.slice(startIndex, endIndex);

  const findProfesorNombre = (profesorId) => {
    const profesor = profesores.find(p => p.numero_empleado === profesorId);
    return profesor ? profesor.nombre : 'No asignado';
  };

  return (
    <div className="lista-container">
      <div className="lista-header"> {/* Añadir filtros aquí después */}
         <div className="header-actions">
            <input
                type="text"
                placeholder="🔍 Buscar por Nombre, Nivel..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
             <Link to="/crear-grupo">
                <button className='createbutton'>Nuevo Grupo</button>
             </Link>
         </div>
         {/* ... (Aquí irían los filtros como en ListaEstudiante) ... */}
      </div>

      <table className="alumnos-table"> {/* Reutilizar clase */}
        <thead>
          <tr>
            <th>Nombre del Grupo</th>
            <th>Nivel</th>
            <th>Modalidad</th>
            <th>Ubicación</th>
            <th>Profesor Asignado</th>
            <th># Alumnos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* Mapear sobre filteredGrupos (o paginatedGrupos si implementas paginación) */}
          {filteredGrupos.map((grupo) => (
            <tr key={grupo.id}>
              <td>{grupo.nombre}</td>
              <td>{grupo.nivel}</td>
              <td>{grupo.modalidad}</td>
              <td>{grupo.ubicacion}</td>
              <td>{findProfesorNombre(grupo.profesorId)}</td>
              <td>{grupo.alumnoIds.length}</td>
              <td className="acciones-cell">
                 <Link to={`/ver-grupo/${grupo.id}`} title="Ver Detalles">
                    <button className='view-button icon-button'>👁️</button>
                 </Link>
                 <Link to={`/modificar-grupo/${grupo.id}`} title="Modificar">
                     <button className='modifybutton icon-button'>✏️</button>
                 </Link>
                 <Link to={`/eliminar-grupo/${grupo.id}`} title="Eliminar">
                     <button className='deletebutton icon-button'>🗑️</button>
                 </Link>
              </td>
            </tr>
          ))}
          {filteredGrupos.length === 0 && (
             <tr><td colSpan="7" className="no-results-cell">No se encontraron grupos.</td></tr>
          )}
        </tbody>
      </table>
      {/* ... (Aquí irían los controles de paginación) ... */}
    </div>
  );
}

export default ListaGrupos;