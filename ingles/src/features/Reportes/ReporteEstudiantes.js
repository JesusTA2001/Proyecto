import React, { useState, useMemo } from 'react';
import { Box } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import '../../styles/Reportes.css';

// --- Funciones auxiliares para cargar datos ---
const loadGrades = () => {
  try {
    const data = localStorage.getItem('allGrades');
    return data ? JSON.parse(data) : [];
  } catch (e) { return []; }
};

const loadAsistencias = () => {
  try {
    const data = localStorage.getItem('allAsistencias');
    return data ? JSON.parse(data) : {};
  } catch (e) { return {}; }
};

// --- Funciones de Estilo ---
const getStatusChip = (status) => (
  <Chip
    label={status}
    color={status === 'Activo' ? 'success' : 'error'}
    size="small"
  />
);

const getStatusBadge = (average) => {
  let className = 'status-regular';
  let text = 'Regular';
  if (average >= 9) { className = 'status-excellent'; text = 'Excelente'; }
  else if (average >= 8) { className = 'status-good'; text = 'Bueno'; }
  else if (average < 7) { className = 'status-poor'; text = 'Atención'; }

  return <span className={`status-badge ${className}`}>{text}</span>;
};

const getGradeColor = (grade) => {
  if (grade >= 9) return 'text-green-600';
  if (grade >= 8) return 'text-blue-600';
  if (grade < 7) return 'text-red-600';
  return 'text-yellow-600'; // para 7-7.9
};

export default function ReporteEstudiantes({ alumnos = [], grupos = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  
  // Cargamos los datos una vez
  const allGrades = useMemo(() => loadGrades(), []);
  const allAsistencias = useMemo(() => loadAsistencias(), []);

  // Obtenemos opciones de grupos para el filtro
  const groupOptions = useMemo(() => 
    grupos.map(g => ({ value: g.id, label: g.nombre })), 
    [grupos]
  );

  // Procesamos los datos para el DataGrid
  const rows = useMemo(() => {
    const processedData = alumnos.map(alumno => {
      // 1. Encontrar grupo
      const group = grupos.find(g => g.alumnoIds && g.alumnoIds.includes(alumno.numero_control));
      
      // 2. Calcular promedio
      const studentGrades = allGrades.filter(g => g.student_id === alumno.numero_control);
      let averageGrade = 0;
      if (studentGrades.length > 0) {
        const sum = studentGrades.reduce((acc, grade) => acc + grade.grade, 0);
        averageGrade = sum / studentGrades.length;
      }

      // 3. Calcular asistencia
      let totalDays = 0;
      let presentDays = 0;
      if (group && allAsistencias[group.id]) {
        Object.keys(allAsistencias[group.id]).forEach(date => {
          const status = allAsistencias[group.id][date][alumno.numero_control];
          if (status) {
            totalDays++;
            if (status === 'presente') {
              presentDays++;
            }
          }
        });
      }
      const attendance = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

      return {
        id: alumno.numero_control,
        name: alumno.nombre,
        groupName: group ? group.nombre : 'Sin grupo',
        groupId: group ? group.id : null,
        average: averageGrade,
        attendance: attendance,
        status: alumno.estado,
        statusLabel: averageGrade === 0 ? 'N/A' : (averageGrade >= 9 ? 'excellent' : averageGrade >= 8 ? 'good' : averageGrade >= 7 ? 'regular' : 'poor')
      };
    });

    // Aplicar filtros
    return processedData.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGroup = !groupFilter || student.groupId === groupFilter;
      return matchesSearch && matchesGroup;
    });

  }, [alumnos, grupos, allGrades, allAsistencias, searchTerm, groupFilter]);

  // Definimos las columnas
  const columns = [
    { 
      field: 'name', 
      headerName: 'Nombre', 
      flex: 1,
      minWidth: 250,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '32px', 
            height: '32px', 
            borderRadius: '50%', 
            backgroundColor: '#dcfce7', 
            color: '#166534',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginRight: '12px',
            fontWeight: '600',
            fontSize: '12px'
          }}>
            {params.row.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
          </div>
          <span style={{ fontWeight: 500 }}>{params.row.name}</span>
        </div>
      )
    },
    { field: 'groupName', headerName: 'Grupo', width: 200 },
    { 
      field: 'average', 
      headerName: 'Promedio', 
      width: 120, 
      align: 'center', 
      headerAlign: 'center',
      renderCell: (params) => (
        <span className={`font-medium ${getGradeColor(params.row.average)}`}>
          {params.row.average.toFixed(1)}
        </span>
      )
    },
    { 
      field: 'attendance', 
      headerName: 'Asistencia', 
      width: 120, 
      align: 'center', 
      headerAlign: 'center',
      renderCell: (params) => (
        <span style={{ color: params.row.attendance < 80 ? '#dc2626' : '#1f2937' }}>
          {params.row.attendance}%
        </span>
      )
    },
    { 
      field: 'statusLabel', 
      headerName: 'Estado Académico', 
      width: 150,
      renderCell: (params) => getStatusBadge(params.row.average)
    },
    { 
      field: 'status', 
      headerName: 'Estado', 
      width: 120,
      renderCell: (params) => getStatusChip(params.row.status)
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 120,
      align: 'center', 
      headerAlign: 'center',
      renderCell: (params) => (
        <button 
          className="text-blue-600 hover:text-blue-800" 
          onClick={() => alert(`Ver detalles de ${params.row.name}`)}
        >
          Ver detalles
        </button>
      )
    }
  ];

  return (
    <div className="report-container fade-in">
      <div className="report-header">
        <div className="report-filters">
          <div>
            <h2 className="report-header-title">Reporte de Estudiantes</h2>
            <p className="report-header-subtitle">Seguimiento académico completo</p>
          </div>
          <div className="report-filters-left">
            <select 
              id="student-group-filter" 
              className="report-select"
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
            >
              <option value="">Todos los Grupos</option>
              {groupOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <input 
              type="text" 
              id="student-search" 
              placeholder="Buscar estudiante..." 
              className="report-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="report-export-button">📊 Exportar</button>
          </div>
        </div>
      </div>
      <div className="card-shadow">
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            componentsProps={{
              toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 500 } }
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            disableRowSelectionOnClick
            density="comfortable"
          />
        </Box>
      </div>
    </div>
  );
}