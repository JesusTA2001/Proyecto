import React from "react";
import '../imagenes/TecZamora.png';
import '../hojas-de-estilo/listaEstudiante.css';
import { Link } from "react-router-dom";
function ListaAdministrador() {
  return (
    <>
      <div className="campos-estudiante">
        <p>Número de Empleado</p>
        <p>Nombre</p>
        <p>Apellido Paterno</p>
        <p>Apellido Materno</p>
        <p>Correo Electrónico</p>
        <p>Número de Teléfono</p>
        <p>CURP</p>
        <p>Teléfono</p>
        <p>Dirección</p>
      </div>
      <div className="button-list">
        <Link to="/crear-administrador">
          <button className='createbutton'>Crear Administrador</button>
        </Link>
        <Link to="/modificar-administrador">
          <button className='modifybutton'>Modificar Administrador</button>
        </Link>
        <Link to="/eliminar-administrador">
          <button className='deletebutton'>Eliminar Administrador</button>
        </Link>
      </div>
  </>
  );
}

export default ListaAdministrador;