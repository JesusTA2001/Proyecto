import React from "react";
import { Link, useNavigate } from "react-router-dom";
import '../../styles/perfil-usuario.css';

function LayoutAlumnos({ children }) {
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
          <h1 className="menu__logo">Estudiante</h1>

          <ul className="menu__links">
            <li className="menu__item">
              <Link to="/dashboard-profesor" className="menu__link">Inicio</Link>
            </li>

            <li className="menu__item menu__item--show">
              <span className="menu__link">Mis Clases</span>
              <ul className="menu__nesting">
                
                {/* --- ENLACE NUEVO AÑADIDO AQUÍ --- */}
                <li className="menu__inside">
                  <Link to="/profesor/mis-grupos" className="menu__link menu__link--inside">
                    Mis Grupos
                  </Link>
                </li>

                <li className="menu__inside">
                  <Link to="/profesor/asistencia" className="menu__link menu__link--inside">
                    Asistencia
                  </Link>
                </li>
                
                <li className="menu__inside">
                  <Link to="/profesor/calificaciones" className="menu__link menu__link--inside">
                    Asignar Calificaciones
                  </Link>
                </li>
                
                {/* Portal de Alumnos eliminado del menú */}
                
              </ul>
            </li>

            {/* Cuenta / Cerrar sesión */}
            <li className="menu__item menu__item--show">
              <span className="menu__link" style={{ cursor: 'default' }}>
                Cuenta{getCurrentUserName() ? ` — ${getCurrentUserName()}` : ''}
              </span>
              <ul className="menu__nesting">
                <li className="menu__inside">
                  <button type="button" className="menu__link menu__link--inside" onClick={handleLogout}>
                    Cerrar Sesión
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </section>
      </nav>

      {/* header title removed to simplify layout — pages provide headings when needed */}
      <main>{children}</main>
    </div>
  );
}

export default LayoutAlumnos;