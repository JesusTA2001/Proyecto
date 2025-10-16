import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../hojas-de-estilo/listaEstudiante.css';

function CrearProfesor({ agregarProfesor }) {
  const navigate = useNavigate();
  const [profesor, setProfesor] = useState({
    nombre: '', correo: '', telefono: '', curp: '', direccion: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfesor({ ...profesor, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    agregarProfesor(profesor);
    navigate("/lista-profesores");
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <input className='usuario' name="nombre" value={profesor.nombre} onChange={handleChange} placeholder="Nombre Completo" required />
      <input className='usuario' name="correo" type="email" value={profesor.correo} onChange={handleChange} placeholder="Correo Electrónico" required />
      <input className='usuario' name="telefono" value={profesor.telefono} onChange={handleChange} placeholder="Teléfono" />
      <input className='usuario' name="curp" value={profesor.curp} onChange={handleChange} placeholder="CURP" />
      <input className='usuario' name="direccion" value={profesor.direccion} onChange={handleChange} placeholder="Dirección" />
      <div className="button-list">
        <button className='createbutton' type='submit'>Crear Profesor</button>
      </div>
    </form>
  );
}

export default CrearProfesor;