import './App.css';
import Layout from './Layout/Layout'; // 1. Importamos el nuevo Layout
import PerfilUsuario from './perfil/perfil-usuario';
import ListaEstudiante from './listaEstudiante/listaEstudiante';
import ListaProfesor from './listaProfesor/listaProfesor';
import ListaAdministrador from './listaAdministrador/listaAdministrador';
import Login from './Login/Login'
// CRUD Alumnos
import CrearAlumno from './CRUD/Alumnos/crearAlumno';
import ModificarAlumno from './CRUD/Alumnos/modificarAlumno';
import EliminarAlumno from './CRUD/Alumnos/eliminarAlumno';
// CRUD Profesores
import CrearProfesor from './CRUD/Profesores/crearProfesor';
import ModificarProfesor from './CRUD/Profesores/modificarProfesor';
import EliminarProfesor from './CRUD/Profesores/eliminarProfesor';
// CRUD Administradores
import CrearAdministrador from './CRUD/Administrador/CrearAdministrador';
import ModificarAdministrador from './CRUD/Administrador/modificarAdministrador';
import EliminarAdministrador from './CRUD/Administrador/eliminarAdministrador';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        {/* <Login/> */}
        
        <Routes>
          {/* 2. Envolvemos cada componente con el Layout y le pasamos el título */}

          {/* Página principal */}
          <Route path="/" element={
            <Layout titulo="Bienvenido al Sistema de Gestión Escolar">
              <PerfilUsuario />
            </Layout>
          } />

          {/* Rutas del menú */}
          <Route path="/lista-estudiantes" element={
            <Layout titulo="Gestion de Estudiantes">
              <ListaEstudiante />
            </Layout>
          } />
          <Route path="/lista-profesores" element={
            <Layout titulo="Gestion de Profesores">
              <ListaProfesor />
            </Layout>
          } />
          <Route path="/lista-administradores" element={
            <Layout titulo="Gestion de Administradores">
              <ListaAdministrador />
            </Layout>
          } />

          {/* rutas del CRUD Alumno */}
          <Route path="/crear-alumno" element={
            <Layout titulo="Crear Alumno">
              <CrearAlumno />
            </Layout>
          } />
          <Route path="/modificar-alumno" element={
            <Layout titulo="Modificar Alumno">
              <ModificarAlumno />
            </Layout>
          } />
          <Route path="/eliminar-alumno" element={
            <Layout titulo="Eliminar Alumno">
              <EliminarAlumno />
            </Layout>
          } />

          {/* Rutas del CRUD Profesor */}
          <Route path="/crear-profesor" element={
            <Layout titulo="Crear Profesor">
              <CrearProfesor />
            </Layout>
          } />
          <Route path="/modificar-profesor" element={
            <Layout titulo="Modificar Profesor">
              <ModificarProfesor />
            </Layout>
          } />
          <Route path="/eliminar-profesor" element={
            <Layout titulo="Eliminar Profesor">
              <EliminarProfesor />
            </Layout>
          } />

          {/* CRUD Administrador */}
          <Route path="/crear-administrador" element={
            <Layout titulo="Crear Administrador">
              <CrearAdministrador />
            </Layout>
          } />
          <Route path="/modificar-administrador" element={
            <Layout titulo="Modificar Administrador">
              <ModificarAdministrador />
            </Layout>
          } />
          <Route path="/eliminar-administrador" element={
            <Layout titulo="Eliminar Administrador">
              <EliminarAdministrador />
            </Layout>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

