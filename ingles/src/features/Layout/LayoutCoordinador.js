import React from "react";
import { Link, useNavigate } from "react-router-dom";
import '../../styles/perfil-usuario.css';

function LayoutCoordinador({ children }) {
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

  const getCurrentUser = () => {
    try {
      const raw = localStorage.getItem('currentUser');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  };

  const currentUser = getCurrentUser();
  const coordToCareer = {
    COORD01: { code: 'ISC',  label: 'Ingeniería en Sistemas Computacionales' },
    COORD02: { code: 'IE',   label: 'Ingeniería Electrónica' },
    COORD03: { code: 'II',   label: 'Ingeniería Industrial' },
    COORD04: { code: 'IIAS', label: 'Ingeniería Innovación Agrícola Sustentable' },
    COORD05: { code: 'IIA',  label: 'Ingeniería en Industrias Alimentarias' },
    COORD06: { code: 'IGE',  label: 'Ingeniería en Gestión Empresarial' },
    COORD07: { code: 'A',    label: 'Arquitectura' },
    COORD08: { code: 'CP',   label: 'Contador Público' },
    COORD09: { code: 'ITIC', label: 'Ingeniería en Tecnologías de la Información y Comunicación' }
  };
  const carreraAsignada = (currentUser && currentUser.role === 'coordinador' && currentUser.numero_empleado)
    ? (coordToCareer[currentUser.numero_empleado] || null)
    : null;

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
          <h1 className="menu__logo">Coordinador{carreraAsignada ? ` — ${carreraAsignada.label}` : ''}</h1>

          <ul className="menu__links">
            <li className="menu__item">
              <Link to="/dashboard-coordinador" className="menu__link">Inicio</Link>
            </li>

            <li className="menu__item menu__item--show">
              <span className="menu__link">Accesos</span>
              <ul className="menu__nesting">
                <li className="menu__inside">
                  <Link to="/lista-estudiantes" className="menu__link menu__link--inside">
                    Estudiantes
                  </Link>
                </li>
                <li className="menu__inside">
                  <Link to="/lista-grupos" className="menu__link menu__link--inside">
                    Grupos
                  </Link>
                </li>
                <li className="menu__inside">
                  <Link to="/lista-horarios" className="menu__link menu__link--inside">
                    Horarios
                  </Link>
                </li>
              </ul>
            </li>

            {/* Cuenta / Cerrar sesión */}
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

      {/* header title removed to simplify layout — pages provide headings when needed */}
      <main>{children}</main>
    </div>
  );
}

export default LayoutCoordinador;