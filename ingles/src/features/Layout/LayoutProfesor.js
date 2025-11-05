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
              {/* MODIFICADO: Enlace a /dashboard-profesor en lugar de /profesor/inicio */}
              <Link to="/dashboard-profesor" className="menu__link">Inicio</Link>
            </li>

            <li className="menu__item menu__item--show">
              <span className="menu__link">Mis Clases</span>
              <ul className="menu__nesting">
                {/* Opcional: puedes agregar un enlace a /lista-grupos 
                  pero filtrado solo para este profesor si lo deseas.
                */}
                <li className="menu__inside">
                  <Link to="/profesor/calificaciones" className="menu__link menu__link--inside">
                    Asignar Calificaciones
                  </Link>
                </li>
                {/* --- AÑADIDO --- */}
                <li className="menu__inside">
                  <Link to="/profesor/portal-calificaciones" className="menu__link menu__link--inside">
                    Portal de Alumnos
                  </Link>
                </li>
                {/* --- FIN AÑADIDO --- */}
                {/* Opcional: puedes agregar un enlace a /lista-horarios
                  filtrado para este profesor si lo deseas.
                */}
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