import React, { useState } from "react";
import { Link } from "react-router-dom";
import '../hojas-de-estilo/listaEstudiante.css';

function ListaAdministrador({ administradores, toggleEstado }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAdmins = administradores.filter(admin => {
    const term = searchTerm.toLowerCase();
    // Si no hay término de búsqueda, muestra todos
    if (!term) return true;

    return (
      admin.nombre.toLowerCase().includes(term) ||
      admin.numero_empleado.toLowerCase().includes(term) ||
      // Se usa startsWith para buscar por estado de forma precisa
      admin.estado.toLowerCase().startsWith(term)
    );
  });

  return (
    <div className="lista-container">
      <div className="lista-header">
        <div className="header-actions">
          <input 
            type="text" 
            placeholder="🔍 Buscar por Nombre, N° de Empleado o Estado..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* Lógica para mostrar resultados o el mensaje de "no encontrado" */}
          {filteredAdmins.length > 0 ? (
            filteredAdmins.map((admin) => (
              <tr key={admin.numero_empleado}>
                <td>{admin.numero_empleado}</td>
                <td>{admin.nombre}</td>
                <td>
                  <button 
                    className={`estado-button ${admin.estado === 'Activo' ? 'activo' : 'inactivo'}`}
                    onClick={() => toggleEstado(admin.numero_empleado, 'administrador')}
                  >
                    {admin.estado}
                  </button>
                </td>
                <td className="acciones-cell">
                  <Link to={`/ver-administrador/${admin.numero_empleado}`} title="Ver Detalles">
                    <button className='view-button icon-button'>👁️</button>
                  </Link>
                  <Link to={`/modificar-administrador/${admin.numero_empleado}`} title="Modificar">
                    <button className='modifybutton icon-button'>✏️</button>
                  </Link>
                  <Link to={`/eliminar-administrador/${admin.numero_empleado}`} title="Eliminar">
                    <button className='deletebutton icon-button'>🗑️</button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-results-cell">
                No existe Administrador con ese Número de Empleado o Nombre, corrobora que tu información sea correcta.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ListaAdministrador;