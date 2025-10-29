import React, { useState } from "react";
import { Link } from "react-router-dom";
import '../../styles/listaEstudiante.css';

function ListaNiveles({ niveles }) {
  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar niveles basado en el término de búsqueda
  const filteredNiveles = niveles.filter(nivel => {
    const term = searchTerm.toLowerCase();
    if (!term) return true;

    return (
      nivel.id.toLowerCase().includes(term) ||
      nivel.nombre.toLowerCase().includes(term) ||
      nivel.disponibilidad.toLowerCase().includes(term)
    );
  });

  return (
    <div className="lista-container">
      <div className="lista-header">
        <div className="header-actions">
          <input 
            type="text" 
            placeholder="🔍 Buscar por ID, Nombre o Disponibilidad..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link to="/crear-nivel">
            <button className='createbutton'>Nuevo Nivel</button>
          </Link>
        </div>
      </div>

      <table className="alumnos-table">
        <thead>
          <tr>
            <th>ID Nivel</th>
            <th>Nombre Del Nivel</th>
            <th>Días y Horarios de Disponibilidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* Lógica para mostrar resultados o el mensaje de "no encontrado" */}
          {filteredNiveles.length > 0 ? (
            filteredNiveles.map((nivel) => (
              <tr key={nivel.id}>
                <td>{nivel.id}</td>
                <td>{nivel.nombre}</td>
                <td>{nivel.disponibilidad}</td>
                <td className="acciones-cell">
                  <Link to={`/modificar-nivel/${nivel.id}`} title="Modificar">
                    <button className='modifybutton icon-button'>✏️</button>
                  </Link>
                  <Link to={`/eliminar-nivel/${nivel.id}`} title="Eliminar">
                    <button className='deletebutton icon-button'>🗑️</button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-results-cell">
                No se encontraron niveles que coincidan con la búsqueda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ListaNiveles;