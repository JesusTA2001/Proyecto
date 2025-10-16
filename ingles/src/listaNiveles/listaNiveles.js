import React from "react";
import { Link } from "react-router-dom";
import '../hojas-de-estilo/listaEstudiante.css'; // Reutilizamos los mismos estilos

//AHORA RECIBIMOS 'niveles' como una prop desde App.js
function ListaNiveles({ niveles }) {
  return (
    <div className="lista-container">
      <div className="lista-header">
        <div className="header-actions">
          <input type="text" placeholder="🔍 Buscar por nombre de nivel..." className="search-input" />
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
          {/* 3. Ahora este .map() usa la lista actualizada que viene de las props */}
          {niveles.map((nivel) => (
            <tr key={nivel.id}>
              <td>{nivel.id}</td>
              <td>{nivel.nombre}</td>
              <td>{nivel.disponibilidad}</td>
              <td className="acciones-cell">
                  <Link to={`/modificar-nivel/${nivel.id}`}>
                      <button className='modifybutton icon-button'>✏️</button>
                  </Link>
                  <Link to={`/eliminar-nivel/${nivel.id}`}>
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

export default ListaNiveles;