import React from "react";
import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
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
import { DataGrid, GridToolbar, useGridApiRef } from '@mui/x-data-grid';
import VerAlumnoModal from '../Alumnos/VerAlumnoModal';


function DashboardProfesor({ data, profesor, gruposAsignados = [] }) {
  
  const [totalGrupos, setTotalGrupos] = useState(0);
  const [totalEstudiantes, setTotalEstudiantes] = useState(0);
  const [promedioGeneral, setPromedioGeneral] = useState(0);

  // Dialog / DataGrid states para ver estudiantes
  const [openStudentsDialog, setOpenStudentsDialog] = useState(false);
  const [searchStudents, setSearchStudents] = useState('');
  const [filterGrupoId, setFilterGrupoId] = useState('');
  const apiRef = useGridApiRef();
  const [openViewAlumno, setOpenViewAlumno] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState(null);

  // Calcular valores dinámicos
  useEffect(() => {
    setTotalGrupos(gruposAsignados.length); 

    // --- CORRECCIÓN: Usar 'gruposAsignados' para sumar estudiantes ---
    const totalEst = gruposAsignados.reduce((sum, g) => sum + (g.alumnoIds?.length || 0), 0);
    setTotalEstudiantes(totalEst);
    // setTotalEstudiantes(data.length); // Esto era incorrecto si 'data' es 'alumnosAsignados'

    // Promedio general simulado (como lo tenías)
    if (gruposAsignados.length > 0) {
      const promedio = 8 + Math.random() * 1; 
      setPromedioGeneral(promedio.toFixed(1));
    } else {
      setPromedioGeneral(0);
    }
  }, [gruposAsignados]); // Depender solo de gruposAsignados

  // Construir lista de alumnos asignados a este profesor a partir de 'data' y 'gruposAsignados'
  const alumnosAsignados = (data || []).filter(a => {
    // si pertenece a algún grupo del profesor
    return gruposAsignados.some(g => (g.alumnoIds || []).includes(a.numero_control));
  });

  // Lista de opciones de grupos para filtro
  const grupoOptions = gruposAsignados.map(g => ({ id: g.id, nombre: g.nombre }));

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
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
          
          {/* Tarjeta 1: Total Grupos */}
          <Link to="/profesor/mis-grupos" className="stat-card-link">
            <div className="stat-card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
              <div className="stat-card-info">
                <p className="stat-card-title">TOTAL GRUPOS</p>
                <p className="stat-card-value">{totalGrupos}</p>
              </div>
              <div className="stat-card-icon-wrapper" style={{ backgroundColor: 'var(--color-primary-light, #f3e8ff)', color: 'var(--color-primary, #7A1F5C)' }}>👥</div>
            </div>
          </Link>

          {/* Tarjeta 2: Total Estudiantes (no link) */}
          <div className="stat-card-link" style={{ cursor: 'pointer' }} onClick={() => setOpenStudentsDialog(true)}>
            <div className="stat-card" style={{ borderLeft: '4px solid #2563eb' }}>
              <div className="stat-card-info">
                <p className="stat-card-title">TOTAL ESTUDIANTES</p>
                <p className="stat-card-value">{totalEstudiantes}</p>
              </div>
              <div className="stat-card-icon-wrapper" style={{ backgroundColor: '#dbeafe', color: '#2563eb' }}>🎓</div>
            </div>
          </div>

          {/* Tarjeta 3: Asistencia Hoy */}
          <Link to="/profesor/asistencia" className="stat-card-link">
            <div className="stat-card" style={{ borderLeft: '4px solid #16a34a' }}>
              <div className="stat-card-info">
                <p className="stat-card-title">ASISTENCIA HOY</p>
                <p className="stat-card-value">Ir</p>
              </div>
              <div className="stat-card-icon-wrapper" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>📅</div>
            </div>
          </Link>

          {/* Tarjeta 4: Asignar Calificaciones */ }
          <Link to="/profesor/calificaciones" className="stat-card-link" style={{ marginLeft: 0 }}>
            <div className="stat-card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
              <div className="stat-card-info">
                <p className="stat-card-title">ASIGNAR CALIFICACIONES</p>
                <p className="stat-card-value">Ir</p>
              </div>
              <div className="stat-card-icon-wrapper" style={{ backgroundColor: 'var(--color-primary-light, #f3e8ff)', color: 'var(--color-primary, #7A1F5C)' }}>✏️</div>
            </div>
          </Link>

          {/* Tarjeta 5: Promedio General (Simulado) */ }
          <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
            <div className="stat-card-info">
              <p className="stat-card-title">PROMEDIO GENERAL (Sim.)</p>
              <p className="stat-card-value">{promedioGeneral}</p>
            </div>
            <div className="stat-card-icon-wrapper" style={{ backgroundColor: '#fef3c7', color: '#f59e0b' }}>⭐</div>
          </div>
          
          {/* Portal de Alumnos eliminado del dashboard */}
        </div>

        {/* Sección de grupos (Lista en el dashboard) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-white rounded-lg shadow-sm p-6 flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              📘 Mis Grupos Asignados
            </h2>
            {gruposAsignados.length > 0 ? (
              gruposAsignados.map((grupo) => (
                <div
                  key={grupo.id}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800">{grupo.nombre}</p>
                    <p className="text-sm text-gray-600">
                      {grupo.nivel} - {grupo.dia} {grupo.hora ? `(${grupo.hora})` : ''}
                    </p>
                  </div>
                  <span className="grade-badge" style={{ backgroundColor: '#f3e8ff', color: 'var(--color-primary)'}}>
                    {(grupo.alumnoIds || []).length} estudiantes
                  </span>
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
          <DialogTitle>Estudiantes de {profesor?.nombre || 'Profesor'}</DialogTitle>
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
      </main>
    </div>
  );
}

export default DashboardProfesor;