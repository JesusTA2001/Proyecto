import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import '../../hojas-de-estilo/listaEstudiante.css';

// Componente de multi-selección (puedes moverlo a un archivo separado e importarlo)
function MultiSelectAlumnos({ alumnos, seleccionados, onToggle }) {
    const [filtro, setFiltro] = useState('');
    const alumnosFiltrados = alumnos.filter(a =>
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

function ModificarGrupo({ grupos, actualizarGrupo, niveles, modalidades, profesores, alumnos }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [grupo, setGrupo] = useState(null); // Estado para el grupo a editar
    const [alumnosSeleccionados, setAlumnosSeleccionados] = useState(new Set());
    const [nivelesDisponibles, setNivelesDisponibles] = useState([]);
    const [profesoresDisponibles, setProfesoresDisponibles] = useState([]);
    const [alumnosDisponibles, setAlumnosDisponibles] = useState([]);

    // --- Cargar datos del grupo ---
    useEffect(() => {
        const grupoAEditar = grupos.find(g => g.id === id);
        if (grupoAEditar) {
            setGrupo(grupoAEditar);
            setAlumnosSeleccionados(new Set(grupoAEditar.alumnoIds)); // Cargar IDs de alumnos
        } else {
            navigate("/lista-grupos"); // Si no existe, volver
        }
    }, [id, grupos, navigate]);

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
        // No reseteamos nivel aquí para permitir ver el nivel actual aunque se cambie la ubicación
    }, [grupo?.ubicacion, niveles]);

     // --- Filtrar Profesores por Ubicación ---
    useEffect(() => {
         if (!grupo) return;
         const filtered = profesores.filter(p => p.estado === 'Activo' && (p.ubicacion === grupo.ubicacion || p.ubicacion === 'Ambos'));
         setProfesoresDisponibles(filtered);
    }, [grupo?.ubicacion, profesores]);


    // --- Filtrar Alumnos Disponibles ---
    useEffect(() => {
        if (!grupo) return;
        // Muestra alumnos que:
        // 1. Están en la ubicación correcta, son activos Y están en el nivel correcto
        // 2. O ya están seleccionados (para que puedas verlos y quitarlos si es necesario)
        const filtered = alumnos.filter(a =>
            (a.estado === 'Activo' &&
             a.ubicacion === grupo.ubicacion &&
             a.nivel === grupo.nivel) ||
            alumnosSeleccionados.has(a.numero_control) // Incluye los ya seleccionados
        );
         // Eliminar duplicados si un alumno seleccionado también cumple el filtro
         const uniqueAlumnos = Array.from(new Map(filtered.map(a => [a.numero_control, a])).values());
        setAlumnosDisponibles(uniqueAlumnos);
        
        // No reseteamos seleccionados, ya que estamos modificando
    }, [grupo?.ubicacion, grupo?.nivel, alumnos, alumnosSeleccionados]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setGrupo(prev => {
            const newState = { ...prev, [name]: value };
             // Si cambia ubicación o nivel, limpia la selección de alumnos
             // para forzar a re-seleccionar de la nueva lista
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
        const grupoFinal = {
            ...grupo,
            alumnoIds: Array.from(alumnosSeleccionados)
        };
        actualizarGrupo(grupoFinal);
        navigate("/lista-grupos");
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
                {nivelesDisponibles.map(n => <option key={n.id} value={n.nombre}>{n.nombre}</option>)}
            </select>

            <label>Modalidad:</label>
            <select name="modalidad" value={grupo.modalidad} onChange={handleChange} className="usuario" required>
                <option value="">Selecciona una Modalidad</option>
                {modalidades.map(m => <option key={m.id} value={m.nombre}>{m.nombre}</option>)}
            </select>

            <label>Profesor:</label>
             <select name="profesorId" value={grupo.profesorId} onChange={handleChange} className="usuario" required>
                <option value="">Selecciona un Profesor</option>
                {profesoresDisponibles.map(p => <option key={p.numero_empleado} value={p.numero_empleado}>{p.nombre} ({p.numero_empleado})</option>)}
            </select>

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