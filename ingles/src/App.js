import React, { useState, useMemo } from 'react'; // Importa useMemo
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Estilos e Layout
import './App.css';
import Layout from './features/Layout/Layout';
import PerfilUsuario from './features/Dashboard/Dashboard'; // usar el archivo Dashboard.js que exporta PerfilUsuario
import Login from './features/Auth/Login';

// Componentes de Listas
import ListaEstudiante from './features/Alumnos/ListaEstudianteMUI';
import ListaProfesor from './features/Profesores/ListaProfesorMUI';
import ListaAdministrador from './features/Administradores/ListaAdministradorMUI';
import ListaNiveles from './features/Niveles/NivelesList';
import ListaModalidad from './features/Modalidad/ModalidadList';
import ListaGrupos from './features/Grupos/ListaGruposMUI';
import ListaHorarios from './features/Horario/ListaHorarioMUI';

// Dashboard Profesor
import DashboardProfesor from './features/Dashboard/DashboardProfesor';
import LayoutProfesor from './features/Layout/LayoutProfesor';
import AsignarCalificaciones from './features/Profesores/AsignarCalificaciones';
// --- 1. IMPORTAR NUEVO COMPONENTE DE ASISTENCIA ---
import ControlAsistencia from './features/Profesores/ControlAsistencia';
import MisGrupos from './features/Profesores/MisGrupos';

// CRUD Alumnos
import CrearAlumno from './features/Alumnos/CrearAlumnoStepper';

// CRUD Profesores
import CrearProfesor from './features/Profesores/crearProfesor';

// CRUD Administradores
import CrearAdministrador from './features/Administradores/CrearAdmin';

// CRUD Niveles
import CrearNivel from './features/Niveles/CrearNivel';
import ModificarNivel from './features/Niveles/ModificarNivel';
import EliminarNivel from './features/Niveles/EliminarNivel';

// CRUD Modalidad
import CrearModalidad from './features/Modalidad/CrearModalidad';
import ModificarModalidad from './features/Modalidad/ModificarModalidad';
import EliminarModalidad from './features/Modalidad/EliminarModalidad';

// CRUD Grupos
import CrearGrupo from './features/Grupos/CrearGrupo';
import ModificarGrupo from './features/Grupos/ModificarGrupo';
import EliminarGrupo from './features/Grupos/EliminarGrupo';
import VerGrupo from './features/Grupos/VerGrupo';

// Horarios
import VerHorario from './features/Horario/VerHorario'; 

