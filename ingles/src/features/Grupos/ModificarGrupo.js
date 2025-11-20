import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
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

    const autoCompletarHasta20 = () => {
        const disponibles = alumnosDisponibles.map(a => a.numero_control).filter(id => !alumnosSeleccionados.has(id));
        const seleccion = new Set(Array.from(alumnosSeleccionados));
        for (let id of disponibles) {
            if (seleccion.size >= 20) break;
            seleccion.add(id);
        }
        setAlumnosSeleccionados(seleccion);
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
        <form onSubmit={handleSubmit} className="form-container" style={{ maxWidth: '100%', margin: 0 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <TextField label="ID del Grupo" name="id" value={grupo.id} fullWidth InputProps={{ readOnly: true }} size="small" margin="dense" />
                </Grid>
                <Grid item xs={12} md={8}>
                    <TextField label="Nombre del Grupo" name="nombre" value={grupo.nombre} onChange={handleChange} fullWidth required size="small" margin="dense" />
                </Grid>

                <Grid item xs={12} md={4}>
                    <Select name="ubicacion" value={grupo.ubicacion} onChange={handleChange} fullWidth size="small">
                        <MenuItem value="Tecnologico">Tecnológico (Interno)</MenuItem>
                        <MenuItem value="Centro de Idiomas">Centro de Idiomas (Externo)</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Select name="nivel" value={grupo.nivel} onChange={handleChange} fullWidth size="small" displayEmpty>
                        <MenuItem value="">Selecciona un Nivel</MenuItem>
                        { (nivelesDisponibles || []).map(n => <MenuItem key={n.id} value={n.nombre}>{n.nombre}</MenuItem>)}
                    </Select>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Select name="modalidad" value={grupo.modalidad} onChange={handleChange} fullWidth size="small" displayEmpty>
                        <MenuItem value="">Selecciona una Modalidad</MenuItem>
                        {(modalidades || []).map(m => <MenuItem key={m.id} value={m.nombre}>{m.nombre}</MenuItem>)}
                    </Select>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Select name="profesorId" value={grupo.profesorId} onChange={handleChange} fullWidth size="small" displayEmpty>
                        <MenuItem value="">Selecciona un Profesor</MenuItem>
                        {(profesoresDisponibles || []).map(p => <MenuItem key={p.numero_empleado} value={p.numero_empleado}>{p.nombre} ({p.numero_empleado})</MenuItem>)}
                    </Select>
                </Grid>
                <Grid item xs={12} md={6} />

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
                        <legend>Alumnos Disponibles ({alumnosSeleccionados.size} seleccionados)</legend>
                        <input
                            type="text"
                            placeholder="Buscar alumno por nombre o N° Control..."
                            className="usuario"
                            style={{ width: '100%', marginBottom: '10px' }}
                            onChange={(e) => { const val = e.target.value; /* simple filter handled by alumnosDisponibles in useEffect */ const filtered = (alumnos || []).filter(a => (a.nombre.toLowerCase().includes(val.toLowerCase()) || a.numero_control.toLowerCase().includes(val.toLowerCase())) && (a.estado === 'Activo' && a.ubicacion === grupo.ubicacion && a.nivel === grupo.nivel || alumnosSeleccionados.has(a.numero_control))); setAlumnosDisponibles(filtered); }}
                        />
                        {alumnosDisponibles.length > 0 ? (
                            alumnosDisponibles.map(alumno => (
                                <div key={alumno.numero_control} style={{ marginBottom: '6px' }}>
                                    <input
                                        type="checkbox"
                                        id={`alumno-${alumno.numero_control}`}
                                        checked={alumnosSeleccionados.has(alumno.numero_control)}
                                        onChange={() => handleAlumnoToggle(alumno.numero_control)}
                                    />
                                    <label htmlFor={`alumno-${alumno.numero_control}`} style={{ marginLeft: '8px', cursor: 'pointer' }}>
                                        {alumno.nombre} ({alumno.numero_control})
                                    </label>
                                </div>
                            ))
                        ) : (
                            <p>No hay alumnos disponibles para este nivel y ubicación, o que coincidan con la búsqueda.</p>
                        )}
                    </fieldset>
                </Grid>

                <Grid item xs={12} md={4}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <Button variant="outlined" onClick={autoCompletarHasta20}>Autocompletar hasta 20</Button>
                        <p style={{ margin: 0, fontSize: 13, color: '#555' }}>Puedes desmarcar alumnos para eliminarlos del grupo.</p>
                    </div>
                </Grid>

                <Grid item xs={12}>
                    <div className="button-list" style={{ justifyContent: 'flex-end' }}>
                        <button className='modifybutton' type='submit'>Guardar Cambios</button>
                    </div>
                </Grid>
            </Grid>
        </form>
    );
}
export default ModificarGrupo;