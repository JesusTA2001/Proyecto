import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../hojas-de-estilo/listaEstudiante.css'; // Reutilizar estilos

// Muestra una LISTA DE PROFESORES
function ListaHorarios({ profesores }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const filteredProfesores = profesores.filter(profesor => {
    const term = searchTerm.toLowerCase();
    const textMatch = !term ||
      profesor.nombre.toLowerCase().includes(term) ||
      profesor.numero_empleado.toLowerCase().includes(term);
    
    // Filtra por ubicación (Tecnologico, Centro de Idiomas, o Ambos)
    const locationMatch = !selectedLocation ||
      profesor.ubicacion === selectedLocation ||
      profesor.ubicacion === 'Ambos';
      
    // Muestra solo profesores activos en la lista de horarios
    return textMatch && locationMatch && profesor.estado === 'Activo';
  });

  return (
    <div className="lista-container">
      <div className="lista-header"> {/* Encabezado pegajoso */}
        <div className="header-actions">
          <input 
            type="text" 
            placeholder="🔍 Buscar profesor por Nombre o N° Empleado..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
           {/* No hay botón "Crear" porque el horario se gestiona desde los Grupos */}
        </div>
        
        {/* Filtros de Ubicación */}
        <div className="filter-section">
           <div className="filter-group">
             <label>Filtrar por Ubicación:</label>
             <div className="button-group">
                <button
                    className={`filter-button ${selectedLocation === '' ? 'active' : ''}`}
                    onClick={() => setSelectedLocation('')}
                > Todos </button>
                <button
                    className={`filter-button ${selectedLocation === 'Tecnologico' ? 'active' : ''}`}
                    onClick={() => setSelectedLocation('Tecnologico')}
                > Tecnológico </button>
                <button
                    className={`filter-button ${selectedLocation === 'Centro de Idiomas' ? 'active' : ''}`}
                    onClick={() => setSelectedLocation('Centro de Idiomas')}
                > Centro de Idiomas </button>
             </div>
          </div>
        </div>
      </div>

      <table className="alumnos-table">
        <thead>
          <tr>
            <th>Número de Empleado</th>
            <th>Nombre del Profesor</th>
            <th>Ubicación</th>
            <th>Correo</th>
            <th>Horario</th>
          </tr>
        </thead>
        <tbody>
          {filteredProfesores.length > 0 ? (
            filteredProfesores.map((profesor) => (
              <tr key={profesor.numero_empleado}>
                <td>{profesor.numero_empleado}</td>
                <td>{profesor.nombre}</td>
                <td>{profesor.ubicacion}</td>
                <td>{profesor.correo}</td>
                <td className="acciones-cell" style={{ fontSize: 0 }}>
                  {/* Enlace al componente VerHorario con el ID del profesor */}
                  <Link to={`/ver-horario/${profesor.numero_empleado}`} title="Ver Horario">
                    <button className='view-button icon-button'>👁️</button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-results-cell">
                No se encontraron profesores activos que coincidan con los filtros.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Aquí podrías añadir paginación si tienes muchos profesores */}
    </div>
  );
}

export default ListaHorarios;