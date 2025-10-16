import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../../hojas-de-estilo/listaEstudiante.css';

function ModificarModalidad({ modalidades, actualizarModalidad }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modalidad, setModalidad] = useState(null);

  useEffect(() => {
    const modalidadAEditar = modalidades.find(m => m.id === id);
    if (modalidadAEditar) {
      setModalidad(modalidadAEditar);
    } else {
      navigate("/lista-modalidad");
    }
  }, [id, modalidades, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setModalidad({ ...modalidad, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    actualizarModalidad(modalidad);
    navigate("/lista-modalidad");
  };
  
  if (!modalidad) return <p style={{textAlign: 'center', margin: '20px'}}>Cargando datos...</p>;

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <input className='usuario' name="id" value={modalidad.id} readOnly disabled />
      <input className='usuario' name="nombre" value={modalidad.nombre} onChange={handleChange} placeholder="Nombre de la Modalidad" required />
      <input className='usuario' name="descripcion" value={modalidad.descripcion} onChange={handleChange} placeholder="Descripción" required />
      <div className="button-list">
        <button className='modifybutton' type='submit'>Guardar Cambios</button>
      </div>
    </form>
  );
}

export default ModificarModalidad;