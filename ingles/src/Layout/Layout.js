import React from "react";
import { Link } from "react-router-dom";
import '../hojas-de-estilo/perfil-usuario.css';
import '../imagenes/TecZamora.png';

function Layout({children, titulo}) {
  return (
    <div className="perfil-usuario">
      <nav className="menu">
        <section className="menu__container">
          <img 
            src={require('../imagenes/TecZamora.png')} 
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
                  <Link to="/lista-administradores" className="menu__link menu__link--inside">
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
                    Lista De Profesores
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
                  <Link to="/lista-niveles" className="menu__link menu__link--inside">
                    Niveles
                  </Link>
                </li>
                <li className="menu__inside">
                  <Link to="/lista-modalidad" className="menu__link menu__link--inside">
                  Modalidad
                  </Link>
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
      </nav>
      <div className="lista-estudiante">
        <h1>{titulo}</h1>
      </div>
        <main>
            {children}
        </main>
    </div>
  );
}

export default Layout;
