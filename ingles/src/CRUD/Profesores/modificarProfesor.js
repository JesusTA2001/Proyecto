import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../../hojas-de-estilo/listaEstudiante.css';

// 1. Recibe 'profesores' y la función 'actualizarProfesor'
function ModificarProfesor({ profesores, actualizarProfesor }) {
  const { id } = useParams(); // Obtiene el ID (ej: "EMP001")
  const navigate = useNavigate();
  const [profesor, setProfesor] = useState(null);

  // 2. Busca el profesor en el arreglo cuando el componente carga
  useEffect(() => {
    const profesorAEditar = profesores.find(p => p.numero_empleado === id);
    if (profesorAEditar) {
      setProfesor(profesorAEditar);
    } else {
      navigate("/lista-profesores"); // Si no lo encuentra, regresa a la lista
    }
  }, [id, profesores, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfesor({ ...profesor, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    actualizarProfesor(profesor); // Llama a la función de App.js
    navigate("/lista-profesores"); // Redirige
  };
  
  if (!profesor) return <p style={{textAlign: 'center', margin: '20px'}}>Cargando datos del profesor...</p>;

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <input className='usuario' name="numero_empleado" value={profesor.numero_empleado} readOnly disabled title="El número de empleado no se puede modificar" />
      <input className='usuario' name="nombre" value={profesor.nombre} onChange={handleChange} placeholder="Nombre Completo" required />
      <input className='usuario' name="correo" type="email" value={profesor.correo} onChange={handleChange} placeholder="Correo Electrónico" required />
      <input className='usuario' name="telefono" value={profesor.telefono} onChange={handleChange} placeholder="Teléfono" />
      <input className='usuario' name="curp" value={profesor.curp} onChange={handleChange} placeholder="CURP" />
      <input className='usuario' name="direccion" value={profesor.direccion} onChange={handleChange} placeholder="Dirección" />
      <div className="button-list">
        <button className='modifybutton' type='submit'>Guardar Cambios</button>
      </div>
    </form>
  );
}

export default ModificarProfesor;