import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import api from '../../api/axios';
import '../../styles/listaEstudiante.css';

// Función para obtener nombre completo
const getNombreCompleto = (persona) => {
    if (!persona) return 'N/A';
    const apellidoPaterno = persona.apellidoPaterno || '';
    const apellidoMaterno = persona.apellidoMaterno || '';
    const nombre = persona.nombre || '';
    return `${apellidoPaterno} ${apellidoMaterno} ${nombre}`.trim();
};

// Componente de multi-selección (puedes moverlo a un archivo separado e importarlo)
function MultiSelectAlumnos({ alumnos, seleccionados, onToggle }) {
    return (
        <fieldset style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px', maxHeight: '300px', overflowY: 'auto' }}>
            <legend>Alumnos Disponibles ({seleccionados.size} seleccionados)</legend>
            {(alumnos || []).length > 0 ? (
                (alumnos || []).map(alumno => (
                    <div key={alumno.numero_control} style={{ marginBottom: '5px' }}>
                        <input
                            type="checkbox"
                            id={`alumno-${alumno.numero_control}`}
                            checked={seleccionados.has(alumno.numero_control)}
                            onChange={() => onToggle(alumno.numero_control)}
                        />
                        <label htmlFor={`alumno-${alumno.numero_control}`} style={{ marginLeft: '5px', cursor: 'pointer' }}>
                            {getNombreCompleto(alumno)} ({alumno.numero_control})
                        </label>
                    </div>
                ))
            ) : (
                <p>No hay alumnos disponibles para este nivel y ubicación.</p>
            )}
        </fieldset>
    );
}

