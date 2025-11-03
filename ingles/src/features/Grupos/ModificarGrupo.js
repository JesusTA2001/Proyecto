import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import '../../styles/listaEstudiante.css';

// Componente de multi-selección (puedes moverlo a un archivo separado e importarlo)
function MultiSelectAlumnos({ alumnos, seleccionados, onToggle }) {
    const [filtro, setFiltro] = useState('');
    const alumnosFiltrados = (alumnos || []).filter(a =>
        a.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        a.numero_control.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <fieldset style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px', maxHeight: '300px', overflowY: 'auto' }}>
            <legend>Alumnos Disponibles ({seleccionados.size} seleccionados)</legend>
            <input
                type="text"
                placeholder="Buscar alumno por nombre o N° Control..."
                className="usuario"
                style={{ width: '100%', marginBottom: '10px' }}
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
            />
            {alumnosFiltrados.length > 0 ? (
                alumnosFiltrados.map(alumno => (
                    <div key={alumno.numero_control} style={{ marginBottom: '5px' }}>
                        <input
                            type="checkbox"
                            id={`alumno-${alumno.numero_control}`}
                            checked={seleccionados.has(alumno.numero_control)}
                            onChange={() => onToggle(alumno.numero_control)}
                        />
                        <label htmlFor={`alumno-${alumno.numero_control}`} style={{ marginLeft: '5px', cursor: 'pointer' }}>
                            {alumno.nombre} ({alumno.numero_control})
                        </label>
                    </div>
                ))
            ) : (
                <p>No hay alumnos disponibles para este nivel y ubicación, o que coincidan con la búsqueda.</p>
            )}
        </fieldset>
    );
}

