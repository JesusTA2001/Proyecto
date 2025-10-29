import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/listaEstudiante.css';

function CrearAdministrador({ agregarAdministrador }) {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({
    nombre: '', correo: '', curp: '', telefono: '', direccion: '', estado: 'Activo'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin({ ...admin, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    agregarAdministrador(admin);
    navigate("/lista-administradores");
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <input className='usuario' name="nombre" value={admin.nombre} onChange={handleChange} placeholder="Nombre Completo" required />
      <input className='usuario' name="correo" type="email" value={admin.correo} onChange={handleChange} placeholder="Correo Electrónico" required />
      <input className='usuario' name="curp" value={admin.curp} onChange={handleChange} placeholder="CURP" />
      <input className='usuario' name="telefono" value={admin.telefono} onChange={handleChange} placeholder="Teléfono" />
      <input className='usuario' name="direccion" value={admin.direccion} onChange={handleChange} placeholder="Dirección" />
      <div className="button-list">
        <button className='createbutton' type='submit'>Crear Administrador</button>
      </div>
    </form>
  );
}

export default CrearAdministrador;