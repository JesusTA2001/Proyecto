import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../hojas-de-estilo/listaEstudiante.css';
// --- LÍNEAS DE IMPORTACIÓN QUE FALTABAN ---
import { generoOptions, carrerasOptions } from '../../data/mapping';
import { initialModalidades } from '../../data/modalidad';
import { initialNiveles } from '../../data/niveles';

function CrearAlumno({ agregarAlumno }) {
  const navigate = useNavigate();
  const [alumno, setAlumno] = useState({
    nombre: '', correo: '', genero: '', curp: '', telefono: '', direccion: '', modalidad: '', nivel: '', carrera: '', estado: 'Activo'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlumno({ ...alumno, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    agregarAlumno(alumno);
    navigate("/lista-estudiantes");
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
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

      <select name="carrera" value={alumno.carrera} onChange={handleChange} className="usuario" required>
          <option value="">Selecciona una carrera</option>
          {carrerasOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
          ))}
      </select>
      
      <select name="modalidad" value={alumno.modalidad} onChange={handleChange} className="usuario" required>
          <option value="">Selecciona una modalidad</option>
          {initialModalidades.map(mod => <option key={mod.id} value={mod.nombre}>{mod.nombre}</option>)}
      </select>
      
      <select name="nivel" value={alumno.nivel} onChange={handleChange} className="usuario" required>
          <option value="">Selecciona un nivel</option>
          {initialNiveles.map(niv => <option key={niv.id} value={niv.nombre}>{niv.nombre}</option>)}
      </select>

      <div className="button-list">
        <button className='createbutton' type='submit'>Crear Alumno</button>
      </div>
    </form>
  );
}

export default CrearAlumno;