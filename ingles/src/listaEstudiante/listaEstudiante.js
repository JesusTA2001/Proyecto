import React from "react";
import '../imagenes/TecZamora.png';
import '../hojas-de-estilo/listaEstudiante.css';
import { Link } from "react-router-dom";
function ListaEstudiante() {
  return (
    <>
    <div className="campos-estudiante">
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
          <Link to="/crear-alumno">
          <button className='createbutton'>Crear Alumno</button>
          </Link>
          <Link to="/modificar-alumno">
          <button className='modifybutton'>Modificar Alumno</button>
          </Link>
          <Link to="/eliminar-alumno">
          <button className='deletebutton'>Eliminar Alumno</button>
          </Link>
        </div>
    </>
  );
}

export default ListaEstudiante;