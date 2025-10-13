import React from "react";
import '../../imagenes/TecZamora.png';
import '../../hojas-de-estilo/listaEstudiante.css';

import { Link } from "react-router-dom";
function modificarAdministrador() {
  return (
    <div>
      <input className='usuario' type="number" id="usuario" name="usuario" placeholder="Numero de Control"></input>
      <input className='usuario' type="text" id="usuario" name="usuario" placeholder="Nombre"></input>
      <input className='usuario' type="text" id="usuario" name="usuario" placeholder="Apellido Paterno"></input>
      <input className='usuario' type="text" id="usuario" name="usuario" placeholder="Apellido Materno"></input>
      <input className='usuario' type="email" id="usuario" name="usuario" placeholder="Correo Electronico"></input>
      <select id="genero" name="genero" className="usuario">
        <option value="">Seleccione una opción</option>
        <option value="Masculino">Masculino</option>
        <option value="Femenino">Femenino</option>
      </select>
      <input className='usuario' type="text" id="usuario" name="usuario" placeholder="Numero de Telefono"></input>
      <input className='usuario' type="text" id="usuario" name="usuario" placeholder="CURP"></input>
      <input className='usuario' type="text" id="usuario" name="usuario" placeholder="Telefono"></input>
      <input className='usuario' type="text" id="usuario" name="usuario" placeholder="Dirección"></input>
    <div className="create-button">
        <button className='boton' type='submit'>Modificar Administrador </button>
    </div>
    </div>
  );
}

export default modificarAdministrador;