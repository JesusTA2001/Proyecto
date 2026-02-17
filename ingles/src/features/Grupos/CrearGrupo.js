import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import api from '../../api/axios';
import CrearPeriodo from '../Periodos/CrearPeriodo';
import '../../styles/listaEstudiante.css';

// Función para obtener nombre completo
const getNombreCompleto = (persona) => {
    if (!persona) return 'N/A';
    const apellidoPaterno = persona.apellidoPaterno || '';
    const apellidoMaterno = persona.apellidoMaterno || '';
    const nombre = persona.nombre || '';
    return `${apellidoPaterno} ${apellidoMaterno} ${nombre}`.trim();
};

// Recibe props: agregarGrupo, niveles, periodos, profesores, alumnos
function CrearGrupo({ agregarGrupo, niveles, periodos, profesores, alumnos, onPeriodoCreado }) {
    const navigate = useNavigate();
    const [openCrearPeriodo, setOpenCrearPeriodo] = useState(false);
    const [periodosLocal, setPeriodosLocal] = useState(periodos);
    const [grupo, setGrupo] = useState({
        nombre: '',
        nivel: '',
        periodo: '',
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
    const [filtroAlumno, setFiltroAlumno] = useState(''); // Filtro de búsqueda

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
        let filtered = [];
        if (grupo.ubicacion === 'Tecnologico') {
            // Niveles 0-6 para Tecnológico (Intro, Nivel1-6)
            filtered = niveles.filter(n => n.id >= 0 && n.id <= 6);
        } else if (grupo.ubicacion === 'Centro de Idiomas') {
            // Todos los niveles para Centro de Idiomas
            filtered = niveles;
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
        console.log('🔍 Efecto de carga de alumnos disparado:', { 
            ubicacion: grupo.ubicacion, 
            nivel: grupo.nivel,
            nivelesDisponibles: niveles.length
        });

        if (!grupo.ubicacion || !grupo.nivel) {
            console.log('⚠️ Falta ubicacion o nivel');
            setAlumnosDisponibles([]);
            return;
        }
        
        // Cargar alumnos disponibles desde el endpoint
        const cargarAlumnosDisponibles = async () => {
            try {
                console.log('🔎 Buscando nivel:', grupo.nivel, 'en niveles:', niveles);
                
                // Buscar el id_Nivel correspondiente al nivel seleccionado
                const nivelObj = niveles.find(n => n.nombre === grupo.nivel);
                
                console.log('✅ Nivel encontrado:', nivelObj);
                
                if (!nivelObj) {
                    console.log('❌ No se encontró el nivel');
                    setAlumnosDisponibles([]);
                    return;
                }

                const params = {
                    ubicacion: grupo.ubicacion,
                    nivel: nivelObj.id
                };

                console.log('📡 Llamando API con params:', params);
                // Usar /alumnos/disponibles/list para obtener SOLO estudiantes sin grupo
                const response = await api.get('/alumnos/disponibles/list', { params });
                console.log('📥 Respuesta recibida:', response.data.length, 'alumnos disponibles');
                
                // Mapear la respuesta para que tenga el formato esperado
                const alumnosMapeados = response.data.map(a => ({
                    numero_control: a.nControl,
                    nombre: a.nombre,
                    apellidoPaterno: a.apellidoPaterno,
                    apellidoMaterno: a.apellidoMaterno,
                    email: a.email,
                    ubicacion: a.ubicacion,
                    nivel: a.nivel_nombre || `Nivel ${a.id_Nivel}`,
                    estado: a.estado === 'activo' ? 'Activo' : 'Inactivo'
                }));
                
                console.log('✅ Alumnos mapeados:', alumnosMapeados.length);
                setAlumnosDisponibles(alumnosMapeados);
                setAlumnosSeleccionados(new Set()); // Limpia selección al cambiar filtro principal
            } catch (error) {
                console.error('❌ Error al cargar alumnos disponibles:', error);
                console.error('Detalles del error:', error.response?.data);
                setAlumnosDisponibles([]);
            }
        };

        cargarAlumnosDisponibles();

    }, [grupo.ubicacion, grupo.nivel, niveles]);

    // Sincronizar periodosLocal cuando cambien los periodos del prop
    useEffect(() => {
        if (periodos && periodos.length > 0) {
            setPeriodosLocal(periodos);
        }
    }, [periodos]);

    // Cargar periodos si no se reciben como prop
    useEffect(() => {
        const cargarPeriodos = async () => {
            if (!periodos || periodos.length === 0) {
                try {
                    const response = await api.get('/periodos');
                    const periodosMapeados = response.data.map(p => ({
                        id: p.id_Periodo,
                        id_Periodo: p.id_Periodo,
                        nombre: p.descripcion,
                        descripcion: p.descripcion,
                        año: p.año,
                        fecha_inicio: p.fecha_inicio,
                        fecha_fin: p.fecha_fin
                    }));
                    setPeriodosLocal(periodosMapeados);
                    console.log('✅ Periodos cargados desde API:', periodosMapeados.length);
                } catch (error) {
                    console.error('Error al cargar periodos:', error);
                }
            }
        };
        cargarPeriodos();
    }, []);


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

    const handlePeriodoCreado = async (nuevoPeriodo) => {
        console.log('✅ Periodo guardado:', nuevoPeriodo);
        
        // Recargar todos los periodos desde la API para asegurar datos actualizados
        try {
            const response = await api.get('/periodos');
            const periodosMapeados = response.data.map(p => ({
                id: p.id_Periodo,
                id_Periodo: p.id_Periodo,
                nombre: p.descripcion,
                descripcion: p.descripcion,
                año: p.año,
                fecha_inicio: p.fecha_inicio,
                fecha_fin: p.fecha_fin
            }));
            setPeriodosLocal(periodosMapeados);
            console.log('✅ Periodos actualizados:', periodosMapeados.length);
        } catch (error) {
            console.error('Error al recargar periodos:', error);
        }
        
        setOpenCrearPeriodo(false);
        
        // Notificar al componente padre si existe la función
        if (onPeriodoCreado) {
            onPeriodoCreado(nuevoPeriodo);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // --- VALIDACIÓN ACTUALIZADA ---
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
        <>
        <form onSubmit={handleSubmit} className="form-container" style={{ maxWidth: '100%', margin: 0 }}>
            <Grid container spacing={2}>

                {/* ── SECCIÓN: Información General ── */}
                <Grid item xs={12}>
                    <Divider sx={{ mb: 1 }}>
                        <Typography variant="caption" sx={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>
                            Información General
                        </Typography>
                    </Divider>
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField label="Nombre del Grupo" name="nombre" value={grupo.nombre} onChange={handleChange} fullWidth required size="small" margin="dense" placeholder="Ej: Tec-N1-Mat-A" />
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Campus</InputLabel>
                        <Select name="ubicacion" value={grupo.ubicacion} onChange={handleChange} label="Campus">
                            <MenuItem value="Tecnologico">Tecnológico (Interno)</MenuItem>
                            <MenuItem value="Centro de Idiomas">Centro de Idiomas (Externo)</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Nivel</InputLabel>
                        <Select name="nivel" value={grupo.nivel} onChange={handleChange} label="Nivel">
                            <MenuItem value="">Selecciona un Nivel</MenuItem>
                            {nivelesDisponibles.map(n => <MenuItem key={n.id} value={n.nombre}>{n.nombre}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FormControl fullWidth size="small" style={{ flex: 1 }}>
                            <InputLabel>Periodo</InputLabel>
                            <Select name="periodo" value={grupo.periodo} onChange={handleChange} label="Periodo">
                                <MenuItem value="">Selecciona un Periodo</MenuItem>
                                {(periodosLocal || []).map(p => <MenuItem key={p.id || p.id_Periodo} value={p.id || p.id_Periodo}>{p.nombre || p.descripcion}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <Tooltip title="Crear nuevo periodo" arrow>
                            <IconButton
                                onClick={() => setOpenCrearPeriodo(true)}
                                size="small"
                                sx={{ backgroundColor: 'var(--color-primary)', color: 'white', '&:hover': { backgroundColor: 'var(--color-primary-hover)' }, width: '36px', height: '36px', flexShrink: 0 }}
                            >
                                <AddIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </div>
                </Grid>
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Profesor</InputLabel>
                        <Select name="profesorId" value={grupo.profesorId} onChange={handleChange} label="Profesor">
                            <MenuItem value="">Selecciona un Profesor</MenuItem>
                            {profesoresDisponibles.map(p => <MenuItem key={p.numero_empleado} value={p.numero_empleado}>{getNombreCompleto(p)}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>

                {/* ── SECCIÓN: Horario ── */}
                <Grid item xs={12}>
                    <Divider sx={{ mt: 1, mb: 1 }}>
                        <Typography variant="caption" sx={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>
                            Horario
                        </Typography>
                    </Divider>
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Día(s)</InputLabel>
                        <Select name="dia" value={grupo.dia} onChange={handleChange} label="Día(s)">
                            <MenuItem value="">Selecciona el día/días</MenuItem>
                            {diasSemana.map(dia => (
                                <MenuItem key={dia.value} value={dia.value}>{dia.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6} md={4}>
                    <TextField
                        type="time" label="Hora Inicio" name="horaInicio"
                        value={grupo.horaInicio} onChange={handleChange}
                        fullWidth size="small" InputLabelProps={{ shrink: true }}
                        inputProps={{ min: "07:00", max: "23:00", step: 1800 }}
                    />
                </Grid>
                <Grid item xs={6} md={4}>
                    <TextField
                        type="time" label="Hora Fin" name="horaFin"
                        value={grupo.horaFin} onChange={handleChange}
                        fullWidth size="small" InputLabelProps={{ shrink: true }}
                        inputProps={{ min: "07:00", max: "23:00", step: 1800 }}
                    />
                </Grid>

                {/* ── SECCIÓN: Alumnos ── */}
                <Grid item xs={12}>
                    <Divider sx={{ mt: 1, mb: 1 }}>
                        <Typography variant="caption" sx={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>
                            Selección de Alumnos
                        </Typography>
                    </Divider>
                </Grid>

                <Grid item xs={12} md={8}>
                    <div style={{
                        border: '1.5px solid #c084db',
                        borderRadius: 10,
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(138,47,131,0.08)'
                    }}>
                        <div style={{
                            background: 'linear-gradient(90deg, var(--color-primary) 0%, #b05dab 100%)',
                            color: '#fff',
                            padding: '8px 14px',
                            fontWeight: 600,
                            fontSize: 13,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <span>Alumnos disponibles — Nivel: {grupo.nivel || '—'} | Campus: {grupo.ubicacion}</span>
                            <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: 20, padding: '2px 10px', fontSize: 12 }}>
                                {alumnosSeleccionados.size} seleccionados
                            </span>
                        </div>
                        <div style={{ padding: '10px 14px', background: '#faf5ff' }}>
                            <input
                                type="text"
                                placeholder="🔍 Buscar por nombre o N° Control..."
                                className="search-input"
                                style={{ width: '100%', marginBottom: 8 }}
                                value={filtroAlumno}
                                onChange={(e) => setFiltroAlumno(e.target.value)}
                            />
                        </div>
                        <div style={{ maxHeight: '42vh', overflowY: 'auto', padding: '4px 14px 12px' }}>
                            {alumnosDisponibles.filter(a => {
                                if (!filtroAlumno) return true;
                                const f = filtroAlumno.toLowerCase();
                                return String(a.nombre || '').toLowerCase().includes(f) || String(a.numero_control || '').toLowerCase().includes(f);
                            }).length > 0 ? (
                                alumnosDisponibles.filter(a => {
                                    if (!filtroAlumno) return true;
                                    const f = filtroAlumno.toLowerCase();
                                    return String(a.nombre || '').toLowerCase().includes(f) || String(a.numero_control || '').toLowerCase().includes(f);
                                }).map(alumno => (
                                    <div key={alumno.numero_control} style={{
                                        display: 'flex', alignItems: 'center', gap: 8,
                                        padding: '5px 6px', borderRadius: 6, marginBottom: 3,
                                        background: alumnosSeleccionados.has(alumno.numero_control) ? 'rgba(138,47,131,0.10)' : 'transparent',
                                        cursor: 'pointer', transition: 'background 0.15s'
                                    }}
                                        onClick={() => handleAlumnoToggle(alumno.numero_control)}
                                    >
                                        <input
                                            type="checkbox"
                                            id={`alumno-${alumno.numero_control}`}
                                            checked={alumnosSeleccionados.has(alumno.numero_control)}
                                            onChange={() => handleAlumnoToggle(alumno.numero_control)}
                                            style={{ accentColor: 'var(--color-primary)', width: 15, height: 15, cursor: 'pointer' }}
                                            onClick={e => e.stopPropagation()}
                                        />
                                        <label htmlFor={`alumno-${alumno.numero_control}`} style={{ cursor: 'pointer', fontSize: 13, flex: 1 }}>
                                            <strong>{getNombreCompleto(alumno)}</strong>
                                            <span style={{ color: '#888', marginLeft: 6, fontSize: 12 }}>({alumno.numero_control})</span>
                                        </label>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: '#999', fontSize: 13, marginTop: 8, textAlign: 'center' }}>
                                    {grupo.nivel && grupo.ubicacion ? 'Sin alumnos disponibles para este nivel y campus.' : 'Selecciona campus y nivel para ver alumnos.'}
                                </p>
                            )}
                        </div>
                    </div>
                </Grid>

                <Grid item xs={12} md={4}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #f5f0ff 0%, #ede9fe 100%)',
                            border: '1px solid #c084db', borderRadius: 10, padding: '14px 16px'
                        }}>
                            <Typography sx={{ fontWeight: 700, fontSize: 13, color: 'var(--color-primary)', mb: 1 }}>Resumen</Typography>
                            <div style={{ fontSize: 13, color: '#555', lineHeight: 2 }}>
                                <div>👥 Seleccionados: <strong>{alumnosSeleccionados.size}</strong></div>
                                <div>📋 Disponibles: <strong>{alumnosDisponibles.length}</strong></div>
                                <div style={{ color: alumnosSeleccionados.size > 20 ? '#dc2626' : '#16a34a', fontWeight: 600 }}>
                                    {alumnosSeleccionados.size > 20 ? '⚠️ Límite excedido (máx. 20)' : `✅ Cupo: ${alumnosSeleccionados.size}/20`}
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="contained"
                            onClick={autoCompletar20}
                            sx={{ backgroundColor: 'var(--color-primary)', '&:hover': { backgroundColor: 'var(--color-primary-hover)' }, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                        >
                            Autocompletar a 20
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => setAlumnosSeleccionados(new Set())}
                            sx={{ borderColor: '#dc2626', color: '#dc2626', '&:hover': { borderColor: '#b91c1c', background: '#fef2f2' }, borderRadius: 2, textTransform: 'none' }}
                        >
                            Limpiar selección
                        </Button>
                    </div>
                </Grid>

                <Grid item xs={12}>
                    <Divider sx={{ mb: 1 }} />
                    <div className="button-list" style={{ justifyContent: 'flex-end' }}>
                        <button className='createbutton' type='submit'>Crear Grupo</button>
                    </div>
                </Grid>
            </Grid>
        </form>

        {/* Modal para crear periodo */}
        <CrearPeriodo
            open={openCrearPeriodo}
            onClose={() => setOpenCrearPeriodo(false)}
            onPeriodoCreado={handlePeriodoCreado}
        />
    </>
    );
}
export default CrearGrupo;