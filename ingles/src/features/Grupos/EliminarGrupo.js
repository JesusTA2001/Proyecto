import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import '../../styles/listaEstudiante.css';

function EliminarGrupo({ grupos, eliminarGrupo }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const grupo = grupos.find(g => g.id === id);

  const handleDelete = () => {
    eliminarGrupo(id);
    navigate("/lista-grupos");
  };

  if (!grupo) {
    return (
      <div className="detail-container">
        <h2>Grupo no encontrado</h2>
        <p>El grupo que intentas eliminar ya no existe.</p>
        <Link to="/lista-grupos">
            <button className="createbutton" style={{marginTop: '20px'}}>Volver a la lista</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="detail-container" style={{ textAlign: 'center' }}>
      <h2>¿Estás seguro que deseas eliminar este grupo?</h2>
      <div style={{ margin: '20px 0', border: '1px solid #ccc', padding: '15px', borderRadius: '8px', display: 'inline-block', textAlign: 'left' }}>
        <p><strong>ID:</strong> {grupo.id}</p>
        <p><strong>Nombre:</strong> {grupo.nombre}</p>
        <p><strong>Nivel:</strong> {grupo.nivel}</p>
        <p><strong>Ubicación:</strong> {grupo.ubicacion}</p>
        <p><strong>Alumnos:</strong> {grupo.alumnoIds.length}</p>
      </div>
      <div className="button-list" style={{marginTop: '20px'}}>
        <button className='deletebutton' onClick={handleDelete}>Sí, Eliminar Grupo</button>
        <button className='createbutton' onClick={() => navigate("/lista-grupos")}>Cancelar</button>
      </div>
    </div>
  );
}

export default EliminarGrupo;
