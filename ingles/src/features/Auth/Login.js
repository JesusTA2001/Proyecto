import React, { useState } from 'react';
import '../../styles/Login.css';
import api from '../../api/axios';

// Usuarios de prueba actualizados con 'numero_empleado' - TEMPORALES PARA TESTING
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
  ,
  alumno: [
    { usuario: 'alumno1', contrasena: 'alum123', numero_control: '210001' },
    { usuario: 'alumno2', contrasena: 'alum123', numero_control: '210002' },
    { usuario: 'alumno3', contrasena: 'alum123', numero_control: '210003' }
  ],
  coordinador: [
    { usuario: 'coord1', contrasena: 'coord123', numero_empleado: 'COORD01' },
    { usuario: 'coord2', contrasena: 'coord123', numero_empleado: 'COORD02' },
    { usuario: 'coord3', contrasena: 'coord123', numero_empleado: 'COORD03' },
    { usuario: 'coord4', contrasena: 'coord123', numero_empleado: 'COORD04' },
    { usuario: 'coord5', contrasena: 'coord123', numero_empleado: 'COORD05' },
    { usuario: 'coord6', contrasena: 'coord123', numero_empleado: 'COORD06' },
    { usuario: 'coord7', contrasena: 'coord123', numero_empleado: 'COORD07' },
    { usuario: 'coord8', contrasena: 'coord123', numero_empleado: 'COORD08' },
    { usuario: 'coord9', contrasena: 'coord123', numero_empleado: 'COORD09' }
  ],
  directivo: [
    { usuario: 'dir1', contrasena: 'dir123', numero_empleado: 'DIR01' },
    { usuario: 'dir2', contrasena: 'dir123', numero_empleado: 'DIR02' },
    { usuario: 'dir3', contrasena: 'dir123', numero_empleado: 'DIR03' }
  ]
};

function Login() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      // Intentar autenticar con la API
      const response = await api.post('/auth/login', {
        usuario,
        contraseña: contrasena
      });

      if (response.data.success) {
        // Guardar token y datos del usuario
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('currentUser', JSON.stringify({
          role: response.data.user.rol.toLowerCase(),
          usuario: response.data.user.usuario,
          numero_empleado: response.data.user.numero_empleado || response.data.user.id_Profesor || response.data.user.id_Administrador,
          numero_control: response.data.user.nControl,
          nombre: response.data.user.nombre,
          apellidoPaterno: response.data.user.apellidoPaterno,
          apellidoMaterno: response.data.user.apellidoMaterno,
          email: response.data.user.email,
          CURP: response.data.user.CURP,
          telefono: response.data.user.telefono,
          genero: response.data.user.genero,
          direccion: response.data.user.direccion,
          estado: response.data.user.estado,
          ubicacion: response.data.user.ubicacion
        }));

        // Redirigir según el rol
        const rol = response.data.user.rol.toLowerCase();
        switch (rol) {
          case 'administrador':
            window.location.href = '/';
            break;
          case 'profesor':
            window.location.href = '/dashboard-profesor';
            break;
          case 'estudiante':
            window.location.href = '/dashboard-alumnos';
            break;
          case 'coordinador':
            window.location.href = '/dashboard-coordinador';
            break;
          case 'directivo':
            window.location.href = '/dashboard-directivos';
            break;
          default:
            window.location.href = '/';
        }
        return;
      }
    } catch (error) {
      console.error('Error de autenticación:', error);
      
      // Si falla la API, intentar con usuarios de prueba
      setError('Usuario o contraseña incorrectos. Verifica tus credenciales.');
      
      // FALLBACK: Buscar en usuarios de prueba solo si la API falla
      const adminMatch = usuariosPrueba.administrador.find(u => u.usuario === usuario && u.contrasena === contrasena);
      if (adminMatch) {
        localStorage.setItem('currentUser', JSON.stringify({ 
          role: 'administrador', 
          usuario: adminMatch.usuario,
          numero_empleado: adminMatch.numero_empleado
        }));
        // Crear un token temporal para que funcione el sistema
        localStorage.setItem('token', 'temp_token_' + Date.now());
        window.location.href = '/';
        return;
      }

      const profMatch = usuariosPrueba.profesor.find(u => u.usuario === usuario && u.contrasena === contrasena);
      if (profMatch) {
        localStorage.setItem('currentUser', JSON.stringify({ 
          role: 'profesor', 
          usuario: profMatch.usuario,
          numero_empleado: profMatch.numero_empleado
        }));
        localStorage.setItem('token', 'temp_token_' + Date.now());
        window.location.href = '/dashboard-profesor';
        return;
      }

      const alumnoMatch = usuariosPrueba.alumno.find(u => u.usuario === usuario && u.contrasena === contrasena);
      if (alumnoMatch) {
        localStorage.setItem('currentUser', JSON.stringify({
          role: 'alumno',
          usuario: alumnoMatch.usuario,
          numero_control: alumnoMatch.numero_control
        }));
        localStorage.setItem('token', 'temp_token_' + Date.now());
        window.location.href = '/dashboard-alumnos';
        return;
      }

      const coordMatch = usuariosPrueba.coordinador.find(u => u.usuario === usuario && u.contrasena === contrasena);
      if (coordMatch) {
        localStorage.setItem('currentUser', JSON.stringify({
          role: 'coordinador',
          usuario: coordMatch.usuario,
          numero_empleado: coordMatch.numero_empleado
        }));
        localStorage.setItem('token', 'temp_token_' + Date.now());
        window.location.href = '/dashboard-coordinador';
        return;
      }

      const dirMatch = usuariosPrueba.directivo.find(u => u.usuario === usuario && u.contrasena === contrasena);
      if (dirMatch) {
        localStorage.setItem('currentUser', JSON.stringify({
          role: 'directivo',
          usuario: dirMatch.usuario,
          numero_empleado: dirMatch.numero_empleado
        }));
        localStorage.setItem('token', 'temp_token_' + Date.now());
        window.location.href = '/dashboard-directivos';
        return;
      }
    } finally {
      setCargando(false);
    }
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
            <button className='login-button' type="submit" style={{ marginTop: 12 }} disabled={cargando}>
              {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>

      {/* Panel lateral con perfiles sugeridos */}
      <aside style={{ width: 300, background: '#fff', borderRadius: 8, padding: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
        <h3 style={{ marginTop: 0 }}>Perfiles de prueba</h3>
        <p style={{ fontSize: 13, color: '#555' }}>Haz clic en cualquiera para autocompletar el formulario.</p>

        <div style={{ marginTop: 8 }}>
          <strong>Coordinadores</strong>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: 8 }}>
            {usuariosPrueba.coordinador.map((u) => (
              <li key={u.usuario} style={{ marginBottom: 8 }}>
                <button type="button" onClick={() => rellenar(u, 'coordinador')} style={{ width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 6, border: '1px solid #eee', background: '#fafafa' }}>
                  <div style={{ fontWeight: 600 }}>{u.usuario}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>{u.contrasena}</div>
                </button>
              </li>
            ))}
          </ul>

          <strong>Directivos</strong>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: 8 }}>
            {usuariosPrueba.directivo.map((u) => (
              <li key={u.usuario} style={{ marginBottom: 8 }}>
                <button type="button" onClick={() => rellenar(u, 'directivo')} style={{ width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 6, border: '1px solid #eee', background: '#fafafa' }}>
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