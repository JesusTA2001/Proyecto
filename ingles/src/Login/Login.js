import React from 'react';
import '../hojas-de-estilo/Login.css';
import '../imagenes/TecZamora.png'
function Login() {
  return (
    <div className='inicio-sesion'>
        <h1 className='titulo'>Plataforma De Ingles Tecnologico De Zamora</h1>
        <img className='logo' src={require('../imagenes/TecZamora.png')} alt='Logo Tec Zamora'/>
        <div className='formulario-inicio-sesion'>
            <form className='datos-usuario'>
                <label for="usuario">Usuario</label>
                <input className='usuario' type="text" id="usuario" name="usuario" placeholder="Ingresa tu usuario"></input>
                <label for="contrasena">Contraseña</label>
                <input className='password' type="password" id="contrasena" name="contrasena" placeholder="Ingresa tu contraseña"></input>
                <button className='login-button'type="submit">Iniciar Sesión</button>
            </form>
        </div>
    </div>
  );
}

export default Login;