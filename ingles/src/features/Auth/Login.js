import React, { useState } from 'react';
import '../../styles/Login.css';

// Usuarios de prueba actualizados con 'numero_empleado'
const usuariosPrueba = {
  administrador: [
    { usuario: 'admin1', contrasena: 'admin123', numero_empleado: 'ADM01' },
    { usuario: 'admin2', contrasena: 'admin123', numero_empleado: 'ADM02' },
    { usuario: 'admin3', contrasena: 'admin123', numero_empleado: 'ADM03' } // Asumiendo que ADM03 existe
  ],
  profesor: [
    // Vinculados a los IDs de data/profesores.js
    { usuario: 'prof1', contrasena: 'prof123', numero_empleado: 'EMP001' }, // Juan Carlos Pérez
    { usuario: 'prof2', contrasena: 'prof123', numero_empleado: 'EMP002' }, // María Rodriguez Lima
    { usuario: 'prof3', contrasena: 'prof123', numero_empleado: 'EMP003' }  // Ana Lopez Pérez
  ]
};

function Login() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Buscar en administradores
    const adminMatch = usuariosPrueba.administrador.find(u => u.usuario === usuario && u.contrasena === contrasena);
    if (adminMatch) {
      // MODIFICADO: Guardar sesión con rol, usuario y numero_empleado
      localStorage.setItem('currentUser', JSON.stringify({ 
        role: 'administrador', 
        usuario: adminMatch.usuario,
        numero_empleado: adminMatch.numero_empleado // <--- AÑADIDO
      }));
      // Recargar para garantizar que App.js lea el user y muestre el layout correcto
      window.location.href = '/';
      return;
    }

    const profMatch = usuariosPrueba.profesor.find(u => u.usuario === usuario && u.contrasena === contrasena);
    if (profMatch) {
      // MODIFICADO: Guardar sesión con rol, usuario y numero_empleado
      localStorage.setItem('currentUser', JSON.stringify({ 
        role: 'profesor', 
        usuario: profMatch.usuario,
        numero_empleado: profMatch.numero_empleado // <--- AÑADIDO
      }));
      window.location.href = '/dashboard-profesor';
      return;
    }

    setError('Credenciales inválidas. Usa uno de los perfiles sugeridos o verifica tus datos.');
  };

  const rellenar = (u, role) => {
    setUsuario(u.usuario);
    setContrasena(u.contrasena);
    setError('');
  };

  return (
    <div className='inicio-sesion' style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      <div style={{ flex: 1 }}>
        <h1 className='titulo'>Plataforma De Ingles Tecnologico De Zamora</h1>
        <img className='logo' src={process.env.PUBLIC_URL + '/images/TecZamora.png'} alt='Logo Tec Zamora'/>
        <div className='formulario-inicio-sesion'>
          <form className='datos-usuario' onSubmit={handleSubmit}>
            <label htmlFor="usuario">Usuario</label>
            <input className='usuario' type="text" id="usuario" name="usuario" placeholder="Ingresa tu usuario" value={usuario} onChange={e => setUsuario(e.target.value)} />
            <label htmlFor="contrasena">Contraseña</label>
            <input className='password' type="password" id="contrasena" name="contrasena" placeholder="Ingresa tu contraseña" value={contrasena} onChange={e => setContrasena(e.target.value)} />
            {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
            <button className='login-button' type="submit" style={{ marginTop: 12 }}>Iniciar Sesión</button>
          </form>
        </div>
      </div>

      {/* Panel lateral con perfiles sugeridos */}
      <aside style={{ width: 300, background: '#fff', borderRadius: 8, padding: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
        <h3 style={{ marginTop: 0 }}>Perfiles de prueba</h3>
        <p style={{ fontSize: 13, color: '#555' }}>Haz clic en cualquiera para autocompletar el formulario.</p>

        <div style={{ marginTop: 8 }}>
          <strong>Administradores</strong>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: 8 }}>
            {usuariosPrueba.administrador.map((u) => (
              <li key={u.usuario} style={{ marginBottom: 8 }}>
                <button type="button" onClick={() => rellenar(u, 'administrador')} style={{ width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 6, border: '1px solid #eee', background: '#fafafa' }}>
                  <div style={{ fontWeight: 600 }}>{u.usuario}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>{u.contrasena}</div>
                </button>
              </li>
            ))}
          </ul>

          <strong>Profesores</strong>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: 8 }}>
            {usuariosPrueba.profesor.map((u) => (
              <li key={u.usuario} style={{ marginBottom: 8 }}>
                <button type="button" onClick={() => rellenar(u, 'profesor')} style={{ width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 6, border: '1px solid #eee', background: '#fafafa' }}>
                  <div style={{ fontWeight: 600 }}>{u.usuario}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>{u.contrasena}</div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default Login;