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

// CRUD Alumnos
import CrearAlumno from './CRUD/Alumnos/crearAlumno';
import ModificarAlumno from './CRUD/Alumnos/modificarAlumno';
import EliminarAlumno from './CRUD/Alumnos/eliminarAlumno';
import VerAlumno from './CRUD/Alumnos/verAlumno'; // <-- NUEVO

// CRUD Profesores
import CrearProfesor from './CRUD/Profesores/crearProfesor';
import ModificarProfesor from './CRUD/Profesores/modificarProfesor';
import EliminarProfesor from './CRUD/Profesores/eliminarProfesor';
import VerProfesor from './CRUD/Profesores/verProfesor'; // <-- NUEVO

// CRUD Administradores
import CrearAdministrador from './CRUD/Administrador/CrearAdministrador';
import ModificarAdministrador from './CRUD/Administrador/modificarAdministrador';
import EliminarAdministrador from './CRUD/Administrador/eliminarAdministrador';
import VerAdministrador from './CRUD/Administrador/verAdministrador'; // <-- NUEVO

//CRUD Niveles
import CrearNivel from './CRUD/Niveles/crearNivel';
import ModificarNivel from './CRUD/Niveles/modificarNivel';
import EliminarNivel from './CRUD/Niveles/eliminarNivel';

// CRUD Modalidad
import CrearModalidad from './CRUD/Modalidad/crearModalidad';
import ModificarModalidad from './CRUD/Modalidad/modificarModalidad';
import EliminarModalidad from './CRUD/Modalidad/eliminarModalidad';
// Datos iniciales
import { initialAlumnos } from './data/alumnos';
import { initialProfesores } from './data/profesores';
import { initialAdministradores } from './data/administradores';
import { initialNiveles } from './data/niveles';
import { initialModalidades } from './data/modalidad';

