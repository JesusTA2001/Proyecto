import React from "react";
import { Link } from "react-router-dom";
import '../hojas-de-estilo/listaEstudiante.css';

function ListaModalidad({ modalidades }) {
  return (
    <div className="lista-container">
      <div className="lista-header">
        <div className="header-actions">
          <input type="text" placeholder="🔍 Buscar por modalidad..." className="search-input" />
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
          {modalidades.map((modalidad) => (
            <tr key={modalidad.id}>
              <td>{modalidad.id}</td>
              <td>{modalidad.nombre}</td>
              <td>{modalidad.descripcion}</td>
              <td className="acciones-cell">
                  <Link to={`/modificar-modalidad/${modalidad.id}`}>
                      <button className='modifybutton icon-button'>✏️</button>
                  </Link>
                  <Link to={`/eliminar-modalidad/${modalidad.id}`}>
                      <button className='deletebutton icon-button'>🗑️</button>
                  </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListaModalidad;