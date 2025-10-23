import React, { useState, useEffect } from "react"; // Import useEffect
import { Link } from "react-router-dom";
import '../hojas-de-estilo/listaEstudiante.css';
import { carrerasOptions } from '../data/mapping';

// 1. Define how many items per page
const ITEMS_PER_PAGE = 50;

function ListaEstudiante({ alumnos, toggleEstado }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCareer, setSelectedCareer] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  // 2. Add state for the current page number
  const [currentPage, setCurrentPage] = useState(1);

  // --- Filtering Logic (as before) ---
  const filteredAlumnos = alumnos.filter(alumno => {
    const term = searchTerm.toLowerCase();
    const textMatch = !term ||
                      alumno.nombre.toLowerCase().includes(term) ||
                      alumno.numero_control.toLowerCase().includes(term);
    const statusMatch = !selectedStatus || alumno.estado === selectedStatus;
    const careerMatch = !selectedCareer || alumno.carrera === selectedCareer;
    const locationMatch = !selectedLocation || alumno.ubicacion === selectedLocation;
    return textMatch && statusMatch && careerMatch && locationMatch;
  });

  // --- Pagination Calculations ---
  // 3. Calculate total pages
  const totalPages = Math.ceil(filteredAlumnos.length / ITEMS_PER_PAGE);

  // 4. Calculate the start and end index for slicing
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  // 5. Slice the filtered data to get only the items for the current page
  const paginatedAlumnos = filteredAlumnos.slice(startIndex, endIndex);

  // --- Handlers for Pagination Buttons ---
  const handlePreviousPage = () => {
    // Go to previous page, but not below 1
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    // Go to next page, but not beyond totalPages
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  // --- Reset page to 1 when filters change ---
  useEffect(() => {
    setCurrentPage(1); // Reset to first page whenever filters change
  }, [searchTerm, selectedStatus, selectedCareer, selectedLocation]);

  // Helper function for location filter buttons (as before)
  const handleLocationFilter = (location) => {
    setSelectedLocation(location);
  };

  return (
    <div className="lista-container">
      {/* --- Header and Filters (as before) --- */}
      <div className="lista-header">
        <div className="header-actions">
          <input
            type="text"
            placeholder="🔍 Buscar por Nombre, N° de Control..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link to="/crear-alumno">
            <button className='createbutton'>Nuevo Alumno</button>
          </Link>
        </div>
        <div className="filter-section">
          {/* Location Buttons */}
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
             </div>
          </div>
          {/* Other Select Filters */}
          <div className="filter-container">
             <div className="filter-group">
                <label htmlFor="status-filter">Estado:</label>
                <select id="status-filter" className="filter-select" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                    <option value="">Todos</option>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                </select>
             </div>
             <div className="filter-group">
                <label htmlFor="career-filter">Carrera:</label>
                <select id="career-filter" className="filter-select" value={selectedCareer} onChange={(e) => setSelectedCareer(e.target.value)}>
                    <option value="">Todas</option>
                    {carrerasOptions.map(option => ( <option key={option.value} value={option.value}> {option.label} ({option.value}) </option> ))}
                    <option value="">No Aplica</option>
                    <option value="Primaria">Primaria</option>
                    <option value="Secundaria">Secundaria</option>
                    <option value="No Aplica">No Aplica (Externo)</option>
                </select>
             </div>
          </div>
        </div>
      </div>

      <table className="alumnos-table">
        {/* --- Table Head (thead - as before) --- */}
        <thead>
          <tr>
            <th>Número de Control</th>
            <th>Nombre Completo</th>
            <th>Carrera</th>
            <th>Ubicación</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* 6. Map over the PAGINATED data */}
          {paginatedAlumnos.length > 0 ? (
            paginatedAlumnos.map((alumno) => (
              <tr key={alumno.numero_control}>
                {/* ... (table cells - td - as before) ... */}
                <td>{alumno.numero_control}</td>
                <td>{alumno.nombre}</td>
                <td>{alumno.carrera === '' ? 'No Aplica' : alumno.carrera}</td>
                <td>{alumno.ubicacion}</td>
                <td>
                  <button
                    className={`estado-button ${alumno.estado === 'Activo' ? 'activo' : 'inactivo'}`}
                    onClick={() => toggleEstado(alumno.numero_control, 'alumno')}
                  >
                    {alumno.estado}
                  </button>
                </td>
                <td className="acciones-cell">
                   <Link to={`/ver-alumno/${alumno.numero_control}`} title="Ver Detalles"> <button className='view-button icon-button'>👁️</button> </Link>
                   <Link to={`/modificar-alumno/${alumno.numero_control}`} title="Modificar"> <button className='modifybutton icon-button'>✏️</button> </Link>
                   <Link to={`/eliminar-alumno/${alumno.numero_control}`} title="Eliminar"> <button className='deletebutton icon-button'>🗑️</button> </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-results-cell">
                No se encontraron alumnos que coincidan con los filtros aplicados.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* --- 7. Pagination Controls --- */}
      <div className="pagination-controls">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1} // Disable if on the first page
          className="pagination-button"
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages} ({filteredAlumnos.length} resultados)
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages || totalPages === 0} // Disable if on the last page or no results
          className="pagination-button"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default ListaEstudiante;