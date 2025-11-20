import React from "react";
import { Link, useNavigate } from "react-router-dom";
import '../../styles/perfil-usuario.css';


function Layout({children}) {
  const navigate = useNavigate();

  const getCurrentUserName = () => {
    try {
      const raw = localStorage.getItem('currentUser');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed?.usuario || null;
    } catch (e) {
      return null;
    }
  };

  const handleLogout = () => {
    try { localStorage.removeItem('currentUser'); } catch (e) {}
    navigate('/login');
  };
  return (
    <div className="perfil-usuario">
      <nav className="menu">
        <section className="menu__container">
          <img 
            src={process.env.PUBLIC_URL + '/images/TecZamora.png'} 
            alt="Logo" 
            className="menu__logo-image" 
          />
          <h1 className="menu__logo">Administrador</h1>

          <ul className="menu__links">
            {/* ... (otros enlaces del menú: Inicio, Administrador, Profesor) ... */}
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
                  <Link to="/lista-horarios" className="menu__link menu__link--inside">
                  Horarios
                  </Link>
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
                  {/* --- MODIFICADO --- */}
                  <Link to="/lista-grupos" className="menu__link menu__link--inside">
                    Grupos De Estudiantes
                  </Link>
                  {/* --- FIN MODIFICADO --- */}
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

            {/* Reportes*/}
            <li className="menu__item menu__item--show">
              <span className="menu__link">Reportes</span>
              <ul className="menu__nesting">
                <li className="menu__inside">
                  {/* Cambiado de 'a' a 'Link' y 'href' a 'to' */}
                  <Link to="/reporte-profesores" className="menu__link menu__link--inside">
                    Reporte Profesores
                  </Link>
                </li>
                <li className="menu__inside">
                  {/* Cambiado de 'a' a 'Link' y 'href' a 'to' */}
                  <Link to="/reporte-estudiantes" className="menu__link menu__link--inside">
                    Reporte Estudiantes
                  </Link>
                </li>
                <li className="menu__inside">
                  {/* Cambiado de 'a' a 'Link' y 'href' a 'to' */}
                  <Link to="/reporte-grupos" className="menu__link menu__link--inside">
                    Reporte Grupos
                  </Link>
                </li>
              </ul>
            </li>

            {/* Cuenta / Cerrar sesión (al lado de Reportes) */}
            <li className="menu__item menu__item--show">
              <span className="menu__link" style={{ cursor: 'default' }}>
                Cuenta{getCurrentUserName() ? ` — ${getCurrentUserName()}` : ''}
              </span>
              <ul className="menu__nesting">
                <li className="menu__inside">
                  <a href="#" className="menu__link menu__link--inside" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                    Cerrar Sesión
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </section>
      </nav>
      {/* header title removed to let pages control their own headings */}
        <main>
            {children}
        </main>
    </div>
  );
}

export default Layout;