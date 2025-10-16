import React from "react";
import { Link } from "react-router-dom";
import '../hojas-de-estilo/listaEstudiante.css'; 

function ListaAdministrador({ administradores }) {
  return (
    <div className="lista-container">
      <div className="lista-header">
        <div className="header-actions">
          <input type="text" placeholder="🔍 Buscar por nombre, número de empleado, etc." className="search-input" />
          <Link to="/crear-administrador">
            <button className='createbutton'>Nuevo Administrador</button>
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
          {/* 2. Mapeamos sobre los 'administradores' que vienen de App.js */}
          {administradores.map((admin) => (
            <tr key={admin.numero_empleado}>
              <td>{admin.numero_empleado}</td>
              <td>{admin.nombre}</td>
              <td>{admin.correo}</td>
              <td>{admin.telefono}</td>
              <td className="acciones-cell">
                {/* 3. Los enlaces ahora son dinámicos y llevan el ID */}
                <Link to={`/modificar-administrador/${admin.numero_empleado}`}>
                  <button className='modifybutton icon-button'>✏️</button>
                </Link>
                <Link to={`/eliminar-administrador/${admin.numero_empleado}`}>
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

export default ListaAdministrador;