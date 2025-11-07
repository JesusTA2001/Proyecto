import React, { useState, useMemo } from 'react';
import { Box } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import '../../styles/Reportes.css'; // Importamos los nuevos estilos
import { initialProfesores } from '../../data/profesores'; // Usado para el filtro de departamento

// --- Funciones auxiliares para cargar datos ---
const loadGrades = () => {
  try {
    const data = localStorage.getItem('allGrades');
    return data ? JSON.parse(data) : [];
  } catch (e) { return []; }
};

// Función para obtener un badge de estado de MUI
const getStatusChip = (status) => (
  <Chip
    label={status}
    color={status === 'Activo' ? 'success' : 'error'}
    size="small"
  />
);

// Función para obtener badge de promedio
const getAverageBadge = (average) => {
  let className = 'status-regular';
  if (average >= 9) className = 'status-excellent';
  else if (average >= 8) className = 'status-good';
  else if (average < 7) className = 'status-poor';

  return (
    <span className={`status-badge ${className}`}>
      {average.toFixed(1)}
    </span>
  );
};

// Extraemos departamentos únicos (Grado de Estudio) para el filtro
const departmentOptions = [
  ...new Set(initialProfesores.map(p => p.gradoEstudio))
].map(dep => ({ value: dep, label: dep }));


export default function ReporteProfesores({ profesores = [], grupos = [], alumnos = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  
  // Cargamos las calificaciones una vez
  const allGrades = useMemo(() => loadGrades(), []);

  // Procesamos los datos para el DataGrid
  const rows = useMemo(() => {
    const processedData = profesores.map(profesor => {
      // 1. Contar grupos asignados
      const assignedGroups = grupos.filter(g => g.profesorId === profesor.numero_empleado);
      
      // 2. Contar estudiantes totales en esos grupos
      const totalStudents = assignedGroups.reduce((acc, group) => acc + (group.alumnoIds ? group.alumnoIds.length : 0), 0);

      // 3. Calcular promedio de ESE profesor
      const teacherGrades = allGrades.filter(grade => grade.teacher_id === profesor.numero_empleado);
      let averageGrade = 0;
      if (teacherGrades.length > 0) {
        const sum = teacherGrades.reduce((acc, grade) => acc + grade.grade, 0);
        averageGrade = sum / teacherGrades.length;
      }

      return {
        id: profesor.numero_empleado,
        name: profesor.nombre,
        department: profesor.gradoEstudio, // Usamos gradoEstudio como "Departamento"
        groups: assignedGroups.length,
        students: totalStudents,
        average: averageGrade,
        status: profesor.estado
      };
    });

    // Aplicar filtros
    return processedData.filter(prof => {
      const matchesSearch = prof.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = !departmentFilter || prof.department === departmentFilter;
      return matchesSearch && matchesDept;
    });

  }, [profesores, grupos, allGrades, searchTerm, departmentFilter]);

  // Definimos las columnas para el DataGrid
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
            backgroundColor: '#dbeafe', 
            color: '#1d4ed8',
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
    { field: 'department', headerName: 'Departamento', width: 150 },
    { field: 'groups', headerName: 'Grupos', width: 100, align: 'center', headerAlign: 'center' },
    { field: 'students', headerName: 'Estudiantes', width: 100, align: 'center', headerAlign: 'center' },
    { 
      field: 'average', 
      headerName: 'Promedio', 
      width: 120, 
      align: 'center', 
      headerAlign: 'center',
      renderCell: (params) => getAverageBadge(params.row.average)
    },
    { 
      field: 'status', 
      headerName: 'Estado', 
      width: 120,
      renderCell: (params) => getStatusChip(params.row.status)
    },
  ];

  return (
    <div className="report-container fade-in">
      <div className="report-header">
        <div className="report-filters">
          <div>
            <h2 className="report-header-title">Reporte de Profesores</h2>
            <p className="report-header-subtitle">Análisis completo del cuerpo docente</p>
          </div>
          <div className="report-filters-left">
            <select 
              id="teacher-department-filter" 
              className="report-select"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="">Todos los Departamentos</option>
              {departmentOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <input 
              type="text" 
              id="teacher-search" 
              placeholder="Buscar profesor..." 
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
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            density="comfortable"
          />
        </Box>
      </div>
    </div>
  );
}