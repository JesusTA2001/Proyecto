import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Estilos e Layout
import './App.css';
import Layout from './features/Layout/Layout';
import PerfilUsuario from './features/Dashboard/Dashboard'; // usar el archivo Dashboard.js que exporta PerfilUsuario

// Componentes de Listas
import ListaEstudiante from './features/Alumnos/ListaEstudianteMUI';
import ListaProfesor from './features/Profesores/ListaProfesorMUI';
import ListaAdministrador from './features/Administradores/ListaAdministradorMUI';
import ListaNiveles from './features/Niveles/NivelesList';
import ListaModalidad from './features/Modalidad/ModalidadList';
import ListaGrupos from './features/Grupos/GruposList';
import ListaHorarios from './features/Horario/HorarioList';

// CRUD Alumnos (Corregido a PascalCase: CrearAlumno.js)
import CrearAlumno from './features/Alumnos/CrearAlumnoStepper';
import ModificarAlumno from './features/Alumnos/ModificarAlumno';
import EliminarAlumno from './features/Alumnos/EliminarAlumno';
import VerAlumno from './features/Alumnos/VerAlumno';

// CRUD Profesores (Corregido a PascalCase: CrearProfesor.js)
import CrearProfesor from './features/Profesores/CrearProfesor';
import ModificarProfesor from './features/Profesores/ModificarProfesor';
import EliminarProfesor from './features/Profesores/EliminarProfesor';
import VerProfesor from './features/Profesores/VerProfesor';

// CRUD Administradores (Corregido a PascalCase: CrearAdministrador.js, etc.)
import CrearAdministrador from './features/Administradores/CrearAdmin';
import ModificarAdministrador from './features/Administradores/ModificarAdmin';
import EliminarAdministrador from './features/Administradores/EliminarAdmin';
import VerAdministrador from './features/Administradores/VerAdmin';

// CRUD Niveles (Corregido a PascalCase: CrearNivel.js)
import CrearNivel from './features/Niveles/CrearNivel';
import ModificarNivel from './features/Niveles/ModificarNivel';
import EliminarNivel from './features/Niveles/EliminarNivel';

// CRUD Modalidad (Corregido a PascalCase: CrearModalidad.js)
import CrearModalidad from './features/Modalidad/CrearModalidad';
import ModificarModalidad from './features/Modalidad/ModificarModalidad';
import EliminarModalidad from './features/Modalidad/EliminarModalidad';

// CRUD Grupos (Corregido a PascalCase: CrearGrupo.js)
import CrearGrupo from './features/Grupos/CrearGrupo';
import ModificarGrupo from './features/Grupos/ModificarGrupo';
import EliminarGrupo from './features/Grupos/EliminarGrupo';
import VerGrupo from './features/Grupos/VerGrupo';

// NUEVO: Horarios
import VerHorario from './features/Horario/VerHorario'; // RUTA Y NOMBRE CORREGIDOS

// Datos iniciales
import { initialAlumnos } from './data/alumnos';
import { initialProfesores } from './data/profesores';
import { initialAdministradores } from './data/administradores';
import { initialNiveles } from './data/niveles';
import { initialModalidades } from './data/modalidad';
import { initialGrupos } from './data/grupos';

