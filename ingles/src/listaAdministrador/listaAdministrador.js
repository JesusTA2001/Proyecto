import React from "react";
import { Link } from "react-router-dom";
import '../hojas-de-estilo/listaEstudiante.css'; // Reutilizamos los mismos estilos

// Arreglo de 10 administradores con datos de ejemplo
const administradores = [
  { numero_empleado: "ADM01", nombre: "Laura Sánchez Peña", correo: "laura.sanchez@teczamora.mx", telefono: "3515550101", curp: "SAPL850220MGRMNA01", direccion: "Oficina Principal, Edificio A" },
  { numero_empleado: "ADM02", nombre: "Roberto Morales Gil", correo: "roberto.morales@teczamora.mx", telefono: "3515550102", curp: "MOGR801110HGRMNA02", direccion: "Recursos Humanos, Edificio B" },
  { numero_empleado: "ADM03", nombre: "Patricia Herrera Soto", correo: "patricia.herrera@teczamora.mx", telefono: "3515550103", curp: "HESP900505MGRMNA03", direccion: "Servicios Escolares, Edificio C" },
  { numero_empleado: "ADM04", nombre: "Fernando Díaz López", correo: "fernando.diaz@teczamora.mx", telefono: "3515550104", curp: "DILF780915HGRMNA04", direccion: "Finanzas, Edificio A" },
  { numero_empleado: "ADM05", nombre: "Mónica Navarro Cruz", correo: "monica.navarro@teczamora.mx", telefono: "3515550105", curp: "NACM920312MGRMNA05", direccion: "Coordinación Académica, Edificio D" },
  { numero_empleado: "ADM06", nombre: "Jorge Castillo Romero", correo: "jorge.castillo@teczamora.mx", telefono: "3515550106", curp: "CARJ870621HGRMNA06", direccion: "Sistemas y Soporte, Edificio E" },
  { numero_empleado: "ADM07", nombre: "Sofía Jiménez Vega", correo: "sofia.jimenez@teczamora.mx", telefono: "3515550107", curp: "JIVS951002MGRMNA07", direccion: "Vinculación, Edificio B" },
  { numero_empleado: "ADM08", nombre: "Carlos Alberto Ríos", correo: "carlos.rios@teczamora.mx", telefono: "3515550108", curp: "RIAC830428HGRMNA08", direccion: "Dirección General, Edificio A" },
  { numero_empleado: "ADM09", nombre: "Elena Flores Mendoza", correo: "elena.flores@teczamora.mx", telefono: "3515550109", curp: "FOME940119MGRMNA09", direccion: "Recepción, Edificio A" },
  { numero_empleado: "ADM10", nombre: "David Guerrero Salas", correo: "david.guerrero@teczamora.mx", telefono: "3515550110", curp: "GUSD890808HGRMNA10", direccion: "Mantenimiento, Edificio F" }
];

function ListaAdministrador() {
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

      <table className="alumnos-table"> {/* Reutilizamos la clase de la tabla */}
        <thead>
          <tr>
            <th>Número de Empleado</th>
            <th>Nombre Completo</th>
            <th>Correo Electrónico</th>
            <th>Teléfono</th>
            <th>CURP</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {administradores.map((admin, index) => (
            <tr key={index}>
              <td>{admin.numero_empleado}</td>
              <td>{admin.nombre}</td>
              <td>{admin.correo}</td>
              <td>{admin.telefono}</td>
              <td>{admin.curp}</td>
              <td>{admin.direccion}</td>
              <td className="acciones-cell">
                <Link to="/modificar-administrador">
                  <button className='modifybutton icon-button'>✏️</button>
                </Link>
                <Link to="/eliminar-administrador">
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