import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../styles/listaEstudiante.css'; // Reutilizamos estilos

// Función para generar las horas del día (ej: 7:00 a 21:00)
const generarHoras = (start = 7, end = 21) => {
    const horas = [];
    for (let i = start; i <= end; i++) {
        horas.push(`${i.toString().padStart(2, '0')}:00`);
    }
    return horas;
};

// Función para convertir hora "HH:MM" a número (ej: 9.5 para 09:30)
const horaANumero = (horaStr) => {
    const [hora, minuto] = horaStr.split(':').map(Number);
    return hora + (minuto / 60);
};

function VerHorario({ profesores, grupos }) {
    const { id: profesorId } = useParams(); // Renombramos 'id' a 'profesorId'
    
    // 1. Encontrar al profesor
    const profesor = profesores.find(p => p.numero_empleado === profesorId);
    
    // 2. Encontrar todos los grupos asignados a este profesor
    const gruposAsignados = grupos.filter(g => g.profesorId === profesorId);

    // 3. Definir días y horas
    const dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
    const horas = generarHoras(7, 21); // De 7:00 AM a 9:00 PM

    // 4. Función para encontrar qué grupo va en una celda
    const getGrupoEnHorario = (dia, hora) => {
        const horaNum = horaANumero(hora); // ej: 9.0
        
        for (const grupo of gruposAsignados) {
            // Lógica simple de "dia" (se puede mejorar para rangos como Lunes-Miercoles)
            const diaMatch = grupo.dia.toLowerCase().includes(dia.toLowerCase().substring(0, 3));
            
            if (diaMatch) {
                const inicioNum = horaANumero(grupo.horaInicio);
                const finNum = horaANumero(grupo.horaFin);
                
                // Comprueba si la hora de la celda está DENTRO del bloque del grupo
                // (horaNum >= inicioNum Y horaNum < finNum)
                if (horaNum >= inicioNum && horaNum < finNum) {
                    return grupo; // Devuelve el grupo
                }
            }
        }
        return null; // No hay grupo en esta celda
    };


    if (!profesor) {
        return <div className="detail-container"><h2>Profesor no encontrado</h2>{/* ... botón volver ... */}</div>;
    }

    return (
        <div className="detail-container schedule-container"> {/* Contenedor especial para horario */}
             <Link to="/lista-horarios" className="back-button-link">
                <button className="createbutton">Volver a la Lista</button>
            </Link>
            <h2>Horario de: {profesor.nombre}</h2>
            <p><strong>Ubicación:</strong> {profesor.ubicacion}</p>

            <div className="schedule-grid-wrapper">
                <table className="schedule-table">
                    <thead>
                        <tr>
                            <th className="time-header">Hora</th> {/* Celda vacía esquina */}
                            {dias.map(dia => <th key={dia}>{dia}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {horas.map(hora => (
                            <tr key={hora}>
                                <td className="time-cell">{hora}</td> {/* Celda de la hora */}
                                {dias.map(dia => {
                                    const grupo = getGrupoEnHorario(dia, hora);
                                    if (grupo) {
                                        // Si hay un grupo, renderiza la celda con info
                                        return (
                                            <td key={`${dia}-${hora}`} className="schedule-cell occupied">
                                                <strong>{grupo.nombre}</strong>
                                                <span>{grupo.nivel}</span>
                                                <span>({grupo.modalidad})</span>
                                            </td>
                                        );
                                    } else {
                                        // Celda vacía
                                        return <td key={`${dia}-${hora}`} className="schedule-cell empty"></td>;
                                    }
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default VerHorario;