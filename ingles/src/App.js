import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Estilos e Layout
import './App.css';
import Layout from './Layout/Layout';
import PerfilUsuario from './perfil/perfil-usuario';

// Componentes de Listas
import ListaEstudiante from './listaEstudiante/listaEstudiante';
import ListaProfesor from './listaProfesor/listaProfesor';
import ListaAdministrador from './listaAdministrador/listaAdministrador';
import ListaNiveles from './listaNiveles/listaNiveles';
import ListaModalidad from './listaModalidad/listaModalidad';
import ListaGrupos from './listaGrupos/ListaGrupos';
import ListaHorarios from './listaHorario/listaHorario'; // NUEVO

// CRUD Alumnos
import CrearAlumno from './CRUD/Alumnos/crearAlumno';
import ModificarAlumno from './CRUD/Alumnos/modificarAlumno';
import EliminarAlumno from './CRUD/Alumnos/eliminarAlumno';
import VerAlumno from './CRUD/Alumnos/verAlumno';

// CRUD Profesores
import CrearProfesor from './CRUD/Profesores/crearProfesor';
import ModificarProfesor from './CRUD/Profesores/modificarProfesor';
import EliminarProfesor from './CRUD/Profesores/eliminarProfesor';
import VerProfesor from './CRUD/Profesores/verProfesor';

// CRUD Administradores
import CrearAdministrador from './CRUD/Administrador/CrearAdministrador';
import ModificarAdministrador from './CRUD/Administrador/modificarAdministrador';
import EliminarAdministrador from './CRUD/Administrador/eliminarAdministrador';
import VerAdministrador from './CRUD/Administrador/verAdministrador';

// CRUD Niveles
import CrearNivel from './CRUD/Niveles/crearNivel';
import ModificarNivel from './CRUD/Niveles/modificarNivel';
import EliminarNivel from './CRUD/Niveles/eliminarNivel';

// CRUD Modalidad
import CrearModalidad from './CRUD/Modalidad/crearModalidad';
import ModificarModalidad from './CRUD/Modalidad/modificarModalidad';
import EliminarModalidad from './CRUD/Modalidad/eliminarModalidad';

// CRUD Grupos
import CrearGrupo from './CRUD/Grupos/CrearGrupo';
import ModificarGrupo from './CRUD/Grupos/modificarGrupo';
import EliminarGrupo from './CRUD/Grupos/eliminarGrupo';
import VerGrupo from './CRUD/Grupos/verGrupo';

// NUEVO: Horarios
import VerHorario from './CRUD/Horarios/verHorario';

// Datos iniciales
import { initialAlumnos } from './data/alumnos';
import { initialProfesores } from './data/profesores';
import { initialAdministradores } from './data/administradores';
import { initialNiveles } from './data/niveles';
import { initialModalidades } from './data/modalidad';
import { initialGrupos } from './data/grupos';

