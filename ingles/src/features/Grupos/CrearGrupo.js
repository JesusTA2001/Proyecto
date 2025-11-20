import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
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

    const autoCompletar20 = () => {
        const disponibles = alumnosDisponibles.map(a => a.numero_control);
        const seleccion = new Set(Array.from(alumnosSeleccionados));
        for (let id of disponibles) {
            if (seleccion.size >= 20) break;
            seleccion.add(id);
        }
        setAlumnosSeleccionados(seleccion);
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
        <form onSubmit={handleSubmit} className="form-container" style={{ maxWidth: '100%', margin: 0 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField label="Nombre del Grupo" name="nombre" value={grupo.nombre} onChange={handleChange} fullWidth required size="small" margin="dense" placeholder="Ej: Tec-N1-Mat-A" />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Select name="ubicacion" value={grupo.ubicacion} onChange={handleChange} fullWidth size="small">
                        <MenuItem value="Tecnologico">Tecnológico (Interno)</MenuItem>
                        <MenuItem value="Centro de Idiomas">Centro de Idiomas (Externo)</MenuItem>
                    </Select>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Select name="nivel" value={grupo.nivel} onChange={handleChange} fullWidth size="small" displayEmpty>
                        <MenuItem value="">Selecciona un Nivel</MenuItem>
                        {nivelesDisponibles.map(n => <MenuItem key={n.id} value={n.nombre}>{n.nombre}</MenuItem>)}
                    </Select>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Select name="modalidad" value={grupo.modalidad} onChange={handleChange} fullWidth size="small" displayEmpty>
                        <MenuItem value="">Selecciona una Modalidad</MenuItem>
                        {modalidades.map(m => <MenuItem key={m.id} value={m.nombre}>{m.nombre}</MenuItem>)}
                    </Select>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Select name="profesorId" value={grupo.profesorId} onChange={handleChange} fullWidth size="small" displayEmpty>
                        <MenuItem value="">Selecciona un Profesor</MenuItem>
                        {profesoresDisponibles.map(p => <MenuItem key={p.numero_empleado} value={p.numero_empleado}>{p.nombre}</MenuItem>)}
                    </Select>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Select name="dia" value={grupo.dia} onChange={handleChange} fullWidth size="small" displayEmpty>
                        <MenuItem value="">Selecciona el día/días</MenuItem>
                        {diasSemana.map(dia => (
                            <MenuItem key={dia.value} value={dia.value}>{dia.label}</MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={6} md={4}>
                    <TextField type="time" label="Hora Inicio" name="horaInicio" value={grupo.horaInicio} onChange={handleChange} fullWidth size="small" InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={6} md={4}>
                    <TextField type="time" label="Hora Fin" name="horaFin" value={grupo.horaFin} onChange={handleChange} fullWidth size="small" InputLabelProps={{ shrink: true }} />
                </Grid>

                <Grid item xs={12} md={8}>
                    <fieldset style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px', maxHeight: '48vh', overflowY: 'auto' }}>
                        <legend>Alumnos para el Grupo (Nivel: {grupo.nivel || 'N/A'}, Ubic: {grupo.ubicacion})</legend>
                        {alumnosDisponibles.length > 0 ? (
                            alumnosDisponibles.map(alumno => (
                                <div key={alumno.numero_control} style={{ marginBottom: '6px' }}>
                                    <input
                                        type="checkbox"
                                        id={`alumno-${alumno.numero_control}`}
                                        checked={alumnosSeleccionados.has(alumno.numero_control)}
                                        onChange={() => handleAlumnoToggle(alumno.numero_control)}
                                    />
                                    <label htmlFor={`alumno-${alumno.numero_control}`} style={{ marginLeft: '8px' }}>
                                        {alumno.nombre} ({alumno.numero_control})
                                    </label>
                                </div>
                            ))
                        ) : (
                            <p>No hay alumnos disponibles para este nivel y ubicación, o selecciona nivel/ubicación primero.</p>
                        )}
                    </fieldset>
                    <p style={{ marginTop: 8 }}>Alumnos seleccionados: {alumnosSeleccionados.size}</p>
                </Grid>

                <Grid item xs={12} md={4}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <Button variant="outlined" onClick={autoCompletar20}>Autocompletar a 20 alumnos</Button>
                        <div style={{ marginTop: 8 }}>
                            <p style={{ margin: 0, fontSize: 14 }}>Acciones:</p>
                            <p style={{ margin: 0, fontSize: 13, color: '#555' }}>Puedes seleccionar/desmarcar alumnos individualmente. Usa autocompletar para llenar hasta 20.</p>
                        </div>
                    </div>
                </Grid>

                <Grid item xs={12}>
                    <div className="button-list" style={{ justifyContent: 'flex-end' }}>
                        <button className='createbutton' type='submit'>Crear Grupo</button>
                    </div>
                </Grid>
            </Grid>
        </form>
    );
}
export default CrearGrupo;