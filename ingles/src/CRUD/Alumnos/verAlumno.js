import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../hojas-de-estilo/listaEstudiante.css';
// --- LÍNEA DE IMPORTACIÓN QUE FALTABA ---
import { carrerasMap } from '../../data/mapping';

function VerAlumno({ alumnos }) {
    const { id } = useParams();
    const alumno = alumnos.find(a => a.numero_control === id);

    if (!alumno) {
        return <div className="detail-container"><p>Alumno no encontrado.</p></div>;
    }

    return (
        <div className="detail-container">
            <h2>{alumno.nombre}</h2>
            <div className="detail-grid">
                <p><strong>Número de Control:</strong> {alumno.numero_control}</p>
                <p><strong>Correo:</strong> {alumno.correo}</p>
                <p><strong>Carrera:</strong> {carrerasMap[alumno.carrera] || 'No especificada'}</p>
                <p><strong>Teléfono:</strong> {alumno.telefono}</p>
                <p><strong>CURP:</strong> {alumno.curp}</p>
                <p><strong>Dirección:</strong> {alumno.direccion}</p>
                <p><strong>Género:</strong> {alumno.genero}</p>
                <p><strong>Nivel:</strong> {alumno.nivel}</p>
                <p><strong>Modalidad:</strong> {alumno.modalidad}</p>
                <p><strong>Estado:</strong> <span className={alumno.estado === 'Activo' ? 'estado-activo' : 'estado-inactivo'}>{alumno.estado}</span></p>
            </div>
            <Link to="/lista-estudiantes">
                <button className="createbutton" style={{ marginTop: '20px' }}>Volver a la lista</button>
            </Link>
        </div>
    );
}

export default VerAlumno;