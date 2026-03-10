import React, { useState } from 'react';
import '../../styles/Login.css';
import api from '../../api/axios';
import { IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function Login() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    console.log('🔐 Iniciando proceso de login...');
    console.log('Usuario:', usuario);
    console.log('Contraseña length:', contrasena?.length);

    try {
      console.log('📡 Enviando petición a /auth/login...');
      // Intentar autenticar con la API
      const response = await api.post('/auth/login', {
        usuario,
        contraseña: contrasena
      });
      console.log('✅ Respuesta recibida:', response.data);

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
      console.error('❌ Error de autenticación:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      setError('Usuario o contraseña incorrectos. Verifica tus credenciales.');
    } finally {
      setCargando(false);
      console.log('🏁 Proceso de login finalizado');
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
            <div style={{ position: 'relative', width: '100%', display: 'flex', margin: '20px' }}>
              <input 
                className='password' 
                type={showPassword ? 'text' : 'password'}
                id="contrasena" 
                name="contrasena" 
                placeholder="Ingresa tu contraseña" 
                value={contrasena} 
                onChange={e => setContrasena(e.target.value)}
                style={{
                  WebkitTextSecurity: showPassword ? 'none' : 'disc',
                  paddingRight: '40px',
                  margin: '0',
                  width: '100%'
                }}
              />
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                size="small"
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: '4px'
                }}
              >
                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </IconButton>
            </div>
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