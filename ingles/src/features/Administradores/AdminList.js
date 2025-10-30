import React, { useState } from "react";
import { Link } from "react-router-dom";
import '../../styles/listaEstudiante.css';
import CrearAdministradorModal from './CrearAdministradorModal';
import VerAdministradorModal from './VerAdministradorModal';
import ModificarAdministradorModal from './ModificarAdministradorModal';
import EliminarAdministradorModal from './EliminarAdministradorModal';

function ListaAdministrador({ administradores, toggleEstado, agregarAdministrador, actualizarAdministrador, eliminarAdministrador }) {
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

  const [openCreate, setOpenCreate] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [selectedAdmin, setSelectedAdmin] = React.useState(null);

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
          <button className='createbutton' onClick={() => setOpenCreate(true)}>Nuevo Administrador</button>
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
                  <button className='view-button icon-button' title="Ver Detalles" onClick={() => { setSelectedAdmin(admin); setOpenView(true); }}>👁️</button>
                  <button className='modifybutton icon-button' title="Modificar" onClick={() => { setSelectedAdmin(admin); setOpenEdit(true); }}>✏️</button>
                  <button className='deletebutton icon-button' title="Eliminar" onClick={() => { setSelectedAdmin(admin); setOpenDelete(true); }}>🗑️</button>
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
  {/* Modales para Administradores */}
  <CrearAdministradorModal open={openCreate} onClose={() => setOpenCreate(false)} agregarAdministrador={agregarAdministrador} />
  <VerAdministradorModal open={openView} onClose={() => setOpenView(false)} admin={selectedAdmin} />
  <ModificarAdministradorModal open={openEdit} onClose={() => setOpenEdit(false)} admin={selectedAdmin} actualizarAdministrador={actualizarAdministrador} />
  <EliminarAdministradorModal open={openDelete} onClose={() => setOpenDelete(false)} admin={selectedAdmin} eliminarAdministrador={eliminarAdministrador} />
    </div>
  );
}

export default ListaAdministrador;