// reportes
import ReporteProfesores from './features/Reportes/ReporteProfesores';
import ReporteEstudiantes from './features/Reportes/ReporteEstudiantes';
import ReporteGrupos from './features/Reportes/ReporteGrupos';

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

  // --- Autenticación (Sin cambios) ---
  const getCurrentUser = () => {
    try {
      const raw = localStorage.getItem('currentUser');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  };

  // --- Lógica para datos de profesor (Sin cambios) ---
  const currentUser = useMemo(() => getCurrentUser(), []);

  const profesorLogueado = useMemo(() => {
    if (!currentUser || currentUser.role !== 'profesor' || !currentUser.numero_empleado) {
      return null;
    }
    return profesores.find(p => p.numero_empleado === currentUser.numero_empleado) || null;
  }, [currentUser, profesores]);

  const { gruposAsignados, alumnosAsignados } = useMemo(() => {
    if (!profesorLogueado) {
      return { gruposAsignados: [], alumnosAsignados: [] };
    }
    const asignados = grupos.filter(g => g.profesorId === profesorLogueado.numero_empleado);
    const alumnoIdsSet = new Set();
    asignados.forEach(g => {
      (g.alumnoIds || []).forEach(id => alumnoIdsSet.add(id));
    });
    const alumnosDeEsosGrupos = alumnos.filter(a => alumnoIdsSet.has(a.numero_control));
    return { gruposAsignados: asignados, alumnosAsignados: alumnosDeEsosGrupos };
  }, [profesorLogueado, grupos, alumnos]);
  
  // --- Fin lógica profesor ---


  const HomeOrRedirect = () => {
    const user = currentUser; 
    if (!user) return <Navigate to="/login" replace />;
    if (user.role === 'profesor') return <Navigate to="/dashboard-profesor" replace />;
    return (
      <Layout>
        <PerfilUsuario
          alumnos={alumnos}
          profesores={profesores}
          administradores={administradores}
          niveles={niveles}
          modalidades={modalidades}
          grupos={grupos}
        />
      </Layout>
    );
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* ... (Rutas Admin, Login, Estudiantes, Profesores, Administradores, Niveles, Modalidad, Grupos, Horarios... SIN CAMBIOS) ... */}
          
          {/* Página raíz */}
          <Route path="/" element={<HomeOrRedirect />} />
          <Route path="/login" element={<Login />} />

          {/* Estudiantes */}
          <Route path="/lista-estudiantes" element={<Layout><ListaEstudiante alumnos={alumnos} toggleEstado={toggleEstado} agregarAlumno={agregarAlumno} actualizarAlumno={actualizarAlumno} eliminarAlumno={eliminarAlumno} /></Layout>} />
          <Route path="/crear-alumno" element={<Layout><CrearAlumno agregarAlumno={agregarAlumno} /></Layout>} />

          {/* Profesores */}
          <Route path="/lista-profesores" element={<Layout><ListaProfesor profesores={profesores} toggleEstado={toggleEstado} agregarProfesor={agregarProfesor} actualizarProfesor={actualizarProfesor} eliminarProfesor={eliminarProfesor} /></Layout>} />
          <Route path="/crear-profesor" element={<Layout><CrearProfesor agregarProfesor={agregarProfesor} /></Layout>} />

          {/* Administradores */}
          <Route path="/lista-administradores" element={<Layout><ListaAdministrador administradores={administradores} toggleEstado={toggleEstado} agregarAdministrador={agregarAdministrador} actualizarAdministrador={actualizarAdministrador} eliminarAdministrador={eliminarAdministrador} /></Layout>} />
          <Route path="/crear-administrador" element={<Layout><CrearAdministrador agregarAdministrador={agregarAdministrador} /></Layout>} />

          {/* Niveles y Modalidades */}
          <Route path="/lista-niveles" element={<Layout><ListaNiveles niveles={niveles} /></Layout>} />
          <Route path="/crear-nivel" element={<Layout><CrearNivel agregarNivel={agregarNivel} /></Layout>} />
          <Route path="/modificar-nivel/:id" element={<Layout><ModificarNivel niveles={niveles} actualizarNivel={actualizarNivel} /></Layout>} />
          <Route path="/eliminar-nivel/:id" element={<Layout><EliminarNivel niveles={niveles} eliminarNivel={eliminarNivel} /></Layout>} />
          <Route path="/lista-modalidad" element={<Layout><ListaModalidad modalidades={modalidades} /></Layout>} />
          <Route path="/crear-modalidad" element={<Layout><CrearModalidad agregarModalidad={agregarModalidad} /></Layout>} />
          <Route path="/modificar-modalidad/:id" element={<Layout><ModificarModalidad modalidades={modalidades} actualizarModalidad={actualizarModalidad} /></Layout>} />
          <Route path="/eliminar-modalidad/:id" element={<Layout><EliminarModalidad modalidades={modalidades} eliminarModalidad={eliminarModalidad} /></Layout>} />

          {/* Grupos */}
          <Route path="/lista-grupos" element={<Layout><ListaGrupos grupos={grupos} profesores={profesores} alumnos={alumnos} niveles={niveles} modalidades={modalidades} agregarGrupo={agregarGrupo} actualizarGrupo={actualizarGrupo} eliminarGrupo={eliminarGrupo} /></Layout>} />
          <Route path="/crear-grupo" element={<Layout><CrearGrupo agregarGrupo={agregarGrupo} niveles={niveles} modalidades={modalidades} profesores={profesores} alumnos={alumnos} /></Layout>} />
          <Route path="/modificar-grupo/:id" element={<Layout><ModificarGrupo grupos={grupos} actualizarGrupo={actualizarGrupo} niveles={niveles} modalidades={modalidades} profesores={profesores} alumnos={alumnos} /></Layout>} />
          <Route path="/eliminar-grupo/:id" element={<Layout><EliminarGrupo grupos={grupos} eliminarGrupo={eliminarGrupo} /></Layout>} />
          <Route path="/ver-grupo/:id" element={<Layout><VerGrupo grupos={grupos} profesores={profesores} alumnos={alumnos} /></Layout>} />


          {/* Horarios */}
          <Route path="/lista-horarios" element={<Layout><ListaHorarios profesores={profesores} grupos={grupos} /></Layout>} />
          <Route path="/ver-horario/:id" element={<Layout><VerHorario profesores={profesores} grupos={grupos} /></Layout>} />

{/* --- 2. AÑADIR NUEVAS RUTAS DE REPORTE --- */}
          <Route 
            path="/reporte-profesores" 
            element={
              <Layout>
                <ReporteProfesores 
                  profesores={profesores} 
                  grupos={grupos}
                  alumnos={alumnos}
                />
              </Layout>
            } 
          />
          <Route 
            path="/reporte-estudiantes" 
            element={
              <Layout>
                <ReporteEstudiantes 
                  alumnos={alumnos}
                  grupos={grupos}
                  profesores={profesores}
                />
              </Layout>
            } 
          />
          <Route 
            path="/reporte-grupos" 
            element={
              <Layout>
                <ReporteGrupos 
                  grupos={grupos}
                  alumnos={alumnos}
                  profesores={profesores}
                />
              </Layout>
            } 
          />
          
          {/* --- RUTAS DEL PROFESOR --- */}
          
          {/* MODIFICADO: Se pasa 'gruposAsignados' al Dashboard del Profesor */}
          <Route 
            path="/dashboard-profesor" 
            element={
              <LayoutProfesor>
                <DashboardProfesor 
                  data={alumnosAsignados} 
                  profesor={profesorLogueado} 
                  gruposAsignados={gruposAsignados} 
                />
              </LayoutProfesor>
            } 
          />

          <Route 
            path="/profesor/calificaciones" 
            element={
              <LayoutProfesor>
                <AsignarCalificaciones 
                  profesor={profesorLogueado}
                  alumnos={alumnos} // Pasamos TODOS los alumnos
                  grupos={gruposAsignados}
                />
              </LayoutProfesor>
            } 
          />

          {/* --- 2. AÑADIR LA NUEVA RUTA DE ASISTENCIA --- */}
          <Route 
            path="/profesor/asistencia" 
            element={
              <LayoutProfesor>
                <ControlAsistencia 
                  profesor={profesorLogueado}
                  alumnos={alumnos}           // Pasamos TODOS los alumnos
                  grupos={gruposAsignados}      // Solo sus grupos
                />
              </LayoutProfesor>
            } 
          />

          {/* --- 2. AÑADIR LA NUEVA RUTA DE "MIS GRUPOS" --- */}
          <Route 
            path="/profesor/mis-grupos" 
            element={
              <LayoutProfesor>
                <MisGrupos 
                  profesor={profesorLogueado}
                  gruposAsignados={gruposAsignados}
                  alumnos={alumnos}
                  profesores={profesores}
                />
              </LayoutProfesor>
            } 
          />
          {/* Redirección */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;