function App() {
  // --- STATE MANAGEMENT ---
  const [alumnos, setAlumnos] = useState(initialAlumnos);
  const [profesores, setProfesores] = useState(initialProfesores);
  const [administradores, setAdministradores] = useState(initialAdministradores);
  const [niveles, setNiveles] = useState(initialNiveles);
  const [modalidades, setModalidades] = useState(initialModalidades);

  // --- NUEVA FUNCIÓN PARA CAMBIAR EL ESTADO ---
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

  // --- FUNCIONES CRUD (sin cambios) ---
  const agregarAlumno = (alumno) => setAlumnos([ { ...alumno, numero_control: `ALUM-${Date.now()}` }, ...alumnos]);
  const actualizarAlumno = (alumnoActualizado) => setAlumnos(alumnos.map(a => a.numero_control === alumnoActualizado.numero_control ? alumnoActualizado : a));
  const eliminarAlumno = (numero_control) => setAlumnos(alumnos.filter(a => a.numero_control !== numero_control));

  const agregarProfesor = (profesor) => setProfesores([{ ...profesor, numero_empleado: `PROF-${Date.now()}` }, ...profesores]);
  const actualizarProfesor = (profesorActualizado) => setProfesores(profesores.map(p => p.numero_empleado === profesorActualizado.numero_empleado ? profesorActualizado : p));
  const eliminarProfesor = (numero_empleado) => setProfesores(profesores.filter(p => p.numero_empleado !== numero_empleado));

  const agregarAdministrador = (admin) => setAdministradores([{ ...admin, numero_empleado: `ADM-${Date.now()}` }, ...administradores]);
  const actualizarAdministrador = (adminActualizado) => setAdministradores(administradores.map(a => a.numero_empleado === adminActualizado.numero_empleado ? adminActualizado : a));
  const eliminarAdministrador = (numero_empleado) => setAdministradores(administradores.filter(a => a.numero_empleado !== numero_empleado));

  const agregarNivel = (nivel) => setNiveles([{ ...nivel, id: `NIV-${Date.now()}` }, ...niveles]);
  const actualizarNivel = (nivelActualizado) => setNiveles(niveles.map(n => n.id === nivelActualizado.id ? nivelActualizado : n));
  const eliminarNivel = (id) => setNiveles(niveles.filter(n => n.id !== id));

  const agregarModalidad = (modalidad) => setModalidades([{ ...modalidad, id: `MOD-${Date.now()}` }, ...modalidades]);
  const actualizarModalidad = (modalidadActualizada) => setModalidades(modalidades.map(m => m.id === modalidadActualizada.id ? modalidadActualizada : m));
  const eliminarModalidad = (id) => setModalidades(modalidades.filter(m => m.id !== id));

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout titulo="Bienvenido al Sistema"><PerfilUsuario /></Layout>} />

          {/* --- Rutas Estudiantes (ACTUALIZADAS) --- */}
          <Route path="/lista-estudiantes" element={<Layout titulo="Gestión de Estudiantes"><ListaEstudiante alumnos={alumnos} toggleEstado={toggleEstado} /></Layout>} />
          <Route path="/crear-alumno" element={<Layout titulo="Crear Alumno"><CrearAlumno agregarAlumno={agregarAlumno} /></Layout>} />
          <Route path="/modificar-alumno/:id" element={<Layout titulo="Modificar Alumno"><ModificarAlumno alumnos={alumnos} actualizarAlumno={actualizarAlumno} /></Layout>} />
          <Route path="/eliminar-alumno/:id" element={<Layout titulo="Eliminar Alumno"><EliminarAlumno alumnos={alumnos} eliminarAlumno={eliminarAlumno} /></Layout>} />
          <Route path="/ver-alumno/:id" element={<Layout titulo="Detalles del Alumno"><VerAlumno alumnos={alumnos} /></Layout>} />
          
          {/* --- Rutas Profesores (ACTUALIZADAS) --- */}
          <Route path="/lista-profesores" element={<Layout titulo="Gestión de Profesores"><ListaProfesor profesores={profesores} toggleEstado={toggleEstado} /></Layout>} />
          <Route path="/crear-profesor" element={<Layout titulo="Crear Profesor"><CrearProfesor agregarProfesor={agregarProfesor} /></Layout>} />
          <Route path="/modificar-profesor/:id" element={<Layout titulo="Modificar Profesor"><ModificarProfesor profesores={profesores} actualizarProfesor={actualizarProfesor} /></Layout>} />
          <Route path="/eliminar-profesor/:id" element={<Layout titulo="Eliminar Profesor"><EliminarProfesor profesores={profesores} eliminarProfesor={eliminarProfesor} /></Layout>} />
          <Route path="/ver-profesor/:id" element={<Layout titulo="Detalles del Profesor"><VerProfesor profesores={profesores} /></Layout>} />

          {/* --- Rutas Administradores (ACTUALIZADAS) --- */}
          <Route path="/lista-administradores" element={<Layout titulo="Gestión de Administradores"><ListaAdministrador administradores={administradores} toggleEstado={toggleEstado} /></Layout>} />
          <Route path="/crear-administrador" element={<Layout titulo="Crear Administrador"><CrearAdministrador agregarAdministrador={agregarAdministrador} /></Layout>} />
          <Route path="/modificar-administrador/:id" element={<Layout titulo="Modificar Administrador"><ModificarAdministrador administradores={administradores} actualizarAdministrador={actualizarAdministrador} /></Layout>} />
          <Route path="/eliminar-administrador/:id" element={<Layout titulo="Eliminar Administrador"><EliminarAdministrador administradores={administradores} eliminarAdministrador={eliminarAdministrador} /></Layout>} />
          <Route path="/ver-administrador/:id" element={<Layout titulo="Detalles del Administrador"><VerAdministrador administradores={administradores} /></Layout>} />

          {/* --- Rutas para Niveles y Modalidad (sin cambios) --- */}
          <Route path="/lista-niveles" element={<Layout titulo="Gestión de Niveles"><ListaNiveles niveles={niveles} /></Layout>} />
          <Route path="/crear-nivel" element={<Layout titulo="Crear Nivel"><CrearNivel agregarNivel={agregarNivel} /></Layout>} />
          <Route path="/modificar-nivel/:id" element={<Layout titulo="Modificar Nivel"><ModificarNivel niveles={niveles} actualizarNivel={actualizarNivel} /></Layout>} />
          <Route path="/eliminar-nivel/:id" element={<Layout titulo="Eliminar Nivel"><EliminarNivel niveles={niveles} eliminarNivel={eliminarNivel} /></Layout>} />
          <Route path="/lista-modalidad" element={<Layout titulo="Gestión de Modalidades"><ListaModalidad modalidades={modalidades} /></Layout>} />
          <Route path="/crear-modalidad" element={<Layout titulo="Crear Modalidad"><CrearModalidad agregarModalidad={agregarModalidad} /></Layout>} />
          <Route path="/modificar-modalidad/:id" element={<Layout titulo="Modificar Modalidad"><ModificarModalidad modalidades={modalidades} actualizarModalidad={actualizarModalidad} /></Layout>} />
          <Route path="/eliminar-modalidad/:id" element={<Layout titulo="Eliminar Modalidad"><EliminarModalidad modalidades={modalidades} eliminarModalidad={eliminarModalidad} /></Layout>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
