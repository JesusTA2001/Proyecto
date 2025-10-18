import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import '../../hojas-de-estilo/listaEstudiante.css';

function EliminarAdministrador({ administradores, eliminarAdministrador }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const admin = administradores.find(a => a.numero_empleado === id);

  const handleDelete = () => {
    eliminarAdministrador(id);
    navigate("/lista-administradores");
  };

  if (!admin) {
    return (
      <div className="detail-container">
        <h2>Administrador no encontrado</h2>
        <p>El administrador que intentas eliminar ya no existe.</p>
        <Link to="/lista-administradores">
            <button className="createbutton" style={{marginTop: '20px'}}>Volver a la lista</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="detail-container" style={{ textAlign: 'center' }}>
      <h2>¿Estás seguro que deseas eliminar a este administrador?</h2>
      <div style={{ margin: '20px 0', border: '1px solid #ccc', padding: '15px', borderRadius: '8px', display: 'inline-block', textAlign: 'left' }}>
        <p><strong>N° de Empleado:</strong> {admin.numero_empleado}</p>
        <p><strong>Nombre:</strong> {admin.nombre}</p>
      </div>
      <div className="button-list" style={{marginTop: '20px'}}>
        <button className='deletebutton' onClick={handleDelete}>Sí, Eliminar Administrador</button>
        <button className='createbutton' onClick={() => navigate("/lista-administradores")}>Cancelar</button>
      </div>
    </div>
  );
}

export default EliminarAdministrador;