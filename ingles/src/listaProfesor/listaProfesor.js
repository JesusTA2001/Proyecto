import React from "react";
import '../imagenes/TecZamora.png';
import '../hojas-de-estilo/listaProfesor.css';
import { Link } from "react-router-dom";
function ListaProfesor() {
  return (
    <>
      <div className="campos-profesor">
        <p>Número de Control</p>
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
        <Link to="/crear-profesor">
        <button className='createbutton'>Crear Profesor</button>
        </Link>
        <Link to="/modificar-profesor">
        <button className='modifybutton'>Modificar Profesor</button>
        </Link>
        <Link to="/eliminar-profesor">
        <button className='deletebutton'>Eliminar Profesor</button>
        </Link>
      </div>
  </>
);
}

export default ListaProfesor;