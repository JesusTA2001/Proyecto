import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../../styles/listaEstudiante.css';
// --- CORRECCIÓN: Se añade la importación que faltaba ---
import { gradoEstudioOptions } from '../../data/mapping.js';

function ModificarProfesor({ profesores, actualizarProfesor }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profesor, setProfesor] = useState(null);

  useEffect(() => {
    const profesorAEditar = profesores.find(p => p.numero_empleado === id);
    if (profesorAEditar) {
      setProfesor(profesorAEditar);
    } else {
      navigate("/lista-profesores");
    }
  }, [id, profesores, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfesor({ ...profesor, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    actualizarProfesor(profesor);
    navigate("/lista-profesores");
  };
  
  if (!profesor) return <p className="loading-message">Cargando datos del profesor...</p>;

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <input className='usuario' name="numero_empleado" value={profesor.numero_empleado} readOnly disabled />
      <input className='usuario' name="nombre" value={profesor.nombre} onChange={handleChange} placeholder="Nombre Completo" required />
      <input className='usuario' name="correo" type="email" value={profesor.correo} onChange={handleChange} placeholder="Correo Electrónico" required />
      <input className='usuario' name="curp" value={profesor.curp} onChange={handleChange} placeholder="CURP" />
      <input className='usuario' name="telefono" value={profesor.telefono} onChange={handleChange} placeholder="Teléfono" />
      <input className='usuario' name="direccion" value={profesor.direccion} onChange={handleChange} placeholder="Dirección" />
      
      <select name="gradoEstudio" value={profesor.gradoEstudio} onChange={handleChange} className="usuario" required>
          <option value="">Selecciona un grado de estudio</option>
          {gradoEstudioOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
          ))}
      </select>

      <div className="button-list">
        <button className='modifybutton' type='submit'>Guardar Cambios</button>
      </div>
    </form>
  );
}

export default ModificarProfesor;