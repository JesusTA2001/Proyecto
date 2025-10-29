import React, { useState } from "react";
import { Link } from "react-router-dom";
import '../../styles/listaEstudiante.css';

function ListaModalidad({ modalidades }) {
  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar modalidades basado en el término de búsqueda
  const filteredModalidades = modalidades.filter(modalidad => {
    const term = searchTerm.toLowerCase();
    if (!term) return true;

    return (
      modalidad.id.toLowerCase().includes(term) ||
      modalidad.nombre.toLowerCase().includes(term) ||
      modalidad.descripcion.toLowerCase().includes(term)
    );
  });

  return (
    <div className="lista-container">
      <div className="lista-header">
        <div className="header-actions">
          <input 
            type="text" 
            placeholder="🔍 Buscar por ID, Nombre o Descripción..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link to="/crear-modalidad">
            <button className='createbutton'>Nueva Modalidad</button>
          </Link>
        </div>
      </div>
      <table className="alumnos-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre de la Modalidad</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* Lógica para mostrar resultados o el mensaje de "no encontrado" */}
          {filteredModalidades.length > 0 ? (
            filteredModalidades.map((modalidad) => (
              <tr key={modalidad.id}>
                <td>{modalidad.id}</td>
                <td>{modalidad.nombre}</td>
                <td>{modalidad.descripcion}</td>
                <td className="acciones-cell">
                  <Link to={`/modificar-modalidad/${modalidad.id}`} title="Modificar">
                    <button className='modifybutton icon-button'>✏️</button>
                  </Link>
                  <Link to={`/eliminar-modalidad/${modalidad.id}`} title="Eliminar">
                    <button className='deletebutton icon-button'>🗑️</button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-results-cell">
                No se encontraron modalidades que coincidan con la búsqueda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ListaModalidad;