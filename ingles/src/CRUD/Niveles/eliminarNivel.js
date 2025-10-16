import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import '../../hojas-de-estilo/listaEstudiante.css';

function EliminarNivel({ niveles, eliminarNivel }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const nivel = niveles.find(n => n.id === id);

  const handleDelete = () => {
    eliminarNivel(id);
    navigate("/lista-niveles");
  };

  if (!nivel) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Nivel no encontrado</h2>
        <p>El nivel que intentas eliminar ya no existe.</p>
        <Link to="/lista-niveles">
            <button className="createbutton" style={{marginTop: '20px'}}>Volver a la lista</button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>¿Estás seguro que deseas eliminar este nivel?</h2>
      <div style={{ margin: '20px 0', border: '1px solid #ccc', padding: '15px', borderRadius: '8px', display: 'inline-block', textAlign: 'left' }}>
        <p><strong>ID:</strong> {nivel.id}</p>
        <p><strong>Nombre:</strong> {nivel.nombre}</p>
      </div>
      <div className="button-list">
        <button className='deletebutton' onClick={handleDelete}>Sí, Eliminar Nivel</button>
        <button className='createbutton' onClick={() => navigate("/lista-niveles")}>Cancelar</button>
      </div>
    </div>
  );
}

export default EliminarNivel;