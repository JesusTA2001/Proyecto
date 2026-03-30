import React from "react";
import { useState, useEffect, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import "../../styles/DashboardProfesor.css"; // opcional si luego quieres CSS personalizado
// Importa los estilos compartidos para las tarjetas
import '../../styles/perfil-usuario.css'; 
import '../../styles/PortalCalificaciones.css';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { DataGrid, GridToolbar, useGridApiRef } from '@mui/x-data-grid';
import VerAlumnoModal from '../Alumnos/VerAlumnoModal';
import VerHorarioModal from '../Horario/VerHorarioModal';
import VerGrupoModal from '../Grupos/VerGrupoModal';


function DashboardProfesor({ data, profesor, gruposAsignados = [] }) {
  const nombreCompletoProfesor = `${profesor?.nombre || ''} ${profesor?.apellidoPaterno || ''} ${profesor?.apellidoMaterno || ''}`.trim() || profesor?.nombreCompleto || 'Profesor';
  
  const [totalEstudiantes, setTotalEstudiantes] = useState(0);

  // Dialog / DataGrid states para ver estudiantes
  const [openStudentsDialog, setOpenStudentsDialog] = useState(false);
  const [searchStudents, setSearchStudents] = useState('');
  const [filterGrupoId, setFilterGrupoId] = useState('');
  const apiRef = useGridApiRef();
  const [openViewAlumno, setOpenViewAlumno] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [openHorarioDialog, setOpenHorarioDialog] = useState(false);
  const [openGrupoDialog, setOpenGrupoDialog] = useState(false);
  const [selectedGrupo, setSelectedGrupo] = useState(null);
  const [sortCriteria, setSortCriteria] = useState('name');

  const handleViewGroup = (grupo) => {
    setSelectedGrupo(grupo);
    setOpenGrupoDialog(true);
  };

  // Calcular valores dinámicos
  useEffect(() => {
    // --- CORRECCIÓN: Usar 'gruposAsignados' para sumar estudiantes ---
    const totalEst = gruposAsignados.reduce((sum, g) => sum + (g.alumnoIds?.length || 0), 0);
    setTotalEstudiantes(totalEst);
    // setTotalEstudiantes(data.length); // Esto era incorrecto si 'data' es 'alumnosAsignados'
  }, [gruposAsignados]); // Depender solo de gruposAsignados

  // Construir lista de alumnos asignados a este profesor a partir de 'data' y 'gruposAsignados'
  const alumnosAsignados = (data || []).filter(a => {
    // si pertenece a algún grupo del profesor
    return gruposAsignados.some(g => (g.alumnoIds || []).includes(a.numero_control));
  });

  // Lista de opciones de grupos para filtro
  const grupoOptions = gruposAsignados.map(g => ({ id: g.id, nombre: g.nombre }));

  const gruposOrdenados = useMemo(() => {
    const arr = [...(gruposAsignados || [])];
    const pseudoGrade = (g) => 7 + (((Number(g.id) || 0) * 13) % 21) / 10;
    const pseudoAttendance = (g) => 85 + (((Number(g.id) || 0) * 17) % 16);

    switch (sortCriteria) {
      case 'students':
        arr.sort((a, b) => (b.alumnoIds?.length || 0) - (a.alumnoIds?.length || 0));
        break;
      case 'grade':
        arr.sort((a, b) => pseudoGrade(b) - pseudoGrade(a));
        break;
      case 'attendance':
        arr.sort((a, b) => pseudoAttendance(b) - pseudoAttendance(a));
        break;
      case 'name':
      default:
        arr.sort((a, b) => String(a.nombre || '').localeCompare(String(b.nombre || '')));
        break;
    }

    return arr;
  }, [gruposAsignados, sortCriteria]);

  // Filtrado y filas para la grilla de estudiantes
  const filteredAlumnosForGrid = (alumnosAsignados || []).filter(a => {
    const term = (searchStudents || '').toLowerCase();
    const matchesSearch = !term || (a.nombre || '').toLowerCase().includes(term) || (a.numero_control || '').toLowerCase().includes(term);
    const matchesGrupo = !filterGrupoId || (gruposAsignados.find(g => g.id === filterGrupoId)?.alumnoIds || []).includes(a.numero_control);
    return matchesSearch && matchesGrupo;
  });

  const rowsForGrid = filteredAlumnosForGrid.map(a => {
    const gruposDelAlumno = gruposAsignados.filter(g => (g.alumnoIds || []).includes(a.numero_control));
    const grupoNombre = gruposDelAlumno.map(g => g.nombre).join(' | ');
    return {
      id: a.numero_control,
      numero_control: a.numero_control,
      nombre: a.nombre,
      grupo: grupoNombre || 'Sin grupo'
    };
  });

  const columnsForGrid = [
    { field: 'numero_control', headerName: 'N° Control', width: 150 },
    { field: 'nombre', headerName: 'Nombre Completo', flex: 1, minWidth: 220 },
    { field: 'grupo', headerName: 'Grupo', flex: 1, minWidth: 240 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="view-button icon-button"
            title="Ver Detalles"
            onClick={() => { 
              const a = (data || []).find(x => x.numero_control === params.row.numero_control); 
              setSelectedAlumno(a); 
              setOpenViewAlumno(true); 
            }}
          >
            👁️
          </button>
        </div>
      )
    }
  ];

  // --- Datos para gráfica horizontal de grupos ---
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

  const gruposLabels = gruposAsignados.map(g => g.nombre);
  const gruposCounts = gruposAsignados.map(g => (g.alumnoIds || []).length);
  const coloresChart = [
    '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'
  ];

  const chartData = {
    labels: gruposLabels,
    datasets: [
      {
        label: 'Estudiantes',
        data: gruposCounts,
        backgroundColor: gruposLabels.map((_, i) => coloresChart[i % coloresChart.length]),
        borderRadius: 8,
        maxBarThickness: 80,
        barPercentage: 0.6,
        categoryPercentage: 0.7
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, title: { display: false } },
    layout: { padding: { top: 8, right: 12, bottom: 8, left: 12 } },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1, color: '#374151', font: { size: 12 } }, grid: { color: '#edf2f7' } },
      x: { ticks: { autoSkip: false, color: '#374151', font: { size: 12 } }, grid: { color: '#f3f4f6' } }
    },
    elements: { bar: { borderRadius: 8, borderSkipped: false } }
  };

  return (
    <div className="portal-container" style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <main className="flex-1 flex flex-col gap-6">
        <div className="stats-grid">
          
          {/* Tarjeta 1: Total Estudiantes (no link) */}
          <div className="stat-card-link" style={{ cursor: 'pointer' }} onClick={() => setOpenStudentsDialog(true)}>
            <div className="stat-card" style={{ borderLeft: '4px solid #2563eb' }}>
              <div className="stat-card-info">
                <p className="stat-card-title">TOTAL ESTUDIANTES</p>
                <p className="stat-card-value">{totalEstudiantes}</p>
              </div>
              <div className="stat-card-icon-wrapper" style={{ backgroundColor: '#dbeafe', color: '#2563eb' }}>🎓</div>
            </div>
          </div>

          {/* Tarjeta 2: Asistencia Hoy */}
          <Link to="/profesor/asistencia" className="stat-card-link">
            <div className="stat-card" style={{ borderLeft: '4px solid #16a34a' }}>
              <div className="stat-card-info">
                <p className="stat-card-title">ASISTENCIA HOY</p>
                <p className="stat-card-value">Ir</p>
              </div>
              <div className="stat-card-icon-wrapper" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>📅</div>
            </div>
          </Link>

          {/* Tarjeta 3: Asignar Calificaciones */ }
          <Link to="/profesor/calificaciones" className="stat-card-link" style={{ marginLeft: 0 }}>
            <div className="stat-card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
              <div className="stat-card-info">
                <p className="stat-card-title">ASIGNAR CALIFICACIONES</p>
                <p className="stat-card-value">Ir</p>
              </div>
              <div className="stat-card-icon-wrapper" style={{ backgroundColor: 'var(--color-primary-light, #f3e8ff)', color: 'var(--color-primary, #7A1F5C)' }}>✏️</div>
            </div>
          </Link>

          {/* Tarjeta 4: Ver Horario */}
          <div className="stat-card-link" style={{ cursor: 'pointer' }} onClick={() => setOpenHorarioDialog(true)}>
            <div className="stat-card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
              <div className="stat-card-info">
                <p className="stat-card-title">MI HORARIO</p>
                <p className="stat-card-value">Ver</p>
              </div>
              <div className="stat-card-icon-wrapper" style={{ backgroundColor: 'var(--color-primary-light, #f3e8ff)', color: 'var(--color-primary, #7A1F5C)' }}>🗓️</div>
            </div>
          </div>

          {/* Portal de Alumnos eliminado del dashboard */}
        </div>

        {/* Sección de grupos (Lista en el dashboard) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-white rounded-lg shadow-sm p-6 flex flex-col gap-3">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h2 className="text-lg font-semibold text-gray-800" style={{ margin: 0 }}>
                📘 Mis Grupos Asignados
              </h2>
              <select
                value={sortCriteria}
                onChange={(e) => setSortCriteria(e.target.value)}
                style={{
                  minWidth: 190,
                  padding: '7px 10px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#fff',
                  color: '#111827',
                  fontSize: '0.88rem'
                }}
              >
                <option value="name">Ordenar por Nombre</option>
                <option value="students">Ordenar por Estudiantes</option>
                <option value="grade">Ordenar por Promedio (Sim.)</option>
                <option value="attendance">Ordenar por Asistencia (Sim.)</option>
              </select>
            </div>
            {gruposOrdenados.length > 0 ? (
              gruposOrdenados.map((grupo) => (
                <div
                  key={grupo.id}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                >
                  <div style={{ flex: 1 }}>
                    <p className="font-medium text-gray-800">{grupo.nombre}</p>
                    <div className="flex items-center" style={{ gap: '16px', flexWrap: 'wrap', marginTop: 4, fontSize: '0.95rem', color: '#4b5563' }}>
                      <span>📍 {grupo.ubicacion || 'Sin ubicación'}</span>
                      <span>🕒 {grupo.dia || 'Sin día'} {grupo.hora ? `${grupo.hora}` : ''}</span>
                      <span>👥 {(grupo.alumnoIds || []).length} estudiantes</span>
                      <Tooltip title="Ver detalles del grupo" arrow>
                        <button
                          className="view-button icon-button"
                          onClick={() => handleViewGroup(grupo)}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.55rem', padding: 0 }}
                        >
                          👁️
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center p-4">No tienes grupos asignados.</p>
            )}
          </div>

          {/* Estudiantes por Grupo (Gráfica horizontal) */}
          <div className="card-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              📊 Estudiantes por Grupo
            </h2>
            <div style={{ height: '380px', width: '100%' }}>
              {gruposAsignados.length > 0 && totalEstudiantes > 0 ? (
                <Bar data={chartData} options={chartOptions} />
              ) : (
                <p className="text-gray-500 text-center p-4">No hay datos de estudiantes para mostrar.</p>
              )}
            </div>
          </div>
        </div>
        {/* Dialog: Lista de Estudiantes del profesor */}
        <Dialog open={openStudentsDialog} onClose={() => setOpenStudentsDialog(false)} fullWidth maxWidth="lg">
          <DialogTitle sx={{ m: 0, p: 2, backgroundColor: 'var(--color-primary)', color: '#fff', fontWeight: 700 }}>
            Estudiantes de {nombreCompletoProfesor}
          </DialogTitle>
          <DialogContent dividers>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <TextField
                size="small"
                label="Buscar"
                placeholder="Nombre o N° Control"
                value={searchStudents}
                onChange={(e) => setSearchStudents(e.target.value)}
                fullWidth
              />
              <TextField
                size="small"
                select
                label="Filtrar por Grupo"
                value={filterGrupoId}
                onChange={(e) => setFilterGrupoId(e.target.value)}
                style={{ minWidth: 260 }}
              >
                <MenuItem value="">Todos</MenuItem>
                {grupoOptions.map(g => (
                  <MenuItem key={g.id} value={g.id}>{g.nombre}</MenuItem>
                ))}
              </TextField>
            </div>

            <Box sx={{ height: 520, width: '100%' }}>
              <DataGrid
                apiRef={apiRef}
                rows={rowsForGrid}
                columns={columnsForGrid}
                pagination
                pageSizeOptions={[10,25,50]}
                disableRowSelectionOnClick
                density="comfortable"
                components={{ Toolbar: GridToolbar }}
                initialState={{ pagination: { paginationModel: { pageSize: 25, page: 0 } }, sorting: { sortModel: [{ field: 'nombre', sort: 'asc' }] } }}
                sx={{ backgroundColor: 'white' }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenStudentsDialog(false)}>Cerrar</Button>
          </DialogActions>
        </Dialog>

        {/* Modal ver alumno individual */}
        <VerAlumnoModal open={openViewAlumno} onClose={() => setOpenViewAlumno(false)} alumno={selectedAlumno} />

        {/* Modal ver horario profesor */}
        <VerHorarioModal
          open={openHorarioDialog}
          onClose={() => setOpenHorarioDialog(false)}
          profesor={profesor}
          grupos={gruposAsignados}
        />

        <VerGrupoModal
          open={openGrupoDialog}
          onClose={() => setOpenGrupoDialog(false)}
          grupo={selectedGrupo}
          profesores={profesor ? [profesor] : []}
          alumnos={data || []}
        />
      </main>
    </div>
  );
}

export default DashboardProfesor;