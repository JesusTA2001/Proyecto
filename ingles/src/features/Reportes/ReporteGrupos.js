import React, { useState, useMemo } from 'react';
import { Box } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
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
const getGradeColor = (grade) => {
  if (grade >= 9) return 'text-green-600';
  if (grade >= 8) return 'text-blue-600';
  if (grade < 7) return 'text-red-600';
  return 'text-yellow-600';
};

const ProgressBar = ({ percentage }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <div style={{
      width: '100px',
      height: '6px',
      backgroundColor: '#f3f4f6',
      borderRadius: '3px',
      overflow: 'hidden'
    }}>
      <div style={{
        height: '100%',
        width: `${percentage}%`,
        background: 'linear-gradient(90deg, #1e40af, #3b82f6)',
        borderRadius: '3px'
      }}></div>
    </div>
    <span style={{ fontSize: '14px', fontWeight: 500 }}>{percentage}%</span>
  </div>
);

export default function ReporteGrupos({ grupos = [], alumnos = [], profesores = [] }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Cargamos los datos una vez
  const allGrades = useMemo(() => loadGrades(), []);
  const allAsistencias = useMemo(() => loadAsistencias(), []);

  // Procesamos los datos para el DataGrid
  const rows = useMemo(() => {
    const processedData = grupos.map(grupo => {
      const studentIds = new Set(grupo.alumnoIds || []);
      const teacher = profesores.find(p => p.numero_empleado === grupo.profesorId);

      // 1. Calcular promedio del grupo
      const groupGrades = allGrades.filter(g => studentIds.has(g.student_id));
      let averageGrade = 0;
      if (groupGrades.length > 0) {
        const sum = groupGrades.reduce((acc, grade) => acc + grade.grade, 0);
        averageGrade = sum / groupGrades.length;
      }

      // 2. Calcular asistencia del grupo
      let totalPossibleDays = 0;
      let totalPresentDays = 0;
      if (allAsistencias[grupo.id]) {
        Object.keys(allAsistencias[grupo.id]).forEach(date => {
          studentIds.forEach(studentId => {
            const status = allAsistencias[grupo.id][date][studentId];
            if (status) {
              totalPossibleDays++;
              if (status === 'presente') {
                totalPresentDays++;
              }
            }
          });
        });
      }
      const attendance = totalPossibleDays > 0 ? Math.round((totalPresentDays / totalPossibleDays) * 100) : 0;

      return {
        id: grupo.id,
        name: grupo.nombre,
        teacherName: teacher ? teacher.nombre : 'No asignado',
        students: studentIds.size,
        average: averageGrade,
        attendance: attendance,
      };
    });

    // Aplicar filtro de búsqueda
    return processedData.filter(group => 
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
    );

  }, [grupos, alumnos, profesores, allGrades, allAsistencias, searchTerm]);

  // Definimos las columnas
  const columns = [
    { 
      field: 'name', 
      headerName: 'Nombre del Grupo', 
      flex: 1,
      minWidth: 250,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '32px', 
            height: '32px', 
            borderRadius: '8px', 
            backgroundColor: '#f3e8ff', 
            color: '#7A1F5C',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginRight: '12px',
            fontWeight: '600',
            fontSize: '12px'
          }}>
            {params.row.id.substring(0, 4)}
          </div>
          <span style={{ fontWeight: 500 }}>{params.row.name}</span>
        </div>
      )
    },
    { field: 'teacherName', headerName: 'Profesor', width: 220 },
    { field: 'students', headerName: 'Estudiantes', width: 100, align: 'center', headerAlign: 'center' },
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
      width: 180,
      renderCell: (params) => <ProgressBar percentage={params.row.attendance} />
    },
  ];

  return (
    <div className="report-container fade-in">
      <div className="report-header">
        <div className="report-filters">
          <div>
            <h2 className="report-header-title">Reporte de Grupos</h2>
            <p className="report-header-subtitle">Análisis comparativo por grupos</p>
          </div>
          <div className="report-filters-left">
            <input 
              type="text" 
              id="group-search" 
              placeholder="Buscar por grupo o profesor..." 
              className="report-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="report-export-button">📊 Exportar</button>
          </div>
        </div>
      </div>
      <div className="card-shadow">
        {/* Aquí no usamos los charts, solo la tabla/lista como pediste */}
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            componentsProps={{
              toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 500 } }
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            density="comfortable"
          />
        </Box>
      </div>
    </div>
  );
}