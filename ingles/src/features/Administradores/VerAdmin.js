import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../styles/listaEstudiante.css';

function VerAdministrador({ administradores }) {
    const { id } = useParams();
    const admin = administradores.find(a => a.numero_empleado === id);

    if (!admin) {
        return (
            <div className="detail-container">
                <h2>Administrador no encontrado</h2>
                <p>El administrador que buscas no existe o fue eliminado.</p>
                <Link to="/lista-administradores">
                    <button className="createbutton" style={{ marginTop: '20px' }}>Volver a la lista</button>
                </Link>
            </div>
        );
    }

    return (
        <div className="detail-container">
            <h2>{admin.nombre}</h2>
            <div className="detail-grid">
                <p><strong>Número de Empleado:</strong> {admin.numero_empleado}</p>
                <p><strong>Correo Electrónico:</strong> {admin.correo}</p>
                <p><strong>Teléfono:</strong> {admin.telefono}</p>
                <p><strong>CURP:</strong> {admin.curp}</p>
                <p><strong>Dirección:</strong> {admin.direccion}</p>
                <p><strong>Estado:</strong> 
                    <span className={admin.estado === 'Activo' ? 'estado-activo' : 'estado-inactivo'}>
                        {admin.estado}
                    </span>
                </p>
            </div>
            <Link to="/lista-administradores">
                <button className="createbutton" style={{ marginTop: '20px' }}>Volver a la lista</button>
            </Link>
        </div>
    );
}

export default VerAdministrador;