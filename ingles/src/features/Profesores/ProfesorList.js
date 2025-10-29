import React, { useState, useEffect } from "react"; // Importar useEffect
import { Link } from "react-router-dom";
import '../../styles/listaEstudiante.css'; // Reutilizamos los mismos estilos
import { gradoEstudioOptions } from '../../data/mapping'; // Importamos las opciones de grado

// 1. Define how many items per page
const ITEMS_PER_PAGE = 50;

function ListaProfesor({ profesores, toggleEstado }) {
  // --- Estados para filtros y paginación ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // --- Lógica de Filtrado ---
  const filteredProfesores = profesores.filter(profesor => {
    const term = searchTerm.toLowerCase();

    // 1. Filtro por texto (Nombre o N° Empleado)
    const textMatch = !term ||
      profesor.nombre.toLowerCase().includes(term) ||
      profesor.numero_empleado.toLowerCase().includes(term);

    // 2. Filtro por Ubicación
    const locationMatch = !selectedLocation || profesor.ubicacion === selectedLocation;

    // 3. Filtro por Estado (Activo/Inactivo)
    const statusMatch = !selectedStatus || profesor.estado === selectedStatus;
    
    // 4. Filtro por Grado de Estudio
    const gradeMatch = !selectedGrade || profesor.gradoEstudio === selectedGrade;

    // Devuelve solo si CUMPLE TODOS los filtros
    return textMatch && locationMatch && statusMatch && gradeMatch;
  });

  // --- Lógica de Paginación ---
  const totalPages = Math.ceil(filteredProfesores.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  // Corta la lista filtrada para mostrar solo la página actual
  const paginatedProfesores = filteredProfesores.slice(startIndex, endIndex);

  // --- Handlers de Paginación ---
  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };
  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };
  
  // Handler para botones de ubicación
  const handleLocationFilter = (location) => {
    setSelectedLocation(location);
  };

  // --- Resetea la página a 1 si cambia algún filtro ---
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLocation, selectedStatus, selectedGrade]);


  return (
    <div className="lista-container">
      <div className="lista-header"> {/* Encabezado pegajoso */}
        
        {/* --- Acción Principal (Búsqueda y Botón Nuevo) --- */}
        <div className="header-actions">
          <input 
            type="text" 
            placeholder="🔍 Buscar por Nombre o N° de Empleado..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link to="/crear-profesor">
            <button className='createbutton'>Nuevo Profesor</button>
          </Link>
        </div>

        {/* --- Sección de Filtros (Botones y Selects) --- */}
        <div className="filter-section">
          
          {/* 1. Botones de Ubicación */}
          <div className="filter-group">
             <label>Filtrar por Ubicación:</label>
             <div className="button-group">
                <button
                    className={`filter-button ${selectedLocation === '' ? 'active' : ''}`}
                    onClick={() => handleLocationFilter('')}
                > Todos </button>
                <button
                    className={`filter-button ${selectedLocation === 'Tecnologico' ? 'active' : ''}`}
                    onClick={() => handleLocationFilter('Tecnologico')}
                > Tecnológico </button>
                <button
                    className={`filter-button ${selectedLocation === 'Centro de Idiomas' ? 'active' : ''}`}
                    onClick={() => handleLocationFilter('Centro de Idiomas')}
                > Centro de Idiomas </button>
                <button
                    className={`filter-button ${selectedLocation === 'Ambos' ? 'active' : ''}`}
                    onClick={() => handleLocationFilter('Ambos')}
                > Ambos </button>
             </div>
          </div>

          {/* 2. Selects de Estado y Grado */}
          <div className="filter-container">
            {/* Filtro Estado */}
            <div className="filter-group">
              <label htmlFor="status-filter">Estado:</label>
              <select 
                id="status-filter" 
                className="filter-select" 
                value={selectedStatus} 
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
            {/* Filtro Grado de Estudio */}
            <div className="filter-group">
              <label htmlFor="grade-filter">Grado de Estudio:</label>
              <select 
                id="grade-filter" 
                className="filter-select" 
                value={selectedGrade} 
                onChange={(e) => setSelectedGrade(e.target.value)}
              >
                <option value="">Todos</option>
                {gradoEstudioOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div> {/* Fin filter-container */}
        </div> {/* Fin filter-section */}
      </div> {/* Fin lista-header */}

      <table className="alumnos-table">
        <thead>
          <tr>
            <th>Número de Empleado</th>
            <th>Nombre Completo</th>
            <th>Ubicación</th> {/* Columna añadida */}
            <th>Grado de Estudio</th> {/* Columna añadida */}
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* Mapea sobre la lista PAGINADA */}
          {paginatedProfesores.length > 0 ? (
            paginatedProfesores.map((profesor) => (
              <tr key={profesor.numero_empleado}>
                <td>{profesor.numero_empleado}</td>
                <td>{profesor.nombre}</td>
                <td>{profesor.ubicacion}</td> {/* Dato añadido */}
                <td>{profesor.gradoEstudio}</td> {/* Dato añadido */}
                <td>
                  <button 
                    className={`estado-button ${profesor.estado === 'Activo' ? 'activo' : 'inactivo'}`}
                    onClick={() => toggleEstado(profesor.numero_empleado, 'profesor')}
                  >
                    {profesor.estado}
                  </button>
                </td>
                <td className="acciones-cell" style={{ fontSize: 0 }}> {/* font-size: 0 para arreglar espacios */}
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
              {/* Actualiza el colspan a 6 */}
              <td colSpan="6" className="no-results-cell">
                No se encontraron profesores que coincidan con los filtros.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* --- Controles de Paginación --- */}
      <div className="pagination-controls">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages} ({filteredProfesores.length} resultados)
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
          className="pagination-button"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default ListaProfesor;
