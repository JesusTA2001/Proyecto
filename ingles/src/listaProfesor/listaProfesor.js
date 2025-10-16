import React from "react";
import { Link } from "react-router-dom";
import '../hojas-de-estilo/listaEstudiante.css'; // Reutilizamos los mismos estilos

function ListaProfesor({ profesores }) {
  return (
    <div className="lista-container">
      <div className="lista-header">
        <div className="header-actions">
          <input type="text" placeholder="🔍 Buscar por nombre, número de empleado, etc." className="search-input" />
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
            <th>Correo Electrónico</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* 2. Mapeamos sobre los 'profesores' que vienen de App.js */}
          {profesores.map((profesor) => (
            <tr key={profesor.numero_empleado}>
              <td>{profesor.numero_empleado}</td>
              <td>{profesor.nombre}</td>
              <td>{profesor.correo}</td>
              <td>{profesor.telefono}</td>
              <td className="acciones-cell">
                {/* 3. Los enlaces ahora son dinámicos y llevan el ID */}
                <Link to={`/modificar-profesor/${profesor.numero_empleado}`}>
                  <button className='modifybutton icon-button'>✏️</button>
                </Link>
                <Link to={`/eliminar-profesor/${profesor.numero_empleado}`}>
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

export default ListaProfesor;