import './App.css';
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
          {/* Página principal */}
          <Route path="/" element={<PerfilUsuario />} />

          {/* Rutas del menú */}
          <Route path="/lista-estudiantes" element={<ListaEstudiante />} />
          <Route path="/lista-profesores" element={<ListaProfesor />} />
          <Route path="/lista-administradores" element={<ListaAdministrador />} />
          {/* rutas del CRUD Alumno*/}
          <Route path="/crear-alumno" element={<CrearAlumno />} />
          <Route path="/modificar-alumno" element={<ModificarAlumno />} />
          <Route path="/eliminar-alumno" element={<EliminarAlumno />} />
          {/* Rutas del CRUD Profesor */}
          <Route path="/crear-profesor" element={<CrearProfesor />} />
          <Route path="/modificar-profesor" element={<ModificarProfesor />} />
          <Route path="/eliminar-profesor" element={<EliminarProfesor />} />
          {/* CRUD Administrador */}
          <Route path="/crear-administrador" element={<CrearAdministrador />} />
          <Route path="/modificar-administrador" element={<ModificarAdministrador />} />
          <Route path="/eliminar-administrador" element={<EliminarAdministrador />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

