import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/listaEstudiante.css';

function CrearModalidad({ agregarModalidad }) {
  const navigate = useNavigate();
  const [modalidad, setModalidad] = useState({ nombre: '', descripcion: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setModalidad({ ...modalidad, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    agregarModalidad(modalidad);
    navigate("/lista-modalidad");
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <input className='usuario' name="nombre" value={modalidad.nombre} onChange={handleChange} placeholder="Nombre de la Modalidad" required />
      <input className='usuario' name="descripcion" value={modalidad.descripcion} onChange={handleChange} placeholder="Descripción" required />
      <div className="button-list">
        <button className='createbutton' type='submit'>Crear Modalidad</button>
      </div>
    </form>
  );
}

export default CrearModalidad;