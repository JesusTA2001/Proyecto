import React from "react";
import { Link } from "react-router-dom";
import '../hojas-de-estilo/listaEstudiante.css';

function ListaEstudiante({ alumnos }) { // Recibimos 'alumnos' como prop
  return (
    <div className="lista-container">
      <div className="lista-header">
        <div className="header-actions">
          <input type="text" placeholder="🔍 Buscar por nombre, matrícula, etc" className="search-input" />
          <Link to="/crear-alumno">
            <button className='createbutton'>Nuevo Alumno</button>
          </Link>
        </div>
      </div>

      <table className="alumnos-table">
        <thead>
          <tr>
            <th>Número de Control</th>
            <th>Nombre Completo</th>
            <th>Correo Electrónico</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map((alumno) => (
            <tr key={alumno.numero_control}>
              <td>{alumno.numero_control}</td>
              <td>{alumno.nombre}</td>
              <td>{alumno.correo}</td>
              <td>{alumno.telefono}</td>
              <td className="acciones-cell">
                {/* El enlace ahora incluye el ID del alumno */}
                <Link to={`/modificar-alumno/${alumno.numero_control}`}>
                  <button className='modifybutton icon-button'>✏️</button>
                </Link>
                <Link to={`/eliminar-alumno/${alumno.numero_control}`}>
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

export default ListaEstudiante;