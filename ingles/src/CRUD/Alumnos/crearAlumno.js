import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../../hojas-de-estilo/listaEstudiante.css';
import { generoOptions, carrerasOptions } from '../../data/mapping';
import { initialModalidades } from '../../data/modalidad';
import { initialNiveles } from '../../data/niveles'; // Importa la lista completa

function CrearAlumno({ agregarAlumno }) {
  const navigate = useNavigate();
  const [alumno, setAlumno] = useState({
    nombre: '', correo: '', genero: '', curp: '', telefono: '', direccion: '',
    modalidad: '', nivel: '', carrera: '', estado: 'Activo',
    ubicacion: 'Tecnologico' // Valor inicial Tecnologico
  });
  // El campo carrera siempre se muestra, ya no necesitamos 'showCarrera'
  const [nivelesDisponibles, setNivelesDisponibles] = useState([]);

  // --- useEffect: Filtra los niveles cuando cambia la ubicación ---
  useEffect(() => {
    console.log("Ubicación cambió a:", alumno.ubicacion); // Log
    let filteredNiveles = [];
    const tecNivelIdsPattern = /^N[0-6]$/; // Expresión regular para N0 a N6

    if (alumno.ubicacion === 'Tecnologico') {
      // Solo niveles Intro a Nivel 6
      filteredNiveles = initialNiveles.filter(n => tecNivelIdsPattern.test(n.id));
      console.log("Niveles para Tecnologico:", filteredNiveles); // Log
    } else if (alumno.ubicacion === 'Centro de Idiomas') {
      // Todos los niveles
      filteredNiveles = initialNiveles;
      console.log("Niveles para Centro de Idiomas:", filteredNiveles); // Log
       // Si cambiamos a NODO y la carrera estaba seleccionada (y no era 'No Aplica'),
       // la mantenemos, si no, la limpiamos para que elijan o seleccionen 'No Aplica'.
       if (alumno.carrera && alumno.carrera !== 'No Aplica') {
           // Mantener la carrera si ya tenía una
       } else {
            setAlumno(prev => ({ ...prev, carrera: '' })); // Limpiar para elegir o seleccionar 'No Aplica'
       }
    }

    setNivelesDisponibles(filteredNiveles);

    // Limpia el nivel seleccionado si ya no está en la nueva lista
    if (alumno.nivel && !filteredNiveles.some(n => n.nombre === alumno.nivel)) {
        console.log("Limpiando nivel porque no está disponible:", alumno.nivel); // Log
        setAlumno(prev => ({ ...prev, nivel: '' }));
    }
  }, [alumno.ubicacion]); // <-- Solo depende de la ubicación


  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlumno(prevAlumno => ({
      ...prevAlumno,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalAlumno = { ...alumno };

    // Validar carrera para Tecnológico
    if (alumno.ubicacion === 'Tecnologico' && !finalAlumno.carrera) {
        alert('Debes seleccionar una carrera para alumnos del Tecnológico.');
        return;
    }
    // Si es NODO y no seleccionó carrera, asignar 'No Aplica'
    if (alumno.ubicacion === 'Centro de Idiomas' && !finalAlumno.carrera) {
        finalAlumno.carrera = 'No Aplica';
    }


    agregarAlumno(finalAlumno);
    navigate("/lista-estudiantes");
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      {/* ... (campos nombre, correo, genero, curp, telefono, direccion) ... */}
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
         {nivelesDisponibles.map(niv => (
             <option key={niv.id} value={niv.nombre}>{niv.nombre}</option>
         ))}
      </select>

       {/* --- Select de Carrera (Siempre visible, requerido condicionalmente) --- */}
       <select
            name="carrera"
            value={alumno.carrera}
            onChange={handleChange}
            className="usuario"
            // El atributo 'required' ahora depende de la ubicación
            required={alumno.ubicacion === 'Tecnologico'}
        >
            <option value="">
                {/* Texto dinámico */}
                {alumno.ubicacion === 'Tecnologico'
                  ? 'Selecciona una carrera *'
                  : 'Selecciona carrera (si aplica)'}
            </option>
            {/* Opciones de carrera normales */}
            {carrerasOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
            {/* Opción adicional para NODO */}
            {alumno.ubicacion === 'Centro de Idiomas' && (
                <option value="No Aplica">No Aplica / Externo</option>
            )}
        </select>

      <div className="button-list">
        <button className='createbutton' type='submit'>Crear Alumno</button>
      </div>
    </form>
  );
}

export default CrearAlumno;