function ModificarGrupo({ grupos, grupo: grupoProp, actualizarGrupo, niveles, periodos, profesores, alumnos, onClose }) {
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
        console.log('🔍 ModificarGrupo - Cargando datos del grupo');
        console.log('grupoProp:', grupoProp);
        console.log('grupos:', grupos);
        console.log('id desde ruta:', id);
        
        // Si se recibe el grupo directamente (cuando se usa en modal), úsalo
        if (grupoProp) {
            console.log('📦 Usando grupoProp:', grupoProp);
            console.log('👥 alumnoIds recibidos:', grupoProp.alumnoIds);
            
            setGrupo({ 
                periodo: grupoProp.id_Periodo || '', 
                dia: grupoProp.dia || '', 
                horaInicio: grupoProp.horaInicio || '', 
                horaFin: grupoProp.horaFin || '', 
                ...grupoProp 
            });
            // Cargar alumnos usando alumnoIds del grupo
            const alumnoIdsArray = Array.isArray(grupoProp.alumnoIds) ? grupoProp.alumnoIds : [];
            console.log('✅ Estableciendo alumnos seleccionados:', alumnoIdsArray);
            setAlumnosSeleccionados(new Set(alumnoIdsArray));
            return;
        }
        // Si no, intenta buscar en el array 'grupos' usando el id de la ruta
        if (grupos && id) {
            const grupoAEditar = grupos.find(g => g.id === id);
            if (grupoAEditar) {
                console.log('📦 Usando grupo del array:', grupoAEditar);
                console.log('👥 alumnoIds recibidos:', grupoAEditar.alumnoIds);
                
                setGrupo({ 
                    periodo: grupoAEditar.id_Periodo || '', 
                    dia: grupoAEditar.dia || '', 
                    horaInicio: grupoAEditar.horaInicio || '', 
                    horaFin: grupoAEditar.horaFin || '', 
                    ...grupoAEditar 
                });
                const alumnoIdsArray = Array.isArray(grupoAEditar.alumnoIds) ? grupoAEditar.alumnoIds : [];
                console.log('✅ Estableciendo alumnos seleccionados:', alumnoIdsArray);
                setAlumnosSeleccionados(new Set(alumnoIdsArray));
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
        let filtered = [];
        if (grupo.ubicacion === 'Tecnologico') {
            // Niveles 0-6 para Tecnológico (Intro, Nivel1-6)
            filtered = niveles.filter(n => n.id >= 0 && n.id <= 6);
        } else if (grupo.ubicacion === 'Centro de Idiomas') {
            // Todos los niveles para Centro de Idiomas
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
        if (!grupo || !grupo.ubicacion || !grupo.nivel) {
            setAlumnosDisponibles([]);
            return;
        }
        
        const cargarAlumnosDisponibles = async () => {
            try {
                // Buscar el id_Nivel correspondiente al nivel seleccionado
                const nivelObj = niveles.find(n => n.nombre === grupo.nivel);
                
                if (!nivelObj) {
                    setAlumnosDisponibles([]);
                    return;
                }

                const params = {
                    ubicacion: grupo.ubicacion,
                    nivel: nivelObj.id
                };

                const response = await api.get('/alumnos/disponibles/list', { params });
                
                // Mapear la respuesta para que tenga el formato esperado
                const alumnosMapeados = response.data.map(a => ({
                    numero_control: a.nControl,
                    nombre: `${a.apellidoPaterno} ${a.apellidoMaterno} ${a.nombre}`.trim(),
                    apellidoPaterno: a.apellidoPaterno,
                    apellidoMaterno: a.apellidoMaterno,
                    email: a.email,
                    ubicacion: a.ubicacion,
                    nivel: a.nivel_nombre || `Nivel ${a.id_Nivel}`,
                    estado: a.estado === 'activo' ? 'Activo' : 'Inactivo'
                }));
                
                // Agregar alumnos que ya están seleccionados en el grupo (para que no desaparezcan)
                const alumnosYaSeleccionados = (alumnos || []).filter(a => 
                    alumnosSeleccionados.has(a.numero_control)
                );
                
                // Combinar y eliminar duplicados
                const todosLosAlumnos = [...alumnosMapeados, ...alumnosYaSeleccionados];
                const uniqueAlumnos = Array.from(new Map(todosLosAlumnos.map(a => [a.numero_control, a])).values());
                
                setAlumnosDisponibles(uniqueAlumnos);
            } catch (error) {
                console.error('❌ Error al cargar alumnos disponibles:', error);
                setAlumnosDisponibles([]);
            }
        };

        cargarAlumnosDisponibles();
        
    }, [grupo?.ubicacion, grupo?.nivel, niveles, alumnosSeleccionados]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Validar y ajustar minutos a :00 o :30 para campos de hora
        if ((name === 'horaInicio' || name === 'horaFin') && value) {
            const [horas, minutos] = value.split(':');
            const horaNum = parseInt(horas);
            
            // Validar rango de horas: 7am (07:00) a 11pm (23:00)
            if (horaNum < 7 || horaNum > 23) {
                alert('El horario debe estar entre 7:00 AM y 11:00 PM');
                return;
            }
            
            let minutosAjustados = minutos;
            
            // Redondear minutos a :00 o :30
            const min = parseInt(minutos);
            if (min < 15) {
                minutosAjustados = '00';
            } else if (min < 45) {
                minutosAjustados = '30';
            } else {
                // Si es :45 o más, avanzar a la siguiente hora con :00
                const nuevaHora = (horaNum + 1) % 24;
                if (nuevaHora < 7 || nuevaHora > 23) {
                    alert('El horario debe estar entre 7:00 AM y 11:00 PM');
                    return;
                }
                setGrupo(prev => ({ ...prev, [name]: `${nuevaHora.toString().padStart(2, '0')}:00` }));
                return;
            }
            
            setGrupo(prev => ({ ...prev, [name]: `${horas}:${minutosAjustados}` }));
            return;
        }
        
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
        if (!grupo.nombre || !grupo.nivel || !grupo.periodo || !grupo.ubicacion || !grupo.dia || !grupo.horaInicio || !grupo.horaFin) {
            alert("Por favor completa todos los campos del grupo, incluyendo día y horas.");
            return;
        }
        
        // Validar que la hora de fin sea mayor que la hora de inicio
        if (grupo.horaInicio && grupo.horaFin) {
            const [horaInicioH, horaInicioM] = grupo.horaInicio.split(':').map(Number);
            const [horaFinH, horaFinM] = grupo.horaFin.split(':').map(Number);
            const minutosInicio = horaInicioH * 60 + horaInicioM;
            const minutosFin = horaFinH * 60 + horaFinM;
            
            if (minutosFin <= minutosInicio) {
                alert("La hora de fin debe ser mayor que la hora de inicio.");
                return;
            }
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
                {/* Campo oculto para mantener el ID sin mostrarlo al usuario */}
                <input type="hidden" name="id" value={grupo.id} />
                <Grid item xs={12}>
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
                    <Select name="periodo" value={grupo.periodo} onChange={handleChange} fullWidth size="small" displayEmpty>
                        <MenuItem value="">Selecciona un Periodo</MenuItem>
                        {(periodos || []).map(p => <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>)}
                    </Select>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Select name="profesorId" value={grupo.profesorId} onChange={handleChange} fullWidth size="small" displayEmpty>
                        <MenuItem value="">Selecciona un Profesor</MenuItem>
                        {(profesoresDisponibles || []).map(p => <MenuItem key={p.numero_empleado} value={p.numero_empleado}>{getNombreCompleto(p)} ({p.numero_empleado})</MenuItem>)}
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
                    <TextField 
                        type="time" 
                        label="Hora Inicio" 
                        name="horaInicio" 
                        value={grupo.horaInicio} 
                        onChange={handleChange} 
                        fullWidth 
                        size="small" 
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                            min: "07:00",
                            max: "23:00",
                            step: 1800
                        }}
                    />
                </Grid>
                <Grid item xs={6} md={4}>
                    <TextField 
                        type="time" 
                        label="Hora Fin" 
                        name="horaFin" 
                        value={grupo.horaFin} 
                        onChange={handleChange} 
                        fullWidth 
                        size="small" 
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                            min: "07:00",
                            max: "23:00",
                            step: 1800
                        }}
                    />
                </Grid>

                <Grid item xs={12} md={8}>
                    <fieldset style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px', maxHeight: '48vh', overflowY: 'auto' }}>
                        <legend>Alumnos Disponibles ({alumnosSeleccionados.size} seleccionados)</legend>
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
                            <p>No hay alumnos disponibles para este nivel y ubicación.</p>
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