import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../../hojas-de-estilo/listaEstudiante.css'; 

function ModificarAlumno({ alumnos, actualizarAlumno }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alumno, setAlumno] = useState(null);

  useEffect(() => {
    const alumnoAEditar = alumnos.find(a => a.numero_control === id);
    if (alumnoAEditar) {
      setAlumno(alumnoAEditar);
    }
  }, [id, alumnos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlumno({ ...alumno, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    actualizarAlumno(alumno);
    navigate("/lista-estudiantes");
  };
  
  if (!alumno) return <p>Cargando datos del alumno...</p>;

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <input className='usuario' name="numero_control" value={alumno.numero_control} readOnly disabled />
      <input className='usuario' name="nombre" value={alumno.nombre} onChange={handleChange} placeholder="Nombre Completo" required />
      <input className='usuario' name="correo" type="email" value={alumno.correo} onChange={handleChange} placeholder="Correo Electrónico" required />
      <input className='usuario' name="telefono" value={alumno.telefono} onChange={handleChange} placeholder="Teléfono" />
      <input className='usuario' name="curp" value={alumno.curp} onChange={handleChange} placeholder="CURP" />
      <input className='usuario' name="direccion" value={alumno.direccion} onChange={handleChange} placeholder="Dirección" />
      <div className="button-list">
        <button className='modifybutton' type='submit'>Guardar Cambios</button>
      </div>
    </form>
  );
}

export default ModificarAlumno;