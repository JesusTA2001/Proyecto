import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../../hojas-de-estilo/listaEstudiante.css';

function ModificarNivel({ niveles, actualizarNivel }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nivel, setNivel] = useState(null);

  useEffect(() => {
    const nivelAEditar = niveles.find(n => n.id === id);
    if (nivelAEditar) {
      setNivel(nivelAEditar);
    } else {
      navigate("/lista-niveles");
    }
  }, [id, niveles, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNivel({ ...nivel, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    actualizarNivel(nivel);
    navigate("/lista-niveles");
  };
  
  if (!nivel) return <p style={{textAlign: 'center', margin: '20px'}}>Cargando datos del nivel...</p>;

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <input className='usuario' name="id" value={nivel.id} readOnly disabled />
      <input className='usuario' name="nombre" value={nivel.nombre} onChange={handleChange} placeholder="Nombre del Nivel" required />
      <input className='usuario' name="disponibilidad" value={nivel.disponibilidad} onChange={handleChange} placeholder="Días y Horarios" required />
      <div className="button-list">
        <button className='modifybutton' type='submit'>Guardar Cambios</button>
      </div>
    </form>
  );
}

export default ModificarNivel;