import React, { useState } from 'react';
import '../../styles/Login.css';
import api from '../../api/axios';

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
      setError('Usuario o contraseña incorrectos. Verifica tus credenciales.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className='inicio-sesion'>
      <div className='login-container'>
        <h1 className='titulo'>Plataforma De Ingles Tecnologico De Zamora</h1>
        <img className='logo' src={process.env.PUBLIC_URL + '/images/TecZamora.png'} alt='Logo Tec Zamora'/>
        <div className='formulario-inicio-sesion'>
          <form className='datos-usuario' onSubmit={handleSubmit}>
            <label htmlFor="usuario">Usuario</label>
            <input className='usuario' type="text" id="usuario" name="usuario" placeholder="Ingresa tu usuario" value={usuario} onChange={e => setUsuario(e.target.value)} />
            <label htmlFor="contrasena">Contraseña</label>
            <input className='password' type="password" id="contrasena" name="contrasena" placeholder="Ingresa tu contraseña" value={contrasena} onChange={e => setContrasena(e.target.value)} />
            {error && <div className='error-message'>{error}</div>}
            <button className='login-button' type="submit" disabled={cargando}>
              {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;