import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../styles/listaEstudiante.css';
import { carrerasMap } from '../../data/mapping';
import { initialNiveles } from '../../data/niveles'; // Importamos los niveles

function VerAlumno({ alumnos }) {
    const { id } = useParams();
    const alumno = alumnos.find(a => a.numero_control === id);

    if (!alumno) {
        return (
            <div className="detail-container">
                {/* Botón Volver (movido aquí para que aparezca incluso si no se encuentra) */}
                <Link to="/lista-estudiantes" className="back-button-link">
                    <button className="createbutton">Volver a la lista</button>
                </Link>
                <h2>Alumno no encontrado</h2>
                <p>El alumno que buscas no existe o fue eliminado.</p>
            </div>
        );
    }

    // Determinar la etiqueta de ubicación
    const ubicacionLabel = alumno.ubicacion === 'Tecnologico' ? 'Tecnológico (Interno)' : 'Centro de Idiomas (Externo)';

    // Filtrar los niveles posibles según la ubicación del alumno
    const tecNivelIdsPattern = /^N[0-6]$/; // Regex para N0-N6
    const nivelesPosibles = initialNiveles.filter(nivel => {
        if (alumno.ubicacion === 'Tecnologico') {
            return tecNivelIdsPattern.test(nivel.id); // Solo N0-N6
        } else {
            return true; // Todos los niveles para Centro de Idiomas
        }
    });

    return (
        <div className="detail-container"> {/* Añadimos position relative para el botón */}
            {/* Botón Volver a la lista (movido arriba y con clase para CSS) */}
            <Link to="/lista-estudiantes" className="back-button-link">
                <button className="createbutton">Volver a la lista</button>
            </Link>

            <h2>{alumno.nombre}</h2>

            {/* --- Sección de Detalles Principales --- */}
            <h3 className="detail-section-title">Datos Personales</h3>
            <div className="detail-grid">
                <p><strong>Número de Control:</strong> {alumno.numero_control}</p>
                <p><strong>Correo:</strong> {alumno.correo}</p>
                 {/* Mostrar carrera solo si no es 'No Aplica' o vacía */}
                 {(alumno.carrera && alumno.carrera !== 'No Aplica') && (
                    <p><strong>Carrera:</strong> {carrerasMap[alumno.carrera] || alumno.carrera}</p>
                 )}
                <p><strong>Teléfono:</strong> {alumno.telefono || 'No especificado'}</p>
                <p><strong>CURP:</strong> {alumno.curp || 'No especificado'}</p>
                <p><strong>Dirección:</strong> {alumno.direccion || 'No especificada'}</p>
                <p><strong>Género:</strong> {alumno.genero}</p>
                <p><strong>Ubicación:</strong> <span className={`ubicacion-${alumno.ubicacion === 'Tecnologico' ? 'tec' : 'nodo'}`}>{ubicacionLabel}</span></p>
                <p><strong>Estado:</strong> <span className={alumno.estado === 'Activo' ? 'estado-activo' : 'estado-inactivo'}>{alumno.estado}</span></p>
            </div>

            {/* --- Sección de Nivel Actual (Simulación de Historial) --- */}
            <h3 className="detail-section-title">Nivel Actual</h3>
            <div className="detail-grid history-section"> {/* Usamos detail-grid para consistencia */}
                 <p><strong>Nivel:</strong> {alumno.nivel || 'No asignado'}</p>
                 <p><strong>Modalidad:</strong> {alumno.modalidad || 'No asignada'}</p>
                 {/* Aquí podrías añadir más detalles si los tuvieras, como grupo, profesor, etc. */}
            </div>

            {/* --- Sección de Niveles Posibles --- */}
            <h3 className="detail-section-title">Plan de Estudios ({ubicacionLabel})</h3>
            <div className='levels-path-container'>
                <ul className="levels-path-list">
                    {nivelesPosibles.map((nivel) => (
                        <li key={nivel.id} className={nivel.nombre === alumno.nivel ? 'current-level' : ''}>
                           {nivel.nombre}
                           {/* Podrías añadir la disponibilidad si quieres: <span>({nivel.disponibilidad})</span> */}
                        </li>
                    ))}
                </ul>
            </div>

            {/* El botón "Volver" ya está arriba */}
        </div>
    );
}

export default VerAlumno;