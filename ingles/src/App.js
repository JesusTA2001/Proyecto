import React, { useState, useMemo, useEffect } from 'react'; // Importa useMemo y useEffect
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import api from './api/axios';

// Estilos e Layout
import './App.css';
import Layout from './features/Layout/Layout';
import PerfilUsuario from './features/Dashboard/Dashboard'; // usar el archivo Dashboard.js que exporta PerfilUsuario
import Login from './features/Auth/Login';

// Componentes de Listas
import ListaEstudiante from './features/Alumnos/ListaEstudianteMUI';
import ListaProfesor from './features/Profesores/ListaProfesorMUI';
import ListaAdministrador from './features/Administradores/ListaAdministradorMUI';
import ListaGrupos from './features/Grupos/ListaGruposMUI';

// Dashboard Profesor
import DashboardProfesor from './features/Dashboard/DashboardProfesor';
import LayoutProfesor from './features/Layout/LayoutProfesor';
// Dashboards y Layouts adicionales
import DashboardAlumnos from './features/Dashboard/DashboardAlumnos';
import DashboardCoordinador from './features/Dashboard/DashboardCoordinador';
import DashboardDirectivos from './features/Dashboard/DashboardDirectivos';
import LayoutAlumnos from './features/Layout/LayoutAlumnos';
import LayoutCoordinador from './features/Layout/LayoutCoordinador';
import LayoutDirectivos from './features/Layout/LayoutDirectivos';
import AsignarCalificaciones from './features/Profesores/AsignarCalificaciones';
import HistorialGrupos from './features/Profesores/HistorialGrupos';
import HistorialGrupoDetalle from './features/Profesores/HistorialGrupoDetalle';
// --- 1. IMPORTAR NUEVO COMPONENTE DE ASISTENCIA ---
import ControlAsistencia from './features/Profesores/ControlAsistencia';
// Administrar Periodos
import AdministrarPeriodos from './features/Periodos/AdministrarPeriodos';
import MisGrupos from './features/Profesores/MisGrupos';

// CRUD Alumnos
import CrearAlumno from './features/Alumnos/CrearAlumnoStepper';
import MisCalificaciones from './features/Alumnos/MisCalificaciones';

// CRUD Profesores
import CrearProfesor from './features/Profesores/CrearProfesorStepper';

// CRUD Administradores
import CrearAdministrador from './features/Administradores/CrearAdministradorStepper';
import HistorialGruposAdmin from './features/Administradores/HistorialGruposAdmin';

// CRUD Grupos
import CrearGrupo from './features/Grupos/CrearGrupo';
import ModificarGrupo from './features/Grupos/ModificarGrupo';
import EliminarGrupo from './features/Grupos/EliminarGrupo';
import VerGrupo from './features/Grupos/VerGrupo';

// reportes
import ReporteProfesores from './features/Reportes/ReporteProfesores';
import ReporteEstudiantes from './features/Reportes/ReporteEstudiantes';
import ReporteGrupos from './features/Reportes/ReporteGrupos';

// Datos iniciales - COMENTADOS para usar la base de datos
// import { initialAlumnos } from './data/alumnos';
// import { initialProfesores } from './data/profesores';
// import { initialAdministradores } from './data/administradores';
// import { initialGrupos } from './data/grupos';