function App() {
  // --- STATE MANAGEMENT (Sin cambios) ---
  const [alumnos, setAlumnos] = useState(initialAlumnos);
  const [profesores, setProfesores] = useState(initialProfesores);
  const [administradores, setAdministradores] = useState(initialAdministradores);
  const [niveles, setNiveles] = useState(initialNiveles);
  const [modalidades, setModalidades] = useState(initialModalidades);
  const [grupos, setGrupos] = useState(initialGrupos);

  // --- Lógica de negocio (Sin cambios) ---
  const toggleEstado = (id, tipo) => {
    switch (tipo) {
      case 'alumno':
        setAlumnos(alumnos.map(a => a.numero_control === id ? { ...a, estado: a.estado === 'Activo' ? 'Inactivo' : 'Activo' } : a));
        break;
      case 'profesor':
        setProfesores(profesores.map(p => p.numero_empleado === id ? { ...p, estado: p.estado === 'Activo' ? 'Inactivo' : 'Activo' } : p));
        break;
      case 'administrador':
        setAdministradores(administradores.map(a => a.numero_empleado === id ? { ...a, estado: a.estado === 'Activo' ? 'Inactivo' : 'Activo' } : a));
        break;
      default:
        break;
    }
  };
  const agregarAlumno = (alumno) => {
    const nuevoId = alumno.ubicacion === 'Tecnologico'
      ? `21${Math.floor(10000 + Math.random() * 90000)}`
      : `22${Math.floor(10000 + Math.random() * 90000)}`;
    setAlumnos([{ ...alumno, numero_control: nuevoId }, ...alumnos]);
  };
  const actualizarAlumno = (alumnoActualizado) =>
    setAlumnos(alumnos.map(a => a.numero_control === alumnoActualizado.numero_control ? alumnoActualizado : a));
  const eliminarAlumno = (numero_control) =>
    setAlumnos(alumnos.filter(a => a.numero_control !== numero_control));
  const agregarProfesor = (profesor) =>
    setProfesores([{ ...profesor, numero_empleado: `PROF-${Date.now()}` }, ...profesores]);
  const actualizarProfesor = (profesorActualizado) =>
    setProfesores(profesores.map(p => p.numero_empleado === profesorActualizado.numero_empleado ? profesorActualizado : p));
  const eliminarProfesor = (numero_empleado) =>
    setProfesores(profesores.filter(p => p.numero_empleado !== numero_empleado));
  const agregarAdministrador = (admin) =>
    setAdministradores([{ ...admin, numero_empleado: `ADM-${Date.now()}` }, ...administradores]);
  const actualizarAdministrador = (adminActualizado) =>
    setAdministradores(administradores.map(a => a.numero_empleado === adminActualizado.numero_empleado ? adminActualizado : a));
  const eliminarAdministrador = (numero_empleado) =>
    setAdministradores(administradores.filter(a => a.numero_empleado !== numero_empleado));
  const agregarNivel = (nivel) =>
    setNiveles([{ ...nivel, id: `NIV-${Date.now()}` }, ...niveles]);
  const actualizarNivel = (nivelActualizado) =>
    setNiveles(niveles.map(n => n.id === nivelActualizado.id ? nivelActualizado : n));
  const eliminarNivel = (id) =>
    setNiveles(niveles.filter(n => n.id !== id));
  const agregarModalidad = (modalidad) =>
    setModalidades([{ ...modalidad, id: `MOD-${Date.now()}` }, ...modalidades]);
  const actualizarModalidad = (modalidadActualizada) =>
    setModalidades(modalidades.map(m => m.id === modalidadActualizada.id ? modalidadActualizada : m));
  const eliminarModalidad = (id) =>
    setModalidades(modalidades.filter(m => m.id !== id));
  const horaANumero = (horaStr) => {
    if (!horaStr || typeof horaStr !== 'string' || !horaStr.includes(':')) {
        return 0; 
    }
    const [hora, minuto] = horaStr.split(':').map(Number);
    return hora + (minuto / 60);
  };
  function checkScheduleConflict(
    allGrupos,
    profesorId,
    dia,
    nuevaHoraInicio,
    nuevaHoraFin,
    grupoIdAExcluir = null
  ) {
      const nuevoInicioNum = horaANumero(nuevaHoraInicio);
      const nuevoFinNum = horaANumero(nuevaHoraFin);
      const gruposDelProfesor = allGrupos.filter(g =>
          g.profesorId === profesorId &&
          g.id !== grupoIdAExcluir
      );
      for (const grupoExistente of gruposDelProfesor) {
          if (grupoExistente.dia.includes(dia) || dia.includes(grupoExistente.dia)) {
              const existenteInicioNum = horaANumero(grupoExistente.horaInicio);
              const existenteFinNum = horaANumero(grupoExistente.horaFin);
              if (nuevoInicioNum < existenteFinNum && nuevoFinNum > existenteInicioNum) {
                  return grupoExistente;
              }
          }
      }
      return null;
  }
  const agregarGrupo = (grupo) => {
    const conflicto = checkScheduleConflict(
      grupos,
      grupo.profesorId,
      grupo.dia,
      grupo.horaInicio,
      grupo.horaFin
    );
    if (conflicto) {
      alert(`Error: Empalme de horario.\nEl profesor ya tiene asignado el grupo "${conflicto.nombre}" (${conflicto.dia} de ${conflicto.horaInicio} a ${conflicto.horaFin}) en ese horario.`);
      return;
    }
    const newId = grupo.id || `GRP-${Date.now()}`;
    setGrupos([{ ...grupo, id: newId }, ...grupos]);
  };
  const actualizarGrupo = (grupoActualizado) => {
    const conflicto = checkScheduleConflict(
      grupos,
      grupoActualizado.profesorId,
      grupoActualizado.dia,
      grupoActualizado.horaInicio,
      grupoActualizado.horaFin,
      grupoActualizado.id
    );
    if (conflicto) {
      alert(`Error: Empalme de horario.\nEl profesor ya tiene asignado el grupo "${conflicto.nombre}" (${conflicto.dia} de ${conflicto.horaInicio} a ${conflicto.horaFin}) en ese horario.`);
      return;
    }
    setGrupos(grupos.map(g => g.id === grupoActualizado.id ? grupoActualizado : g));
  };
  const eliminarGrupo = (id) =>
    setGrupos(grupos.filter(g => g.id !== id));

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Dashboard */}
          <Route
            path="/"
            element={
              <Layout titulo="Bienvenido al Sistema">
                <PerfilUsuario
                  alumnos={alumnos}
                  profesores={profesores}
                  administradores={administradores}
                  niveles={niveles}
                  modalidades={modalidades}
                />
              </Layout>
            }
          />

          {/* Estudiantes */}
          <Route path="/lista-estudiantes" element={<Layout titulo="Gestión de Estudiantes"><ListaEstudiante alumnos={alumnos} toggleEstado={toggleEstado} agregarAlumno={agregarAlumno} actualizarAlumno={actualizarAlumno} eliminarAlumno={eliminarAlumno} /></Layout>} />
          <Route path="/crear-alumno" element={<Layout titulo="Crear Alumno"><CrearAlumno agregarAlumno={agregarAlumno} /></Layout>} />
          <Route path="/modificar-alumno/:id" element={<Layout titulo="Modificar Alumno"><ModificarAlumno alumnos={alumnos} actualizarAlumno={actualizarAlumno} /></Layout>} />
          <Route path="/eliminar-alumno/:id" element={<Layout titulo="Eliminar Alumno"><EliminarAlumno alumnos={alumnos} eliminarAlumno={eliminarAlumno} /></Layout>} />
          <Route path="/ver-alumno/:id" element={<Layout titulo="Detalles del Alumno"><VerAlumno alumnos={alumnos} /></Layout>} />

          {/* Profesores */}
          <Route path="/lista-profesores" element={<Layout titulo="Gestión de Profesores"><ListaProfesor profesores={profesores} toggleEstado={toggleEstado} agregarProfesor={agregarProfesor} actualizarProfesor={actualizarProfesor} eliminarProfesor={eliminarProfesor} /></Layout>} />
          <Route path="/crear-profesor" element={<Layout titulo="Crear Profesor"><CrearProfesor agregarProfesor={agregarProfesor} /></Layout>} />
          <Route path="/modificar-profesor/:id" element={<Layout titulo="Modificar Profesor"><ModificarProfesor profesores={profesores} actualizarProfesor={actualizarProfesor} /></Layout>} />
          <Route path="/eliminar-profesor/:id" element={<Layout titulo="Eliminar Profesor"><EliminarProfesor profesores={profesores} eliminarProfesor={eliminarProfesor} /></Layout>} />
          <Route path="/ver-profesor/:id" element={<Layout titulo="Detalles del Profesor"><VerProfesor profesores={profesores} /></Layout>} />

          {/* Administradores */}
          <Route path="/lista-administradores" element={<Layout titulo="Gestión de Administradores"><ListaAdministrador administradores={administradores} toggleEstado={toggleEstado} agregarAdministrador={agregarAdministrador} actualizarAdministrador={actualizarAdministrador} eliminarAdministrador={eliminarAdministrador} /></Layout>} />
          <Route path="/crear-administrador" element={<Layout titulo="Crear Administrador"><CrearAdministrador agregarAdministrador={agregarAdministrador} /></Layout>} />
          <Route path="/modificar-administrador/:id" element={<Layout titulo="Modificar Administrador"><ModificarAdministrador administradores={administradores} actualizarAdministrador={actualizarAdministrador} /></Layout>} />
          <Route path="/eliminar-administrador/:id" element={<Layout titulo="Eliminar Administrador"><EliminarAdministrador administradores={administradores} eliminarAdministrador={eliminarAdministrador} /></Layout>} />
          <Route path="/ver-administrador/:id" element={<Layout titulo="Detalles del Administrador"><VerAdministrador administradores={administradores} /></Layout>} />

          {/* Niveles y Modalidades */}
          <Route path="/lista-niveles" element={<Layout titulo="Gestión de Niveles"><ListaNiveles niveles={niveles} /></Layout>} />
          <Route path="/crear-nivel" element={<Layout titulo="Crear Nivel"><CrearNivel agregarNivel={agregarNivel} /></Layout>} />
          <Route path="/modificar-nivel/:id" element={<Layout titulo="Modificar Nivel"><ModificarNivel niveles={niveles} actualizarNivel={actualizarNivel} /></Layout>} />
          <Route path="/eliminar-nivel/:id" element={<Layout titulo="Eliminar Nivel"><EliminarNivel niveles={niveles} eliminarNivel={eliminarNivel} /></Layout>} />
          <Route path="/lista-modalidad" element={<Layout titulo="Gestión de Modalidades"><ListaModalidad modalidades={modalidades} /></Layout>} />
          <Route path="/crear-modalidad" element={<Layout titulo="Crear Modalidad"><CrearModalidad agregarModalidad={agregarModalidad} /></Layout>} />
          <Route path="/modificar-modalidad/:id" element={<Layout titulo="Modificar Modalidad"><ModificarModalidad modalidades={modalidades} actualizarModalidad={actualizarModalidad} /></Layout>} />
          <Route path="/eliminar-modalidad/:id" element={<Layout titulo="Eliminar Modalidad"><EliminarModalidad modalidades={modalidades} eliminarModalidad={eliminarModalidad} /></Layout>} />

          {/* Grupos */}
          <Route path="/lista-grupos" element={<Layout titulo="Gestión de Grupos"><ListaGrupos grupos={grupos} profesores={profesores} alumnos={alumnos} /></Layout>} />
          <Route path="/crear-grupo" element={<Layout titulo="Crear Grupo"><CrearGrupo agregarGrupo={agregarGrupo} niveles={niveles} modalidades={modalidades} profesores={profesores} alumnos={alumnos} /></Layout>} />
          <Route path="/ver-grupo/:id" element={<Layout titulo="Detalles del Grupo"><VerGrupo grupos={grupos} profesores={profesores} alumnos={alumnos} /></Layout>} />
          <Route path="/modificar-grupo/:id" element={<Layout titulo="Modificar Grupo"><ModificarGrupo grupos={grupos} actualizarGrupo={actualizarGrupo} niveles={niveles} modalidades={modalidades} profesores={profesores} alumnos={alumnos} /></Layout>} />
          <Route path="/eliminar-grupo/:id" element={<Layout titulo="Eliminar Grupo"><EliminarGrupo grupos={grupos} eliminarGrupo={eliminarGrupo} /></Layout>} />

          {/* Horarios */}
          <Route path="/lista-horarios" element={<Layout titulo="Horarios de Profesores"><ListaHorarios profesores={profesores} /></Layout>} />
          <Route path="/ver-horario/:id" element={<Layout titulo="Ver Horario del Profesor"><VerHorario profesores={profesores} grupos={grupos} /></Layout>} />

          {/* Redirección */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;