import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../styles/listaEstudiante.css';

function VerProfesor({ profesores }) {
    const { id } = useParams();
    const profesor = profesores.find(p => p.numero_empleado === id);

    if (!profesor) {
        return (
            <div className="detail-container">
                <h2>Profesor no encontrado</h2>
                <p>El profesor que buscas no existe o fue eliminado.</p>
                <Link to="/lista-profesores">
                    <button className="createbutton" style={{ marginTop: '20px' }}>Volver a la lista</button>
                </Link>
            </div>
        );
    }

    return (
        <div className="detail-container">
            <h2>{profesor.nombre}</h2>
            <div className="detail-grid">
                <p><strong>Número de Empleado:</strong> {profesor.numero_empleado}</p>
                <p><strong>Correo Electrónico:</strong> {profesor.correo}</p>
                <p><strong>Grado de Estudio:</strong> {profesor.gradoEstudio}</p>
                <p><strong>Teléfono:</strong> {profesor.telefono}</p>
                <p><strong>CURP:</strong> {profesor.curp}</p>
                <p><strong>Dirección:</strong> {profesor.direccion}</p>
                <p><strong>Estado:</strong> 
                    <span className={profesor.estado === 'Activo' ? 'estado-activo' : 'estado-inactivo'}>
                        {profesor.estado}
                    </span>
                </p>
            </div>
            <Link to="/lista-profesores">
                <button className="createbutton" style={{ marginTop: '20px' }}>Volver a la lista</button>
            </Link>
        </div>
    );
}

export default VerProfesor;