function App() {
  // --- STATE MANAGEMENT - Ahora comienza vacío y se llena desde la API ---
  const [alumnos, setAlumnos] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [administradores, setAdministradores] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [niveles, setNiveles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos desde la API al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        console.log('Token encontrado:', token ? 'SÍ' : 'NO');
        
        if (!token) {
          console.log('No hay token, creando token temporal para desarrollo...');
          localStorage.setItem('token', 'temp_token_dev_' + Date.now());
        }

        console.log('Cargando datos desde la API...');

        // Cargar datos en paralelo
        const [alumnosRes, profesoresRes, administradoresRes, gruposRes, horariosRes, periodosRes, nivelesRes] = await Promise.all([
          api.get('/alumnos').catch(err => {
            console.error('Error al cargar alumnos:', err);
            return { data: [] };
          }),
          api.get('/profesores').catch(err => {
            console.error('Error al cargar profesores:', err);
            return { data: [] };
          }),
          api.get('/administradores').catch(err => {
            console.error('Error al cargar administradores:', err);
            return { data: [] };
          }),
          api.get('/grupos').catch(err => {
            console.error('Error al cargar grupos:', err);
            return { data: [] };
          }),
          api.get('/horarios').catch(err => {
            console.error('Error al cargar horarios:', err);
            return { data: [] };
          }),
          api.get('/periodos').catch(err => {
            console.error('Error al cargar periodos:', err);
            return { data: [] };
          }),
          api.get('/niveles').catch(err => {
            console.error('Error al cargar niveles:', err);
            return { data: [] };
          })
        ]);

        console.log('Datos recibidos:', {
          alumnos: alumnosRes.data.length,
          profesores: profesoresRes.data.length,
          administradores: administradoresRes.data.length,
          grupos: gruposRes.data.length,
          horarios: horariosRes.data.length,
          periodos: periodosRes.data.length,
          niveles: nivelesRes.data.length
        });

        // Mapear los datos de la BD al formato del frontend
        const alumnosMapeados = (alumnosRes.data || []).map(a => ({
          numero_control: a.nControl,
          nombre: a.nombre, // Solo el nombre, no concatenar apellidos
          nombreCompleto: `${a.nombre || ''} ${a.apellidoPaterno || ''} ${a.apellidoMaterno || ''}`.trim(), // Nombre Apellido Paterno Apellido Materno
          apellidoPaterno: a.apellidoPaterno,
          apellidoMaterno: a.apellidoMaterno,
          // Mantener ambas convenciones de nombres para compatibilidad
          email: a.email,
          correo: a.email,
          genero: a.genero,
          CURP: a.CURP,
          curp: a.CURP,
          telefono: a.telefono,
          direccion: a.direccion,
          ubicacion: a.ubicacion,
          nivel: a.nivel_nombre || `Nivel ${a.id_Nivel}`,
          id_Nivel: a.id_Nivel,
          estado: a.estado === 'activo' ? 'Activo' : 'Inactivo'
        }));

        const profesoresMapeados = (profesoresRes.data || []).map(p => ({
          numero_empleado: p.id_Profesor,
          id_profesor: p.id_Profesor,
          nombreCompleto: `${p.apellidoPaterno || ''} ${p.apellidoMaterno || ''} ${p.nombre || ''}`.trim(),
          nombre: p.nombre,
          apellidoPaterno: p.apellidoPaterno,
          apellidoMaterno: p.apellidoMaterno,
          email: p.email,
          genero: p.genero,
          CURP: p.CURP,
          telefono: p.telefono,
          direccion: p.direccion,
          ubicacion: p.ubicacion,
          RFC: p.RFC,
          gradoEstudio: p.nivelEstudio,
          estado: p.estado === 'activo' ? 'Activo' : 'Inactivo'
        }));

        const administradoresMapeados = (administradoresRes.data || []).map(a => ({
          numero_empleado: a.id_Administrador,
          id_administrador: a.id_Administrador,
          nombre: `${a.apellidoPaterno || ''} ${a.apellidoMaterno || ''} ${a.nombre || ''}`.trim(),
          apellidoPaterno: a.apellidoPaterno,
          apellidoMaterno: a.apellidoMaterno,
          email: a.email,
          genero: a.genero,
          CURP: a.CURP,
          telefono: a.telefono,
          direccion: a.direccion,
          RFC: a.RFC,
          estado: a.estado === 'activo' ? 'Activo' : 'Inactivo'
        }));

        const gruposMapeados = (gruposRes.data || []).map(g => {
          // Separar la hora en horaInicio y horaFin
          let horaInicio = '';
          let horaFin = '';
          if (g.hora) {
            const partes = g.hora.split('-');
            if (partes.length === 2) {
              horaInicio = partes[0].trim();
              horaFin = partes[1].trim();
            }
          }
          
          return {
            id: g.id_Grupo,
            nombre: g.grupo,
            nivel: g.nivel_nombre || `Nivel ${g.id_Nivel}`,
            ubicacion: g.ubicacion,
            profesorId: g.id_Profesor,
            profesor_nombre: g.profesor_nombre,
            dia: g.diaSemana,
            hora: g.hora,
            horaInicio,
            horaFin,
            id_cHorario: g.id_cHorario,
            id_Periodo: g.id_Periodo,
            id_Nivel: g.id_Nivel,
            num_alumnos: g.num_alumnos || 0,
            alumnoIds: g.alumnoIds || [],
            alumnos: g.alumnos || []
          };
        });

        const horariosMapeados = (horariosRes.data || []).map(h => ({
          id: h.id_cHorario,
          ubicacion: h.ubicacion,
          dia: h.diaSemana,
          hora: h.hora,
          estado: h.estado === 'activo' ? 'Activo' : 'Inactivo'
        }));

        const periodosMapeados = (periodosRes.data || []).map(p => ({
          id: p.id_Periodo,
          nombre: p.descripcion,
          año: p.año
        }));

        const nivelesMapeados = (nivelesRes.data || []).map(n => ({
          id: n.id_Nivel,
          nombre: n.nivel
        }));

        console.log('Datos mapeados:', {
          alumnos: alumnosMapeados.length,
          profesores: profesoresMapeados.length,
          administradores: administradoresMapeados.length,
          grupos: gruposMapeados.length,
          horarios: horariosMapeados.length,
          periodos: periodosMapeados.length,
          niveles: nivelesMapeados.length
        });

        setAlumnos(alumnosMapeados);
        setProfesores(profesoresMapeados);
        setAdministradores(administradoresMapeados);
        setGrupos(gruposMapeados);
        setHorarios(horariosMapeados);
        setPeriodos(periodosMapeados);
        setNiveles(nivelesMapeados);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  // --- Lógica de negocio - Modificada para usar API ---
  const toggleEstado = async (id, tipo) => {
    try {
      switch (tipo) {
        case 'alumno':
          await api.patch(`/alumnos/${id}/toggle-estado`);
          setAlumnos(alumnos.map(a => a.numero_control === id ? { ...a, estado: a.estado === 'Activo' ? 'Inactivo' : 'Activo' } : a));
          break;
        case 'profesor':
          const profesor = profesores.find(p => p.numero_empleado === id);
          if (profesor) {
            await api.patch(`/profesores/${profesor.id_profesor}/toggle-estado`);
            setProfesores(profesores.map(p => p.numero_empleado === id ? { ...p, estado: p.estado === 'Activo' ? 'Inactivo' : 'Activo' } : p));
          }
          break;
        case 'administrador':
          const admin = administradores.find(a => a.numero_empleado === id);
          if (admin) {
            await api.patch(`/administradores/${admin.id_administrador}/toggle-estado`);
            setAdministradores(administradores.map(a => a.numero_empleado === id ? { ...a, estado: a.estado === 'Activo' ? 'Inactivo' : 'Activo' } : a));
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('Error al cambiar el estado. Por favor, intenta de nuevo.');
    }
  };

  const agregarAlumno = async (alumno) => {
    try {
      const response = await api.post('/alumnos', {
        apellidoPaterno: alumno.apellidoPaterno,
        apellidoMaterno: alumno.apellidoMaterno,
        nombre: alumno.nombre,
        email: alumno.email,
        genero: alumno.genero,
        CURP: alumno.CURP,
        telefono: alumno.telefono,
        direccion: alumno.direccion,
        ubicacion: alumno.ubicacion,
        usuario: alumno.email, // O el campo que uses para usuario
        contraseña: alumno.CURP // O la contraseña que desees usar por defecto
      });

      if (response.data.success) {
        // Recargar la lista de alumnos
        const alumnosRes = await api.get('/alumnos');
        const alumnosMapeados = alumnosRes.data.map(a => ({
          numero_control: a.nControl,
          // nombre aquí es usado en algunos modales como título, mantener nombre y nombreCompleto
          nombre: a.nombre,
          nombreCompleto: `${a.apellidoPaterno || ''} ${a.apellidoMaterno || ''} ${a.nombre || ''}`.trim(),
          apellidoPaterno: a.apellidoPaterno,
          apellidoMaterno: a.apellidoMaterno,
          email: a.email,
          correo: a.email,
          genero: a.genero,
          CURP: a.CURP,
          curp: a.CURP,
          telefono: a.telefono,
          direccion: a.direccion,
          ubicacion: a.ubicacion,
          estado: a.estado === 'activo' ? 'Activo' : 'Inactivo'
        }));
        setAlumnos(alumnosMapeados);
        return response.data;
      }
    } catch (error) {
      console.error('Error al agregar alumno:', error);
      alert('Error al agregar alumno. Por favor, intenta de nuevo.');
      throw error;
    }
  };

  const actualizarAlumno = async (alumnoActualizado) => {
    try {
      await api.put(`/alumnos/${alumnoActualizado.numero_control}`, {
        apellidoPaterno: alumnoActualizado.apellidoPaterno,
        apellidoMaterno: alumnoActualizado.apellidoMaterno,
        nombre: alumnoActualizado.nombre,
        email: alumnoActualizado.email,
        genero: alumnoActualizado.genero,
        CURP: alumnoActualizado.CURP,
        telefono: alumnoActualizado.telefono,
        direccion: alumnoActualizado.direccion,
        ubicacion: alumnoActualizado.ubicacion,
        estado: alumnoActualizado.estado === 'Activo' ? 'activo' : 'inactivo'
      });
      
      setAlumnos(alumnos.map(a => a.numero_control === alumnoActualizado.numero_control ? alumnoActualizado : a));
    } catch (error) {
      console.error('Error al actualizar alumno:', error);
      alert('Error al actualizar alumno. Por favor, intenta de nuevo.');
    }
  };

  const eliminarAlumno = async (numero_control) => {
    try {
      await api.delete(`/alumnos/${numero_control}`);
      setAlumnos(alumnos.filter(a => a.numero_control !== numero_control));
    } catch (error) {
      console.error('Error al eliminar alumno:', error);
      alert('Error al eliminar alumno. Por favor, intenta de nuevo.');
    }
  };

  const agregarProfesor = async (profesor) => {
    try {
      const response = await api.post('/profesores', {
        apellidoPaterno: profesor.apellidoPaterno,
        apellidoMaterno: profesor.apellidoMaterno,
        nombre: profesor.nombre,
        email: profesor.email,
        genero: profesor.genero,
        CURP: profesor.CURP,
        telefono: profesor.telefono,
        direccion: profesor.direccion,
        ubicacion: profesor.ubicacion,
        numero_empleado: profesor.numero_empleado,
        RFC: profesor.RFC,
        nivelEstudio: profesor.gradoEstudio,
        usuario: profesor.email,
        contraseña: profesor.CURP
      });

      if (response.data.success) {
        const profesoresRes = await api.get('/profesores');
        const profesoresMapeados = profesoresRes.data.map(p => ({
          numero_empleado: p.numero_empleado,
          id_profesor: p.id_profesor,
          nombre: `${p.apellidoPaterno} ${p.apellidoMaterno} ${p.nombre}`,
          nombreCompleto: `${p.apellidoPaterno || ''} ${p.apellidoMaterno || ''} ${p.nombre || ''}`.trim(),
          apellidoPaterno: p.apellidoPaterno,
          apellidoMaterno: p.apellidoMaterno,
          email: p.email,
          genero: p.genero,
          CURP: p.CURP,
          telefono: p.telefono,
          direccion: p.direccion,
          ubicacion: p.ubicacion,
          RFC: p.RFC,
          gradoEstudio: p.nivelEstudio,
          estado: p.estado === 'activo' ? 'Activo' : 'Inactivo'
        }));
        setProfesores(profesoresMapeados);
        return response.data;
      }
    } catch (error) {
      console.error('Error al agregar profesor:', error);
      alert('Error al agregar profesor. Por favor, intenta de nuevo.');
      throw error;
    }
  };

  const actualizarProfesor = async (profesorActualizado) => {
    try {
      await api.put(`/profesores/${profesorActualizado.id_profesor}`, {
        apellidoPaterno: profesorActualizado.apellidoPaterno,
        apellidoMaterno: profesorActualizado.apellidoMaterno,
        nombre: profesorActualizado.nombre,
        email: profesorActualizado.email,
        genero: profesorActualizado.genero,
        CURP: profesorActualizado.CURP,
        telefono: profesorActualizado.telefono,
        direccion: profesorActualizado.direccion,
        ubicacion: profesorActualizado.ubicacion,
        numero_empleado: profesorActualizado.numero_empleado,
        RFC: profesorActualizado.RFC,
        nivelEstudio: profesorActualizado.gradoEstudio,
        estado: profesorActualizado.estado === 'Activo' ? 'activo' : 'inactivo'
      });
      
      const profesorConNombre = {
        ...profesorActualizado,
        nombreCompleto: `${profesorActualizado.apellidoPaterno || ''} ${profesorActualizado.apellidoMaterno || ''} ${profesorActualizado.nombre || ''}`.trim()
      };
      setProfesores(profesores.map(p => p.numero_empleado === profesorActualizado.numero_empleado ? profesorConNombre : p));
    } catch (error) {
      console.error('Error al actualizar profesor:', error);
      alert('Error al actualizar profesor. Por favor, intenta de nuevo.');
    }
  };

  const eliminarProfesor = async (numero_empleado) => {
    try {
      const profesor = profesores.find(p => p.numero_empleado === numero_empleado);
      if (profesor) {
        await api.delete(`/profesores/${profesor.id_profesor}`);
        setProfesores(profesores.filter(p => p.numero_empleado !== numero_empleado));
      }
    } catch (error) {
      console.error('Error al eliminar profesor:', error);
      alert('Error al eliminar profesor. Por favor, intenta de nuevo.');
    }
  };

  const agregarAdministrador = async (admin) => {
    try {
      const response = await api.post('/administradores', {
        apellidoPaterno: admin.apellidoPaterno,
        apellidoMaterno: admin.apellidoMaterno,
        nombre: admin.nombre,
        email: admin.email,
        genero: admin.genero,
        CURP: admin.CURP,
        telefono: admin.telefono,
        direccion: admin.direccion,
        ubicacion: admin.ubicacion,
        gradoEstudio: admin.gradoEstudio,
        usuario: admin.email,
        contraseña: admin.CURP
      });

      if (response.data.success) {
        const administradoresRes = await api.get('/administradores');
        const administradoresMapeados = administradoresRes.data.map(a => ({
          numero_empleado: a.id_administrador,
          id_administrador: a.id_administrador,
          nombre: `${a.apellidoPaterno} ${a.apellidoMaterno} ${a.nombre}`,
          apellidoPaterno: a.apellidoPaterno,
          apellidoMaterno: a.apellidoMaterno,
          email: a.email,
          genero: a.genero,
          CURP: a.CURP,
          telefono: a.telefono,
          direccion: a.direccion,
          ubicacion: a.ubicacion,
          gradoEstudio: a.gradoEstudio,
          estado: a.estado === 'activo' ? 'Activo' : 'Inactivo'
        }));
        setAdministradores(administradoresMapeados);
        return response.data;
      }
    } catch (error) {
      console.error('Error al agregar administrador:', error);
      alert('Error al agregar administrador. Por favor, intenta de nuevo.');
      throw error;
    }
  };

  const actualizarAdministrador = async (adminActualizado) => {
    try {
      await api.put(`/administradores/${adminActualizado.id_administrador}`, {
        apellidoPaterno: adminActualizado.apellidoPaterno,
        apellidoMaterno: adminActualizado.apellidoMaterno,
        nombre: adminActualizado.nombre,
        email: adminActualizado.email,
        genero: adminActualizado.genero,
        CURP: adminActualizado.CURP,
        telefono: adminActualizado.telefono,
        direccion: adminActualizado.direccion,
        ubicacion: adminActualizado.ubicacion,
        gradoEstudio: adminActualizado.gradoEstudio,
        estado: adminActualizado.estado === 'Activo' ? 'activo' : 'inactivo'
      });
      
      const adminConNombre = {
        ...adminActualizado,
        nombreCompleto: `${adminActualizado.apellidoPaterno || ''} ${adminActualizado.apellidoMaterno || ''} ${adminActualizado.nombre || ''}`.trim()
      };
      setAdministradores(administradores.map(a => a.numero_empleado === adminActualizado.numero_empleado ? adminConNombre : a));
    } catch (error) {
      console.error('Error al actualizar administrador:', error);
      alert('Error al actualizar administrador. Por favor, intenta de nuevo.');
    }
  };

  const eliminarAdministrador = async (numero_empleado) => {
    try {
      const admin = administradores.find(a => a.numero_empleado === numero_empleado);
      if (admin) {
        await api.delete(`/administradores/${admin.id_administrador}`);
        setAdministradores(administradores.filter(a => a.numero_empleado !== numero_empleado));
      }
    } catch (error) {
      console.error('Error al eliminar administrador:', error);
      alert('Error al eliminar administrador. Por favor, intenta de nuevo.');
    }
  };
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
  const agregarGrupo = async (grupo) => {
    try {
      // Buscar el id_Nivel basado en el nombre del nivel
      let id_Nivel = 1; // valor por defecto
      if (grupo.nivel) {
        const nivelObj = niveles.find(n => n.nombre === grupo.nivel);
        if (nivelObj) {
          id_Nivel = nivelObj.id;
        } else {
          // Fallback: intentar extraer el número del nivel
          if (grupo.nivel === 'Intro') {
            id_Nivel = 0;
          } else {
            const match = grupo.nivel.match(/\d+/);
            if (match) {
              id_Nivel = parseInt(match[0]);
            }
          }
        }
      }

      console.log('📤 Enviando grupo al backend:', {
        grupo: grupo.nombre,
        id_Periodo: grupo.periodo || 1,
        id_Profesor: grupo.profesorId,
        id_Nivel: id_Nivel,
        ubicacion: grupo.ubicacion,
        dia: grupo.dia,
        horaInicio: grupo.horaInicio,
        horaFin: grupo.horaFin,
        alumnoIds: grupo.alumnoIds || []
      });

      const response = await api.post('/grupos', {
        grupo: grupo.nombre,
        id_Periodo: grupo.periodo || 1,
        id_Profesor: grupo.profesorId,
        id_Nivel: id_Nivel,
        ubicacion: grupo.ubicacion,
        dia: grupo.dia,
        horaInicio: grupo.horaInicio,
        horaFin: grupo.horaFin,
        alumnoIds: grupo.alumnoIds || []
      });

      console.log('✅ Grupo creado exitosamente:', response.data);

      // Recargar grupos después de crear
      const gruposRes = await api.get('/grupos');
      const gruposMapeados = gruposRes.data.map(g => {
        // Separar la hora en horaInicio y horaFin
        let horaInicio = '';
        let horaFin = '';
        if (g.hora) {
          const partes = g.hora.split('-');
          if (partes.length === 2) {
            horaInicio = partes[0].trim();
            horaFin = partes[1].trim();
          }
        }
        
        return {
          id: g.id_Grupo,
          nombre: g.grupo,
          nivel: g.nivel_nombre || `Nivel ${g.id_Nivel}`,
          ubicacion: g.ubicacion,
          profesorId: g.id_Profesor,
          profesor_nombre: g.profesor_nombre,
          dia: g.diaSemana,
          hora: g.hora,
          horaInicio,
          horaFin,
          id_cHorario: g.id_cHorario,
          id_Periodo: g.id_Periodo,
          id_Nivel: g.id_Nivel,
          num_alumnos: g.num_alumnos || 0,
          alumnoIds: g.alumnoIds || [],
          alumnos: g.alumnos || []
        };
      });
      setGrupos(gruposMapeados);
      
      return response.data;
    } catch (error) {
      console.error('Error al crear grupo:', error);
      alert('Error al crear el grupo: ' + (error.response?.data?.message || error.message));
      throw error;
    }
  };

  const actualizarGrupo = async (grupoActualizado) => {
    try {
      console.log('📝 Actualizando grupo con datos:', grupoActualizado);
      
      // Buscar el id_Nivel basado en el nombre del nivel
      let id_Nivel = grupoActualizado.id_Nivel;
      
      // Si no tiene id_Nivel pero sí tiene nombre de nivel, convertirlo
      if (!id_Nivel && grupoActualizado.nivel) {
        // Usar la variable 'niveles' del estado, no 'nivelesMapeados'
        const nivelEncontrado = niveles.find(n => n.nombre === grupoActualizado.nivel);
        if (nivelEncontrado) {
          id_Nivel = nivelEncontrado.id;
          console.log('✅ Nivel encontrado en array:', nivelEncontrado);
        } else {
          // Fallback: intentar parsear del nombre
          console.log('⚠️ Nivel no encontrado, usando fallback');
          if (grupoActualizado.nivel === 'Intro') {
            id_Nivel = 0;
          } else {
            const match = grupoActualizado.nivel.match(/\d+/);
            if (match) {
              id_Nivel = parseInt(match[0]);
            }
          }
        }
      }

      console.log('📊 id_Nivel determinado:', id_Nivel, 'para nivel:', grupoActualizado.nivel);
      console.log('📅 id_Periodo:', grupoActualizado.periodo || grupoActualizado.id_Periodo);

      // Actualizar datos básicos del grupo
      const datosActualizacion = {
        grupo: grupoActualizado.nombre,
        id_Periodo: grupoActualizado.periodo || grupoActualizado.id_Periodo,
        id_Profesor: grupoActualizado.profesorId || null,
        id_Nivel: id_Nivel,
        ubicacion: grupoActualizado.ubicacion,
        id_cHorario: grupoActualizado.id_cHorario,
        dia: grupoActualizado.dia,
        horaInicio: grupoActualizado.horaInicio,
        horaFin: grupoActualizado.horaFin
      };

      console.log('📤 Enviando al backend:', datosActualizacion);

      await api.put(`/grupos/${grupoActualizado.id}`, datosActualizacion);

      // Actualizar alumnos del grupo si se proporcionaron
      if (grupoActualizado.alumnoIds && Array.isArray(grupoActualizado.alumnoIds)) {
        console.log('👥 Actualizando alumnos:', grupoActualizado.alumnoIds);
        await api.post(`/grupos/${grupoActualizado.id}/estudiantes`, {
          alumnoIds: grupoActualizado.alumnoIds
        });
      }

      // Recargar grupos después de actualizar
      const gruposRes = await api.get('/grupos');
      const gruposMapeados = gruposRes.data.map(g => {
        // Separar la hora en horaInicio y horaFin
        let horaInicio = '';
        let horaFin = '';
        if (g.hora) {
          const partes = g.hora.split('-');
          if (partes.length === 2) {
            horaInicio = partes[0].trim();
            horaFin = partes[1].trim();
          }
        }
        
        return {
          id: g.id_Grupo,
          nombre: g.grupo,
          nivel: g.nivel_nombre || `Nivel ${g.id_Nivel}`,
          ubicacion: g.ubicacion,
          profesorId: g.id_Profesor,
          profesor_nombre: g.profesor_nombre,
          dia: g.diaSemana,
          hora: g.hora,
          horaInicio,
          horaFin,
          id_cHorario: g.id_cHorario,
          id_Periodo: g.id_Periodo,
          id_Nivel: g.id_Nivel,
          num_alumnos: g.num_alumnos || 0,
          alumnoIds: g.alumnoIds || [],
          alumnos: g.alumnos || []
        };
      });
      setGrupos(gruposMapeados);
      
      console.log('✅ Grupo actualizado exitosamente');
    } catch (error) {
      console.error('❌ Error al actualizar grupo:', error);
      console.error('Detalles:', error.response?.data);
      alert('Error al actualizar el grupo: ' + (error.response?.data?.message || error.message));
      throw error;
    }
  };

  const eliminarGrupo = async (id) => {
    try {
      await api.delete(`/grupos/${id}`);
      setGrupos(grupos.filter(g => g.id !== id));
    } catch (error) {
      console.error('Error al eliminar grupo:', error);
      alert('Error al eliminar el grupo: ' + (error.response?.data?.message || error.message));
      throw error;
    }
  };

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
    // Redirigir según rol
    if (user.role === 'profesor') return <Navigate to="/dashboard-profesor" replace />;
    if (user.role === 'alumno') return <Navigate to="/dashboard-alumnos" replace />;
    if (user.role === 'coordinador') return <Navigate to="/dashboard-coordinador" replace />;
    if (user.role === 'directivo') return <Navigate to="/dashboard-directivos" replace />;
    // Administrador y roles no contemplados: mostrar dashboard general
    return (
      <Layout>
        <PerfilUsuario
          alumnos={alumnos}
          profesores={profesores}
          administradores={administradores}
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
          <Route path="/lista-estudiantes" element={
            currentUser && currentUser.role === 'directivo'
              ? (
                <LayoutDirectivos>
                  <ListaEstudiante alumnos={alumnos} toggleEstado={toggleEstado} agregarAlumno={agregarAlumno} actualizarAlumno={actualizarAlumno} eliminarAlumno={eliminarAlumno} />
                </LayoutDirectivos>
              ) : (
                <Layout>
                  <ListaEstudiante alumnos={alumnos} toggleEstado={toggleEstado} agregarAlumno={agregarAlumno} actualizarAlumno={actualizarAlumno} eliminarAlumno={eliminarAlumno} />
                </Layout>
              )
          } />
          <Route path="/crear-alumno" element={
            currentUser && currentUser.role === 'administrador'
              ? (
                <Layout>
                  <CrearAlumno agregarAlumno={agregarAlumno} />
                </Layout>
              ) : (
                <Navigate to="/" replace />
              )
          } />

          {/* Profesores */}
          <Route path="/lista-profesores" element={
            currentUser && currentUser.role === 'directivo'
              ? (
                <LayoutDirectivos>
                  <ListaProfesor profesores={profesores} grupos={grupos} toggleEstado={toggleEstado} agregarProfesor={agregarProfesor} actualizarProfesor={actualizarProfesor} />
                </LayoutDirectivos>
              ) : (
                <Layout>
                  <ListaProfesor profesores={profesores} grupos={grupos} toggleEstado={toggleEstado} agregarProfesor={agregarProfesor} actualizarProfesor={actualizarProfesor} />
                </Layout>
              )
          } />
          <Route path="/crear-profesor" element={
            currentUser && currentUser.role === 'administrador'
              ? (
                <Layout>
                  <CrearProfesor agregarProfesor={agregarProfesor} />
                </Layout>
              ) : (
                <Navigate to="/" replace />
              )
          } />

          {/* Administradores */}
          <Route path="/lista-administradores" element={
            currentUser && currentUser.role === 'directivo'
              ? (
                <LayoutDirectivos>
                  <ListaAdministrador administradores={administradores} toggleEstado={toggleEstado} agregarAdministrador={agregarAdministrador} actualizarAdministrador={actualizarAdministrador} eliminarAdministrador={eliminarAdministrador} />
                </LayoutDirectivos>
              ) : (
                <Layout>
                  <ListaAdministrador administradores={administradores} toggleEstado={toggleEstado} agregarAdministrador={agregarAdministrador} actualizarAdministrador={actualizarAdministrador} eliminarAdministrador={eliminarAdministrador} />
                </Layout>
              )
          } />
          <Route path="/crear-administrador" element={
            currentUser && currentUser.role === 'administrador'
              ? (
                <Layout>
                  <CrearAdministrador agregarAdministrador={agregarAdministrador} />
                </Layout>
              ) : (
                <Navigate to="/" replace />
              )
          } />

          {/* Grupos */}
          <Route path="/lista-grupos" element={
            currentUser && currentUser.role === 'directivo'
              ? (
                <LayoutDirectivos>
                  <ListaGrupos grupos={grupos} profesores={profesores} alumnos={alumnos} niveles={niveles} periodos={periodos} agregarGrupo={agregarGrupo} actualizarGrupo={actualizarGrupo} eliminarGrupo={eliminarGrupo} />
                </LayoutDirectivos>
              ) : (
                <Layout>
                  <ListaGrupos grupos={grupos} profesores={profesores} alumnos={alumnos} niveles={niveles} periodos={periodos} agregarGrupo={agregarGrupo} actualizarGrupo={actualizarGrupo} eliminarGrupo={eliminarGrupo} />
                </Layout>
              )
          } />
          <Route path="/crear-grupo" element={
            currentUser && currentUser.role === 'administrador'
              ? (
                <Layout>
                  <CrearGrupo agregarGrupo={agregarGrupo} niveles={niveles} periodos={periodos} profesores={profesores} alumnos={alumnos} />
                </Layout>
              ) : (
                <Navigate to="/" replace />
              )
          } />
          <Route path="/modificar-grupo/:id" element={
            currentUser && currentUser.role === 'administrador'
              ? (
                <Layout>
                  <ModificarGrupo grupos={grupos} actualizarGrupo={actualizarGrupo} niveles={niveles} periodos={periodos} profesores={profesores} alumnos={alumnos} />
                </Layout>
              ) : (
                <Navigate to="/" replace />
              )
          } />
          <Route path="/eliminar-grupo/:id" element={
            currentUser && currentUser.role === 'administrador'
              ? (
                <Layout>
                  <EliminarGrupo grupos={grupos} eliminarGrupo={eliminarGrupo} />
                </Layout>
              ) : (
                <Navigate to="/" replace />
              )
          } />
          <Route path="/ver-grupo/:id" element={<Layout><VerGrupo grupos={grupos} profesores={profesores} alumnos={alumnos} /></Layout>} />

          {/* Periodos */}
          <Route path="/administrar-periodos" element={
            currentUser && (currentUser.role === 'administrador' || currentUser.role === 'directivo' || currentUser.role === 'coordinador')
              ? (
                currentUser.role === 'directivo' ? (
                  <LayoutDirectivos><AdministrarPeriodos /></LayoutDirectivos>
                ) : currentUser.role === 'coordinador' ? (
                  <LayoutCoordinador><AdministrarPeriodos /></LayoutCoordinador>
                ) : (
                  <Layout><AdministrarPeriodos /></Layout>
                )
              ) : (
                <Navigate to="/" replace />
              )
          } />

          {/* Historial de Grupos (solo Administrador) */}
          <Route path="/historial-grupos-admin" element={
            currentUser && currentUser.role === 'administrador'
              ? (
                <Layout><HistorialGruposAdmin /></Layout>
              ) : (
                <Navigate to="/" replace />
              )
          } />
          
{/* --- 2. AÑADIR NUEVAS RUTAS DE REPORTE --- */}
          <Route 
            path="/reporte-profesores" 
            element={
              currentUser && currentUser.role === 'directivo'
                ? (
                  <LayoutDirectivos>
                    <ReporteProfesores 
                      profesores={profesores} 
                      grupos={grupos}
                      alumnos={alumnos}
                    />
                  </LayoutDirectivos>
                ) : (
                  <Layout>
                    <ReporteProfesores 
                      profesores={profesores} 
                      grupos={grupos}
                      alumnos={alumnos}
                    />
                  </Layout>
                )
            } 
          />
          <Route 
            path="/reporte-estudiantes" 
            element={
              currentUser && currentUser.role === 'directivo'
                ? (
                  <LayoutDirectivos>
                    <ReporteEstudiantes 
                      alumnos={alumnos}
                      grupos={grupos}
                      profesores={profesores}
                    />
                  </LayoutDirectivos>
                ) : (
                  <Layout>
                    <ReporteEstudiantes 
                      alumnos={alumnos}
                      grupos={grupos}
                      profesores={profesores}
                    />
                  </Layout>
                )
            } 
          />
          <Route 
            path="/reporte-grupos" 
            element={
              currentUser && currentUser.role === 'directivo'
                ? (
                  <LayoutDirectivos>
                    <ReporteGrupos 
                      grupos={grupos}
                      alumnos={alumnos}
                      profesores={profesores}
                    />
                  </LayoutDirectivos>
                ) : (
                  <Layout>
                    <ReporteGrupos 
                      grupos={grupos}
                      alumnos={alumnos}
                      profesores={profesores}
                    />
                  </Layout>
                )
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
                  alumnos={alumnos}
                  grupos={gruposAsignados}
                  periodos={periodos}
                  niveles={niveles}
                />
              </LayoutProfesor>
            } 
          />

          <Route
            path="/profesores/historial"
            element={
              <LayoutProfesor>
                <HistorialGrupos />
              </LayoutProfesor>
            }
          />

          <Route
            path="/profesores/historial/:id"
            element={
              <LayoutProfesor>
                <HistorialGrupoDetalle />
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
          {/* Rutas para nuevos dashboards por rol */}
          <Route
            path="/dashboard-alumnos"
            element={
              currentUser && currentUser.role === 'estudiante'
                ? (
                  <LayoutAlumnos>
                    <DashboardAlumnos alumno={currentUser} />
                  </LayoutAlumnos>
                ) : (
                  <Navigate to="/login" replace />
                )
            }
          />

          <Route
            path="/alumno/calificaciones"
            element={
              currentUser && currentUser.role === 'estudiante'
                ? (
                  <LayoutAlumnos>
                    <MisCalificaciones />
                  </LayoutAlumnos>
                ) : (
                  <Navigate to="/login" replace />
                )
            }
          />

          <Route
            path="/dashboard-coordinador"
            element={
              currentUser && currentUser.role === 'coordinador'
                ? (
                  <LayoutCoordinador>
                    <DashboardCoordinador alumnos={alumnos} />
                  </LayoutCoordinador>
                ) : (
                  <Navigate to="/login" replace />
                )
            }
          />

          <Route
            path="/dashboard-directivos"
            element={
              currentUser && currentUser.role === 'directivo'
                ? (
                  <LayoutDirectivos>
                    <DashboardDirectivos
                      alumnos={alumnos}
                      profesores={profesores}
                      administradores={administradores}
                      grupos={grupos}
                    />
                  </LayoutDirectivos>
                ) : (
                  <Navigate to="/login" replace />
                )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;