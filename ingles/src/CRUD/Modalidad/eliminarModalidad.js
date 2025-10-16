import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import '../../hojas-de-estilo/listaEstudiante.css';

function EliminarModalidad({ modalidades, eliminarModalidad }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const modalidad = modalidades.find(m => m.id === id);

  const handleDelete = () => {
    eliminarModalidad(id);
    navigate("/lista-modalidad");
  };

  if (!modalidad) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Modalidad no encontrada</h2>
        <Link to="/lista-modalidad"><button className="createbutton">Volver</button></Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>¿Estás seguro que deseas eliminar esta modalidad?</h2>
      <div style={{ margin: '20px 0', border: '1px solid #ccc', padding: '15px', borderRadius: '8px', display: 'inline-block', textAlign: 'left' }}>
        <p><strong>ID:</strong> {modalidad.id}</p>
        <p><strong>Nombre:</strong> {modalidad.nombre}</p>
      </div>
      <div className="button-list">
        <button className='deletebutton' onClick={handleDelete}>Sí, Eliminar</button>
        <button className='createbutton' onClick={() => navigate("/lista-modalidad")}>Cancelar</button>
      </div>
    </div>
  );
}

export default EliminarModalidad;