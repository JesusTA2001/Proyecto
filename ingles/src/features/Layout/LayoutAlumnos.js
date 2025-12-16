import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../../styles/perfil-usuario.css';

function LayoutAlumnos({ children }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
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

          {/* Hamburger Menu Icon */}
          <div 
            className={`menu__hamburger ${menuOpen ? 'active' : ''}`} 
            onClick={toggleMenu}
            role="button"
            aria-label="Toggle menu"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && toggleMenu()}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          <ul className={`menu__links ${menuOpen ? 'active' : ''}`}>
            <li className="menu__item">
              <Link to="/dashboard-alumnos" className="menu__link" onClick={closeMenu}>Inicio</Link>
            </li>

            <li className="menu__item">
              <Link to="/alumno/calificaciones" className="menu__link" onClick={closeMenu}>Calificaciones</Link>
            </li>

            {/* Cuenta / Cerrar sesión */}
            <li className="menu__item menu__item--show">
              <span className="menu__link" style={{ cursor: 'default' }}>
                Cuenta{getCurrentUserName() ? ` — ${getCurrentUserName()}` : ''}
              </span>
              <ul className="menu__nesting">
                <li className="menu__inside">
                  <a href="#" className="menu__link menu__link--inside" onClick={(e) => { e.preventDefault(); handleLogout(); closeMenu(); }}>
                    Cerrar Sesión
                  </a>
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