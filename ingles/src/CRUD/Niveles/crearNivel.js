import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../hojas-de-estilo/listaEstudiante.css';

function CrearNivel({ agregarNivel }) {
  const navigate = useNavigate();
  const [nivel, setNivel] = useState({ nombre: '', disponibilidad: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNivel({ ...nivel, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    agregarNivel(nivel);
    navigate("/lista-niveles");
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <input className='usuario' name="nombre" value={nivel.nombre} onChange={handleChange} placeholder="Nombre del Nivel" required />
      <input className='usuario' name="disponibilidad" value={nivel.disponibilidad} onChange={handleChange} placeholder="Días y Horarios" required />
      <div className="button-list">
        <button className='createbutton' type='submit'>Crear Nivel</button>
      </div>
    </form>
  );
}

export default CrearNivel;