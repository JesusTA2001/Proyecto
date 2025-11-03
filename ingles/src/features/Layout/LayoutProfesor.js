import React from "react";
import { Link, useNavigate } from "react-router-dom";
import '../../styles/perfil-usuario.css';

function LayoutProfesor({ children, titulo }) {
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
          <h1 className="menu__logo">Profesor</h1>

          <ul className="menu__links">
            <li className="menu__item">
              <Link to="/profesor/inicio" className="menu__link">Inicio</Link>
            </li>

            <li className="menu__item menu__item--show">
              <span className="menu__link">Mis Clases</span>
              <ul className="menu__nesting">
                <li className="menu__inside">
                  <Link to="/profesor/grupos" className="menu__link menu__link--inside">
                    Grupos Asignados
                  </Link>
                </li>
                <li className="menu__inside">
                  <Link to="/profesor/horarios" className="menu__link menu__link--inside">
                    Horarios
                  </Link>
                </li>
                    <li className="menu__inside">
                      <Link to="/profesor/calificaciones" className="menu__link menu__link--inside">
                        Calificaciones
                      </Link>
                    </li>
              </ul>
            </li>

            <li className="menu__item menu__item--show">
              <span className="menu__link">Reportes</span>
              <ul className="menu__nesting">
                <li className="menu__inside">
                  <Link to="/profesor/reporte-asistencia" className="menu__link menu__link--inside">
                    Asistencias
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

      <div className="lista-estudiante">
        <h1>{titulo}</h1>
      </div>
      <main>{children}</main>
    </div>
  );
}

export default LayoutProfesor;