function ModificarGrupo({ grupos, grupo: grupoProp, actualizarGrupo, niveles, modalidades, profesores, alumnos, onClose }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [grupo, setGrupo] = useState(null); // Estado para el grupo a editar
    const [alumnosSeleccionados, setAlumnosSeleccionados] = useState(new Set());
    const [nivelesDisponibles, setNivelesDisponibles] = useState([]);
    const [profesoresDisponibles, setProfesoresDisponibles] = useState([]);
    const [alumnosDisponibles, setAlumnosDisponibles] = useState([]);

    // Opciones para el select de días
    const diasSemana = [
        { value: 'Lunes', label: 'Lunes' },
        { value: 'Martes', label: 'Martes' },
        { value: 'Miercoles', label: 'Miércoles' },
        { value: 'Jueves', label: 'Jueves' },
        { value: 'Viernes', label: 'Viernes' },
        { value: 'Sabado', label: 'Sábado' },
        { value: 'Domingo', label: 'Domingo' },
        { value: 'Lunes-Miercoles', label: 'Lunes y Miércoles' },
        { value: 'Martes-Jueves', label: 'Martes y Jueves' },
        { value: 'Lunes-Viernes', label: 'Lunes a Viernes' },
    ];

    // --- Cargar datos del grupo ---
    useEffect(() => {
        // Si se recibe el grupo directamente (cuando se usa en modal), úsalo
        if (grupoProp) {
            setGrupo({ dia: '', horaInicio: '', horaFin: '', ...grupoProp });
            setAlumnosSeleccionados(new Set(grupoProp.alumnoIds || []));
            return;
        }
        // Si no, intenta buscar en el array 'grupos' usando el id de la ruta
        if (grupos && id) {
            const grupoAEditar = grupos.find(g => g.id === id);
            if (grupoAEditar) {
                setGrupo({ dia: '', horaInicio: '', horaFin: '', ...grupoAEditar });
                setAlumnosSeleccionados(new Set(grupoAEditar.alumnoIds || []));
                return;
            }
        }
        // Si no encontramos el grupo, navegar o cerrar modal si aplica
        if (onClose) {
            onClose();
        } else {
            navigate("/lista-grupos");
        }
    }, [id, grupos, navigate, grupoProp, onClose]);

    // --- Filtrar Niveles por Ubicación ---
    useEffect(() => {
        if (!grupo) return; // Esperar a que cargue el grupo
        const tecNivelIdsPattern = /^N[0-6]$/;
        let filtered = [];
        if (grupo.ubicacion === 'Tecnologico') {
            filtered = niveles.filter(n => tecNivelIdsPattern.test(n.id));
        } else if (grupo.ubicacion === 'Centro de Idiomas') {
            filtered = niveles;
        }
        setNivelesDisponibles(filtered);
    }, [grupo?.ubicacion, niveles]);

     // --- Filtrar Profesores por Ubicación ---
    useEffect(() => {
        if (!grupo) return;
        const filtered = (profesores || []).filter(p => p.estado === 'Activo' && (p.ubicacion === grupo.ubicacion || p.ubicacion === 'Ambos'));
        setProfesoresDisponibles(filtered);
    }, [grupo?.ubicacion, profesores]);


    // --- Filtrar Alumnos Disponibles ---
    useEffect(() => {
        if (!grupo) return;
        const filtered = (alumnos || []).filter(a =>
            (a.estado === 'Activo' &&
             a.ubicacion === grupo.ubicacion &&
             a.nivel === grupo.nivel) ||
            alumnosSeleccionados.has(a.numero_control) 
        );
         const uniqueAlumnos = Array.from(new Map(filtered.map(a => [a.numero_control, a])).values());
        setAlumnosDisponibles(uniqueAlumnos);
        
    }, [grupo?.ubicacion, grupo?.nivel, alumnos, alumnosSeleccionados]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setGrupo(prev => {
            const newState = { ...prev, [name]: value };
             if (name === 'ubicacion' || name === 'nivel') {
                 setAlumnosSeleccionados(new Set());
             }
             return newState;
        });
    };

    const handleAlumnoToggle = (alumnoId) => {
         setAlumnosSeleccionados(prev => {
             const newSet = new Set(prev);
             if (newSet.has(alumnoId)) {
                 newSet.delete(alumnoId);
             } else {
                 newSet.add(alumnoId);
             }
             return newSet;
         });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // --- VALIDACIÓN AÑADIDA ---
        if (!grupo.nombre || !grupo.nivel || !grupo.modalidad || !grupo.ubicacion || !grupo.profesorId || !grupo.dia || !grupo.horaInicio || !grupo.horaFin) {
            alert("Por favor completa todos los campos del grupo, incluyendo día y horas.");
            return;
        }
        // -------------------------

        const grupoFinal = {
            ...grupo,
            alumnoIds: Array.from(alumnosSeleccionados)
        };
        actualizarGrupo(grupoFinal); // Esta función debe incluir la validación de empalme
        if (onClose) {
            onClose();
        } else {
            navigate("/lista-grupos");
        }
    };

    // Mensaje de carga mientras se busca el grupo
    if (!grupo) {
        return <p className="loading-message">Cargando datos del grupo...</p>;
    }

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <label>ID del Grupo (No editable):</label>
            <input className='usuario' name="id" value={grupo.id} readOnly disabled />

            <label>Nombre del Grupo:</label>
            <input className='usuario' name="nombre" value={grupo.nombre} onChange={handleChange} placeholder="Nombre del Grupo" required />

            <label>Ubicación:</label>
             <select name="ubicacion" value={grupo.ubicacion} onChange={handleChange} className="usuario" required>
                <option value="Tecnologico">Tecnológico (Interno)</option>
                <option value="Centro de Idiomas">Centro de Idiomas (Externo)</option>
            </select>

            <label>Nivel:</label>
            <select name="nivel" value={grupo.nivel} onChange={handleChange} className="usuario" required>
                <option value="">Selecciona un Nivel</option>
                { (nivelesDisponibles || []).map(n => <option key={n.id} value={n.nombre}>{n.nombre}</option>)}
            </select>

            <label>Modalidad:</label>
            <select name="modalidad" value={grupo.modalidad} onChange={handleChange} className="usuario" required>
                <option value="">Selecciona una Modalidad</option>
                {(modalidades || []).map(m => <option key={m.id} value={m.nombre}>{m.nombre}</option>)}
            </select>

            <label>Profesor:</label>
             <select name="profesorId" value={grupo.profesorId} onChange={handleChange} className="usuario" required>
                <option value="">Selecciona un Profesor</option>
                {(profesoresDisponibles || []).map(p => <option key={p.numero_empleado} value={p.numero_empleado}>{p.nombre} ({p.numero_empleado})</option>)}
            </select>

            {/* --- INICIO: CAMPOS DE HORARIO AÑADIDOS --- */}
            <label>Día/Días:</label>
            <select name="dia" value={grupo.dia} onChange={handleChange} className="usuario" required>
                <option value="">Selecciona el día/días</option>
                {diasSemana.map(dia => (
                    <option key={dia.value} value={dia.value}>{dia.label}</option>
                ))}
            </select>

            <label>Hora de Inicio:</label>
            <input 
                type="time" 
                name="horaInicio" 
                value={grupo.horaInicio} 
                onChange={handleChange} 
                className="usuario" 
                required 
            />
            
            <label>Hora de Fin:</label>
            <input 
                type="time" 
                name="horaFin" 
                value={grupo.horaFin} 
                onChange={handleChange} 
                className="usuario" 
                required 
            />
            {/* --- FIN: CAMPOS DE HORARIO AÑADIDOS --- */}

            {/* --- Selección de Alumnos --- */}
            <MultiSelectAlumnos
                alumnos={alumnosDisponibles}
                seleccionados={alumnosSeleccionados}
                onToggle={handleAlumnoToggle}
            />

            <div className="button-list">
                <button className='modifybutton' type='submit'>Guardar Cambios</button>
            </div>
        </form>
    );
}
export default ModificarGrupo;