function App() {
  // --- STATE MANAGEMENT ---
  const [alumnos, setAlumnos] = useState(initialAlumnos);
  const [profesores, setProfesores] = useState(initialProfesores);
  const [administradores, setAdministradores] = useState(initialAdministradores);
  const [niveles, setNiveles] = useState(initialNiveles);
  const [modalidades, setModalidades] = useState(initialModalidades);
  const [grupos, setGrupos] = useState(initialGrupos);

  // --- Cambiar estado ---
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

  // --- CRUD Alumnos ---
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

  // --- CRUD Profesores ---
  const agregarProfesor = (profesor) =>
    setProfesores([{ ...profesor, numero_empleado: `PROF-${Date.now()}` }, ...profesores]);
  const actualizarProfesor = (profesorActualizado) =>
    setProfesores(profesores.map(p => p.numero_empleado === profesorActualizado.numero_empleado ? profesorActualizado : p));
  const eliminarProfesor = (numero_empleado) =>
    setProfesores(profesores.filter(p => p.numero_empleado !== numero_empleado));

  // --- CRUD Administradores ---
  const agregarAdministrador = (admin) =>
    setAdministradores([{ ...admin, numero_empleado: `ADM-${Date.now()}` }, ...administradores]);
  const actualizarAdministrador = (adminActualizado) =>
    setAdministradores(administradores.map(a => a.numero_empleado === adminActualizado.numero_empleado ? adminActualizado : a));
  const eliminarAdministrador = (numero_empleado) =>
    setAdministradores(administradores.filter(a => a.numero_empleado !== numero_empleado));

  // --- CRUD Niveles ---
  const agregarNivel = (nivel) =>
    setNiveles([{ ...nivel, id: `NIV-${Date.now()}` }, ...niveles]);
  const actualizarNivel = (nivelActualizado) =>
    setNiveles(niveles.map(n => n.id === nivelActualizado.id ? nivelActualizado : n));
  const eliminarNivel = (id) =>
    setNiveles(niveles.filter(n => n.id !== id));

  // --- CRUD Modalidad ---
  const agregarModalidad = (modalidad) =>
    setModalidades([{ ...modalidad, id: `MOD-${Date.now()}` }, ...modalidades]);
  const actualizarModalidad = (modalidadActualizada) =>
    setModalidades(modalidades.map(m => m.id === modalidadActualizada.id ? modalidadActualizada : m));
  const eliminarModalidad = (id) =>
    setModalidades(modalidades.filter(m => m.id !== id));

  // --- INICIO: FUNCIONES DE AYUDA PARA VALIDACIÓN DE HORARIOS ---

  /**
   * Convierte una hora "HH:MM" a un valor numérico (ej: "09:30" -> 9.5)
   */
  const horaANumero = (horaStr) => {
    // Si la hora no está definida (grupo antiguo o error), devuelve 0 para evitar fallos
    if (!horaStr || typeof horaStr !== 'string' || !horaStr.includes(':')) {
        return 0; 
    }
    const [hora, minuto] = horaStr.split(':').map(Number);
    return hora + (minuto / 60);
  };

  /**
   * Revisa si un nuevo bloque de horario choca con los existentes de un profesor.
   * Devuelve el grupo en conflicto si lo encuentra, o null si no hay conflicto.
   */
  function checkScheduleConflict(
    allGrupos,
    profesorId,
    dia,
    nuevaHoraInicio,
    nuevaHoraFin,
    grupoIdAExcluir = null // ID del grupo que estamos modificando (para no compararlo consigo mismo)
  ) {
      // 1. Convertir las nuevas horas a números
      const nuevoInicioNum = horaANumero(nuevaHoraInicio);
      const nuevoFinNum = horaANumero(nuevaHoraFin);

      // 2. Encontrar los grupos existentes del MISMO profesor
      const gruposDelProfesor = allGrupos.filter(g =>
          g.profesorId === profesorId && // Mismo profesor
          g.id !== grupoIdAExcluir       // No es el mismo grupo que estamos editando
      );

      // 3. Revisar cada grupo existente
      for (const grupoExistente of gruposDelProfesor) {
          
          // 4. Si los días coinciden (o se solapan)
          // Lógica simple: "Lunes" incluye "Lunes", "Lunes-Miercoles" incluye "Lunes"
          if (grupoExistente.dia.includes(dia) || dia.includes(grupoExistente.dia)) {
              
              // 5. Convertir horas existentes a números
              const existenteInicioNum = horaANumero(grupoExistente.horaInicio);
              const existenteFinNum = horaANumero(grupoExistente.horaFin);

              // 6. Lógica de colisión (Si el nuevo bloque se superpone con el existente)
              // (El nuevo inicia ANTES de que el viejo termine) Y (El nuevo termina DESPUÉS de que el viejo inicie)
              if (nuevoInicioNum < existenteFinNum && nuevoFinNum > existenteInicioNum) {
                  // ¡Conflicto!
                  return grupoExistente; // Devuelve el grupo con el que choca
              }
          }
      }

      return null; // No hay conflictos
  }

  // --- FIN: FUNCIONES DE AYUDA PARA VALIDACIÓN DE HORARIOS ---


  // --- CRUD Grupos ---
  
  // --- MODIFICADO: agregarGrupo ahora incluye validación ---
  const agregarGrupo = (grupo) => {
    // VALIDACIÓN DE EMPALME
    const conflicto = checkScheduleConflict(
      grupos,
      grupo.profesorId,
      grupo.dia,
      grupo.horaInicio,
      grupo.horaFin
      // No se pasa ID a excluir, porque es un grupo nuevo
    );

    if (conflicto) {
      alert(`Error: Empalme de horario.\nEl profesor ya tiene asignado el grupo "${conflicto.nombre}" (${conflicto.dia} de ${conflicto.horaInicio} a ${conflicto.horaFin}) en ese horario.`);
      return; // Detiene la ejecución y no agrega el grupo
    }
    // FIN VALIDACIÓN

    const newId = grupo.id || `GRP-${Date.now()}`;
    setGrupos([{ ...grupo, id: newId }, ...grupos]);
  };

  // --- MODIFICADO: actualizarGrupo ahora incluye validación ---
  const actualizarGrupo = (grupoActualizado) => {
    // VALIDACIÓN DE EMPALME
    const conflicto = checkScheduleConflict(
      grupos,
      grupoActualizado.profesorId,
      grupoActualizado.dia,
      grupoActualizado.horaInicio,
      grupoActualizado.horaFin,
      grupoActualizado.id // Excluimos este mismo grupo de la comprobación
    );

    if (conflicto) {
      alert(`Error: Empalme de horario.\nEl profesor ya tiene asignado el grupo "${conflicto.nombre}" (${conflicto.dia} de ${conflicto.horaInicio} a ${conflicto.horaFin}) en ese horario.`);
      return; // Detiene la ejecución y no actualiza el grupo
    }
    // FIN VALIDACIÓN

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
          <Route path="/lista-estudiantes" element={<Layout titulo="Gestión de Estudiantes"><ListaEstudiante alumnos={alumnos} toggleEstado={toggleEstado} /></Layout>} />
          <Route path="/crear-alumno" element={<Layout titulo="Crear Alumno"><CrearAlumno agregarAlumno={agregarAlumno} /></Layout>} />
          <Route path="/modificar-alumno/:id" element={<Layout titulo="Modificar Alumno"><ModificarAlumno alumnos={alumnos} actualizarAlumno={actualizarAlumno} /></Layout>} />
          <Route path="/eliminar-alumno/:id" element={<Layout titulo="Eliminar Alumno"><EliminarAlumno alumnos={alumnos} eliminarAlumno={eliminarAlumno} /></Layout>} />
          <Route path="/ver-alumno/:id" element={<Layout titulo="Detalles del Alumno"><VerAlumno alumnos={alumnos} /></Layout>} />

          {/* Profesores */}
          <Route path="/lista-profesores" element={<Layout titulo="Gestión de Profesores"><ListaProfesor profesores={profesores} toggleEstado={toggleEstado} /></Layout>} />
          <Route path="/crear-profesor" element={<Layout titulo="Crear Profesor"><CrearProfesor agregarProfesor={agregarProfesor} /></Layout>} />
          <Route path="/modificar-profesor/:id" element={<Layout titulo="Modificar Profesor"><ModificarProfesor profesores={profesores} actualizarProfesor={actualizarProfesor} /></Layout>} />
          <Route path="/eliminar-profesor/:id" element={<Layout titulo="Eliminar Profesor"><EliminarProfesor profesores={profesores} eliminarProfesor={eliminarProfesor} /></Layout>} />
          <Route path="/ver-profesor/:id" element={<Layout titulo="Detalles del Profesor"><VerProfesor profesores={profesores} /></Layout>} />

          {/* Administradores */}
          <Route path="/lista-administradores" element={<Layout titulo="Gestión de Administradores"><ListaAdministrador administradores={administradores} toggleEstado={toggleEstado} /></Layout>} />
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