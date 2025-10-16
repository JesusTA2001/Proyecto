import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../hojas-de-estilo/listaEstudiante.css'; 

function CrearAlumno({ agregarAlumno }) {
  const navigate = useNavigate();
  const [alumno, setAlumno] = useState({
    numero_control: '', nombre: '', correo: '', telefono: '', curp: '', direccion: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlumno({ ...alumno, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí podrías agregar validaciones
    agregarAlumno({ ...alumno, numero_control: `NUEVO-${Date.now()}` }); // ID temporal
    navigate("/lista-estudiantes");
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <input className='usuario' name="nombre" value={alumno.nombre} onChange={handleChange} placeholder="Nombre Completo" required />
      <input className='usuario' name="correo" type="email" value={alumno.correo} onChange={handleChange} placeholder="Correo Electrónico" required />
      <input className='usuario' name="telefono" value={alumno.telefono} onChange={handleChange} placeholder="Teléfono" />
      <input className='usuario' name="curp" value={alumno.curp} onChange={handleChange} placeholder="CURP" />
      <input className='usuario' name="direccion" value={alumno.direccion} onChange={handleChange} placeholder="Dirección" />
      <div className="button-list">
        <button className='createbutton' type='submit'>Crear Alumno</button>
      </div>
    </form>
  );
}

export default CrearAlumno;