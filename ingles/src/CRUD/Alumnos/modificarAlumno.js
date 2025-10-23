import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../../hojas-de-estilo/listaEstudiante.css';
import { generoOptions, carrerasOptions } from '../../data/mapping';
import { initialModalidades } from '../../data/modalidad';
import { initialNiveles } from '../../data/niveles'; // Importa la lista completa

function ModificarAlumno({ alumnos, actualizarAlumno }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alumno, setAlumno] = useState(null); // Estado para los datos del alumno a editar
  const [nivelesDisponibles, setNivelesDisponibles] = useState([]); // Estado para niveles filtrados

  // --- PRIMER useEffect: Carga los datos iniciales del alumno ---
  useEffect(() => {
    const alumnoAEditar = alumnos.find(a => a.numero_control === id);
    if (alumnoAEditar) {
      // Asegurarse de que el campo 'ubicacion' exista, si no, asignar 'Tecnologico' por defecto
      // y que carrera no sea undefined, sino '' o 'No Aplica'
      setAlumno({
          ubicacion: 'Tecnologico', // Valor por defecto si no existe
          carrera: '', // Valor inicial por defecto si no existe o es undefined
          ...alumnoAEditar,
          // Corregir carrera si es undefined o null después de combinar
          carrera: alumnoAEditar.carrera || (alumnoAEditar.ubicacion === 'Centro de Idiomas' ? 'No Aplica' : ''),
      });
    } else {
      // Si no se encuentra el alumno, redirige a la lista
      navigate("/lista-estudiantes");
    }
  }, [id, alumnos, navigate]); // Depende de id, alumnos y navigate

  // --- SEGUNDO useEffect: Filtra los niveles cuando cambia la ubicación del alumno cargado ---
  useEffect(() => {
    // Solo ejecuta si ya tenemos los datos del alumno
    if (!alumno) return;

    console.log("Ubicación del alumno:", alumno.ubicacion); // Log
    let filteredNiveles = [];
    const tecNivelIdsPattern = /^N[0-6]$/; // Expresión regular para N0 a N6

    if (alumno.ubicacion === 'Tecnologico') {
      filteredNiveles = initialNiveles.filter(n => tecNivelIdsPattern.test(n.id));
      console.log("Niveles para Tecnologico:", filteredNiveles); // Log
    } else if (alumno.ubicacion === 'Centro de Idiomas') {
      filteredNiveles = initialNiveles; // Muestra todos para NODO
      console.log("Niveles para Centro de Idiomas:", filteredNiveles); // Log
    }
    setNivelesDisponibles(filteredNiveles);

    // Limpia el nivel seleccionado si al cargar/cambiar ubicación, ya no está en la lista
    if (alumno.nivel && !filteredNiveles.some(n => n.nombre === alumno.nivel)) {
      console.log("Limpiando nivel porque no está disponible:", alumno.nivel); // Log
      // No modificamos el estado directamente aquí para evitar bucles si ubicacion/nivel son dependencias
      // Lo manejaremos en handleChange si es necesario, o al cargar.
      // Se podría limpiar aquí si el efecto SÓLO dependiera de la ubicación
      // setAlumno(prev => ({ ...prev, nivel: '' }));
    }
  }, [alumno?.ubicacion]); // <-- Depende solo de la ubicación del alumno cargado


  // --- TERCER useEffect: Ajusta la carrera si es necesario (cuando cambia ubicación o nivel) ---
  // (Este efecto es más para asegurar consistencia, ya que el campo carrera siempre está visible)
   useEffect(() => {
    if (!alumno) return; // Esperar a que cargue el alumno

    if (alumno.ubicacion === 'Tecnologico' && alumno.carrera === 'No Aplica') {
      // Si se cambia a Tecnológico y tenía 'No Aplica', limpiar para seleccionar
       setAlumno(prev => ({ ...prev, carrera: '' }));
    }
    // No necesitamos poner 'No Aplica' automáticamente aquí,
    // lo manejaremos en handleSubmit si el usuario no selecciona nada en NODO.

  }, [alumno?.ubicacion, alumno?.nivel]); // Depende de ubicación y nivel

  // --- Manejador de cambios ---
  const handleChange = (e) => {
    const { name, value } = e.target;

    setAlumno(prev => {
        const newState = { ...prev, [name]: value };

        // Si cambia la ubicación, verifica si el nivel actual es válido
        if (name === 'ubicacion') {
            const tecNivelIdsPattern = /^N[0-6]$/;
            let nivelActualEsValido = false;
            if (value === 'Tecnologico') {
                nivelActualEsValido = initialNiveles.some(n => n.nombre === newState.nivel && tecNivelIdsPattern.test(n.id));
            } else if (value === 'Centro de Idiomas') {
                nivelActualEsValido = initialNiveles.some(n => n.nombre === newState.nivel); // Todos son válidos
            }

            if (!nivelActualEsValido) {
                console.log("Reseteando nivel al cambiar ubicación"); // Log
                newState.nivel = ''; // Resetea nivel
            }
            // Ajustar carrera al cambiar ubicación si es necesario
            if (value === 'Tecnologico' && newState.carrera === 'No Aplica') {
                 newState.carrera = '';
            } else if (value === 'Centro de Idiomas' && !newState.carrera) {
                 // Si se cambia a NODO y no hay carrera, dejar vacío para que elijan o se asigne 'No Aplica' al guardar
                 // newState.carrera = ''; // Opcional: podrías poner 'No Aplica' por defecto
            }
        }
        return newState;
    });
  };

  // --- Manejador de envío ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!alumno) return; // Asegurarse que alumno no sea null

    const finalAlumno = { ...alumno };

    // Validar carrera para Tecnológico
    if (alumno.ubicacion === 'Tecnologico' && !finalAlumno.carrera) {
      alert('Debes seleccionar una carrera para alumnos del Tecnológico.');
      return;
    }
    // Si es NODO y no seleccionó carrera (está vacío), asignar 'No Aplica'
    if (alumno.ubicacion === 'Centro de Idiomas' && !finalAlumno.carrera) {
      finalAlumno.carrera = 'No Aplica';
    }

    actualizarAlumno(finalAlumno);
    navigate("/lista-estudiantes");
  };

  // Muestra mensaje de carga mientras el estado 'alumno' es null
  if (!alumno) return <p className="loading-message">Cargando datos del alumno...</p>;

  // Renderiza el formulario una vez que 'alumno' tiene datos
  return (
    <form onSubmit={handleSubmit} className="form-container">
      {/* ... (campos nombre, correo, genero, curp, telefono, direccion) ... */}
       <input className='usuario' name="numero_control" value={alumno.numero_control} readOnly disabled title="El número de control no se puede modificar"/>
       <input className='usuario' name="nombre" value={alumno.nombre} onChange={handleChange} placeholder="Nombre Completo" required />
       <input className='usuario' name="correo" type="email" value={alumno.correo} onChange={handleChange} placeholder="Correo Electrónico" required />
       <select name="genero" value={alumno.genero} onChange={handleChange} className="usuario" required>
         <option value="">Selecciona un género</option>
         {generoOptions.map(option => (
           <option key={option.value} value={option.value}>{option.label}</option>
         ))}
       </select>
       <input className='usuario' name="curp" value={alumno.curp} onChange={handleChange} placeholder="CURP" />
       <input className='usuario' name="telefono" value={alumno.telefono} onChange={handleChange} placeholder="Teléfono" />
       <input className='usuario' name="direccion" value={alumno.direccion} onChange={handleChange} placeholder="Dirección" />


      {/* --- Select de Ubicación --- */}
      <select name="ubicacion" value={alumno.ubicacion} onChange={handleChange} className="usuario" required>
        <option value="Tecnologico">Tecnológico (Interno)</option>
        <option value="Centro de Idiomas">Centro de Idiomas (Externo)</option>
      </select>

      {/* --- Select de Modalidad --- */}
      <select name="modalidad" value={alumno.modalidad} onChange={handleChange} className="usuario" required>
        <option value="">Selecciona una modalidad</option>
        {initialModalidades.map(mod => <option key={mod.id} value={mod.nombre}>{mod.nombre}</option>)}
      </select>

      {/* --- Select de Nivel (filtrado) --- */}
      <select name="nivel" value={alumno.nivel} onChange={handleChange} className="usuario" required>
        <option value="">Selecciona un nivel</option>
         {/* Mapea sobre el estado filtrado 'nivelesDisponibles' */}
         {nivelesDisponibles.map(niv => (
             <option key={niv.id} value={niv.nombre}>{niv.nombre}</option>
         ))}
      </select>

       {/* --- Select de Carrera (Siempre visible, requerido condicionalmente) --- */}
       <select
            name="carrera"
            // Asegurarse de que el valor no sea 'No Aplica' si la ubicación es Tecnológico al inicio
            value={alumno.ubicacion === 'Tecnologico' && alumno.carrera === 'No Aplica' ? '' : alumno.carrera}
            onChange={handleChange}
            className="usuario"
            required={alumno.ubicacion === 'Tecnologico'}
        >
            <option value="">
                {alumno.ubicacion === 'Tecnologico'
                  ? 'Selecciona una carrera *'
                  : 'Selecciona carrera (si aplica)'}
            </option>
            {carrerasOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
            {/* Solo muestra "No Aplica" si la ubicación es Centro de Idiomas */}
            {alumno.ubicacion === 'Centro de Idiomas' && (
                <option value="No Aplica">No Aplica / Externo</option>
            )}
        </select>

      <div className="button-list">
        <button className='modifybutton' type='submit'>Guardar Cambios</button>
      </div>
    </form>
  );
}

export default ModificarAlumno;