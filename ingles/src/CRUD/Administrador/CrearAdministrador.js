import React from "react";
import '../../imagenes/TecZamora.png';
import '../../hojas-de-estilo/listaEstudiante.css';

import { Link } from "react-router-dom";
function crearAdministrador() {
  return (
    <div className="perfil-usuario">
      <nav className="menu">
        <section className="menu__container">
          <img 
            src={require('../../imagenes/TecZamora.png')}
            alt="Logo" 
            className="menu__logo-image" 
          />
          <h1 className="menu__logo">Administrador</h1>

          <ul className="menu__links">
            {/* Inicio */}
            <li className="menu__item">
              <Link to="/" className="menu__link">Inicio</Link>
            </li>
            {/* Administrador */}
            <li className="menu__item menu__item--show">
              <span className="menu__link">Administrador</span>
              <ul className="menu__nesting">
                <li className="menu__inside">
                  <Link to="/lista-profesores" className="menu__link menu__link--inside">
                    Lista Administradores
                  </Link>
                </li>
              </ul>
            </li>
            {/* Profesor */}
            <li className="menu__item menu__item--show">
              <span className="menu__link">Profesor</span>
              <ul className="menu__nesting">
                <li className="menu__inside">
                  <Link to="/lista-profesores" className="menu__link menu__link--inside">
                    Lista Profesores
                  </Link>
                </li>
                <li className="menu__inside">
                  <a href="#" className="menu__link menu__link--inside">Grupos Profesores</a>
                </li>
                <li className="menu__inside">
                  <a href="#" className="menu__link menu__link--inside">Asignar Profesor</a>
                </li>
              </ul>
            </li>

            {/* Estudiantes */}
            <li className="menu__item menu__item--show">
              <span className="menu__link">Estudiantes</span>
              <ul className="menu__nesting">
                <li className="menu__inside">
                  <Link to="/lista-estudiantes" className="menu__link menu__link--inside">
                    Lista De Estudiantes
                  </Link>
                </li>
                <li className="menu__inside">
                  <a href="#" className="menu__link menu__link--inside">Grupos De Estudiantes</a>
                </li>
                <li className="menu__inside">
                  <a href="#" className="menu__link menu__link--inside">Inscripción Estudiante</a>
                </li>
                <li className="menu__inside">
                  <a href="#" className="menu__link menu__link--inside">Avance Por Nivel</a>
                </li>
              </ul>
            </li>

            {/* Reportes */}
            <li className="menu__item menu__item--show">
              <span className="menu__link">Reportes</span>
              <ul className="menu__nesting">
                <li className="menu__inside">
                  <a href="#" className="menu__link menu__link--inside">Reporte Profesores</a>
                </li>
                <li className="menu__inside">
                  <a href="#" className="menu__link menu__link--inside">Reporte Estudiantes</a>
                </li>
                <li className="menu__inside">
                  <a href="#" className="menu__link menu__link--inside">Reporte Grupos</a>
                </li>
              </ul>
            </li>
          </ul>
        </section>
        <div className="lista-estudiante">
            <h1>Crear Administrador</h1>
        </div>
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
            <button className='boton' type='submit'>Crear Administrador </button>
        </div>
        </div>
      </nav>
    </div>
  );
}

export default crearAdministrador;