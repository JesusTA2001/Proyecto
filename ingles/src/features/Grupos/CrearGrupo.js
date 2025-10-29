import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../../styles/listaEstudiante.css';

// Recibe props: agregarGrupo, niveles, modalidades, profesores, alumnos
function CrearGrupo({ agregarGrupo, niveles, modalidades, profesores, alumnos }) {
    const navigate = useNavigate();
    const [grupo, setGrupo] = useState({
        nombre: '',
        nivel: '',
        modalidad: '',
        ubicacion: 'Tecnologico', // Valor inicial
        profesorId: '',
        alumnoIds: [],
        // --- CAMPOS DE HORARIO AÑADIDOS ---
        dia: '',
        horaInicio: '',
        horaFin: ''
        // ------------------------------------
    });
    const [nivelesDisponibles, setNivelesDisponibles] = useState([]);
    const [profesoresDisponibles, setProfesoresDisponibles] = useState([]);
    const [alumnosDisponibles, setAlumnosDisponibles] = useState([]); // Alumnos que cumplen requisitos
    const [alumnosSeleccionados, setAlumnosSeleccionados] = useState(new Set()); // IDs seleccionados

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

    // --- Filtrar Niveles por Ubicación ---
    useEffect(() => {
        const tecNivelIdsPattern = /^N[0-6]$/;
        let filtered = [];
        if (grupo.ubicacion === 'Tecnologico') {
            filtered = niveles.filter(n => tecNivelIdsPattern.test(n.id));
        } else if (grupo.ubicacion === 'Centro de Idiomas') {
            filtered = niveles; // O filtra si es necesario
        }
        setNivelesDisponibles(filtered);
        // Resetear nivel si el actual no es válido
        if (grupo.nivel && !filtered.some(n => n.nombre === grupo.nivel)) {
             setGrupo(prev => ({ ...prev, nivel: '' }));
        }
    }, [grupo.ubicacion, niveles]);

     // --- Filtrar Profesores por Ubicación ---
    useEffect(() => {
         if (!grupo.ubicacion) {
             setProfesoresDisponibles([]);
             return;
         }
         const filtered = profesores.filter(p => p.estado === 'Activo' && (p.ubicacion === grupo.ubicacion || p.ubicacion === 'Ambos'));
         setProfesoresDisponibles(filtered);
         // Resetear profesor si el actual no es válido
         if (grupo.profesorId && !filtered.some(p => p.numero_empleado === grupo.profesorId)) {
              setGrupo(prev => ({ ...prev, profesorId: '' }));
         }
    }, [grupo.ubicacion, profesores]);


    // --- Filtrar Alumnos por Ubicación y Nivel (¡Importante!) ---
    useEffect(() => {
        if (!grupo.ubicacion || !grupo.nivel) {
            setAlumnosDisponibles([]);
            return;
        }
        // Encuentra alumnos activos, en la ubicación correcta, y CON EL NIVEL SELECCIONADO
        const filtered = alumnos.filter(a =>
            a.estado === 'Activo' &&
            a.ubicacion === grupo.ubicacion &&
            a.nivel === grupo.nivel
        );
        setAlumnosDisponibles(filtered);
         setAlumnosSeleccionados(new Set()); // Limpia selección al cambiar filtro principal

    }, [grupo.ubicacion, grupo.nivel, alumnos]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setGrupo(prev => ({ ...prev, [name]: value }));
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
        // --- VALIDACIÓN ACTUALIZADA ---
        if (!grupo.nombre || !grupo.nivel || !grupo.modalidad || !grupo.ubicacion || !grupo.profesorId || !grupo.dia || !grupo.horaInicio || !grupo.horaFin) {
            alert("Por favor completa todos los campos del grupo, incluyendo día y horas.");
            return;
        }
         if (alumnosSeleccionados.size === 0) {
             if (!window.confirm("¿Estás seguro de crear un grupo sin alumnos?")) {
                 return;
             }
         }
        const grupoFinal = {
            ...grupo,
            alumnoIds: Array.from(alumnosSeleccionados) // Convertir Set a Array
        };
        agregarGrupo(grupoFinal); // Esta función debe incluir la validación de empalme
        navigate("/lista-grupos");
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <input className='usuario' name="nombre" value={grupo.nombre} onChange={handleChange} placeholder="Nombre del Grupo (Ej: Tec-N1-Mat-A)" required />

             <select name="ubicacion" value={grupo.ubicacion} onChange={handleChange} className="usuario" required>
                <option value="Tecnologico">Tecnológico (Interno)</option>
                <option value="Centro de Idiomas">Centro de Idiomas (Externo)</option>
            </select>

            <select name="nivel" value={grupo.nivel} onChange={handleChange} className="usuario" required>
                <option value="">Selecciona un Nivel</option>
                {nivelesDisponibles.map(n => <option key={n.id} value={n.nombre}>{n.nombre}</option>)}
            </select>

            <select name="modalidad" value={grupo.modalidad} onChange={handleChange} className="usuario" required>
                <option value="">Selecciona una Modalidad</option>
                {modalidades.map(m => <option key={m.id} value={m.nombre}>{m.nombre}</option>)}
            </select>

             <select name="profesorId" value={grupo.profesorId} onChange={handleChange} className="usuario" required>
                <option value="">Selecciona un Profesor</option>
                {profesoresDisponibles.map(p => <option key={p.numero_empleado} value={p.numero_empleado}>{p.nombre}</option>)}
            </select>
            
            {/* --- INICIO: CAMPOS DE HORARIO AÑADIDOS --- */}
            <select name="dia" value={grupo.dia} onChange={handleChange} className="usuario" required>
                <option value="">Selecciona el día/días</option>
                {diasSemana.map(dia => (
                    <option key={dia.value} value={dia.value}>{dia.label}</option>
                ))}
            </select>

            <input 
                type="time" 
                name="horaInicio" 
                value={grupo.horaInicio} 
                onChange={handleChange} 
                className="usuario" 
                placeholder="Hora de Inicio"
                required 
            />
            
            <input 
                type="time" 
                name="horaFin" 
                value={grupo.horaFin} 
                onChange={handleChange} 
                className="usuario" 
                placeholder="Hora de Fin"
                required 
            />
            {/* --- FIN: CAMPOS DE HORARIO AÑADIDOS --- */}


            {/* --- Selección de Alumnos (Ejemplo simple con checkboxes) --- */}
            <fieldset style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                <legend>Alumnos para el Grupo (Nivel: {grupo.nivel || 'N/A'}, Ubic: {grupo.ubicacion})</legend>
                {alumnosDisponibles.length > 0 ? (
                    alumnosDisponibles.map(alumno => (
                        <div key={alumno.numero_control} style={{ marginBottom: '5px' }}>
                            <input
                                type="checkbox"
                                id={`alumno-${alumno.numero_control}`}
                                checked={alumnosSeleccionados.has(alumno.numero_control)}
                                onChange={() => handleAlumnoToggle(alumno.numero_control)}
                            />
                            <label htmlFor={`alumno-${alumno.numero_control}`} style={{ marginLeft: '5px' }}>
                                {alumno.nombre} ({alumno.numero_control})
                            </label>
                        </div>
                    ))
                ) : (
                    <p>No hay alumnos disponibles para este nivel y ubicación, o selecciona nivel/ubicación primero.</p>
                )}
            </fieldset>
            <p>Alumnos seleccionados: {alumnosSeleccionados.size}</p>


            <div className="button-list">
                <button className='createbutton' type='submit'>Crear Grupo</button>
            </div>
        </form>
    );
}
export default CrearGrupo;