import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import '../../hojas-de-estilo/listaEstudiante.css';

function EliminarProfesor({ profesores, eliminarProfesor }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const profesor = profesores.find(p => p.numero_empleado === id);

  const handleDelete = () => {
    eliminarProfesor(id);
    navigate("/lista-profesores");
  };

  if (!profesor) {
    return (
      <div className="detail-container">
        <h2>Profesor no encontrado</h2>
        <p>El profesor que intentas eliminar ya no existe.</p>
        <Link to="/lista-profesores">
            <button className="createbutton" style={{marginTop: '20px'}}>Volver a la lista</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="detail-container" style={{ textAlign: 'center' }}>
      <h2>¿Estás seguro que deseas eliminar a este profesor?</h2>
      <div style={{ margin: '20px 0', border: '1px solid #ccc', padding: '15px', borderRadius: '8px', display: 'inline-block', textAlign: 'left' }}>
        <p><strong>Número de Empleado:</strong> {profesor.numero_empleado}</p>
        <p><strong>Nombre:</strong> {profesor.nombre}</p>
        <p><strong>Correo:</strong> {profesor.correo}</p>
      </div>
      <div className="button-list">
        <button className='deletebutton' onClick={handleDelete}>Sí, Eliminar Profesor</button>
        <button className='createbutton' onClick={() => navigate("/lista-profesores")}>Cancelar</button>
      </div>
    </div>
  );
}

export default EliminarProfesor;
