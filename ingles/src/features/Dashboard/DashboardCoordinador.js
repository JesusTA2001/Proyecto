import React, { useState, useMemo } from 'react';
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
import api from '../../api/axios';

// Importar estilos y datos
import '../../styles/DashboardCoordinador.css';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
// import { initialNiveles } from '../../data/niveles'; // Opcional si quieres usar nombres reales de niveles

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Configuración de colores para niveles (mapeo de Nivel 1, 2... a colores del diseño)
const nivelColorMap = {
  'Nivel 1': '#ef4444', // A1 like
  'Nivel 2': '#f97316', // A2 like
  'Nivel 3': '#eab308', // B1 like
  'Nivel 4': '#84cc16', // B2 like
  'Nivel 5': '#22c55e', // C1 like
  'Nivel 6': '#10b981', // C2 like
  'Intro': '#6b7280',   // Gris para Intro
};

// Función auxiliar para obtener un porcentaje de avance simulado basado en el nivel
const getAvancePorNivel = (nivel) => {
  switch (nivel) {
    case 'Nivel 6': return 100;
    case 'Nivel 5': return 85;
    case 'Nivel 4': return 70;
    case 'Nivel 3': return 50;
    case 'Nivel 2': return 35;
    case 'Nivel 1': return 20;
    case 'Intro': return 10;
    default: return 0;
  }
};

const normalizeText = (text) =>
  (text || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

function DashboardCoordinador() {
  // --- Estados de Datos ---
  const [alumnos] = useState([]); // Eliminada dependencia de static data
  const [searchTerm, setSearchTerm] = useState('');
  const [nivelFilter, setNivelFilter] = useState('');

  // Determinar carrera del coordinador según el usuario logueado
  const getCurrentUser = () => {
    try {
      const raw = localStorage.getItem('currentUser');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  };

  const currentUser = getCurrentUser();
  // Mapear coordinador a la carrera (código usado en `data/alumnos`) y su etiqueta legible
  const coordToCareer = {
    COORD01: { code: 'ISC',  label: 'Ingeniería en Sistemas Computacionales' },
    COORD02: { code: 'IE',   label: 'Ingeniería Electrónica' },
    COORD03: { code: 'II',   label: 'Ingeniería Industrial' },
    COORD04: { code: 'IIAS', label: 'Ingeniería Innovación Agrícola Sustentable' },
    COORD05: { code: 'IIA',  label: 'Ingeniería en Industrias Alimentarias' },
    COORD06: { code: 'IGE',  label: 'Ingeniería en Gestión Empresarial' },
    COORD07: { code: 'A',    label: 'Arquitectura' },
    COORD08: { code: 'CP',   label: 'Contador Público' },
    COORD09: { code: 'ITIC', label: 'Ingeniería en Tecnologías de la Información y Comunicación' }
  };
  const carreraAsignada = (currentUser && currentUser.role === 'coordinador' && currentUser.numero_empleado)
    ? (coordToCareer[currentUser.numero_empleado] || null)
    : null;
  const carreraAsignadaCode = carreraAsignada ? carreraAsignada.code : null;

  // --- Cálculos y Filtrado ---
  const filteredStudents = useMemo(() => {
    const normalizedSearchTerm = normalizeText(searchTerm);

    return alumnos.filter(student => {
      const nombreCompleto = normalizeText(student.nombre);
      const apellidoPaterno = normalizeText(student.apellidoPaterno);
      const apellidoMaterno = normalizeText(student.apellidoMaterno);
      const apellidos = normalizeText(student.apellidos);
      const numeroControl = normalizeText(student.numero_control);

      const matchesSearch =
        nombreCompleto.includes(normalizedSearchTerm) ||
        apellidoPaterno.includes(normalizedSearchTerm) ||
        apellidoMaterno.includes(normalizedSearchTerm) ||
        apellidos.includes(normalizedSearchTerm) ||
        numeroControl.includes(normalizedSearchTerm);

      const matchesNivel = !nivelFilter || student.nivel === nivelFilter;

      // Filtrar por el código de carrera asignado (ej: 'ISC', 'IE', 'II')
      const matchesCarrera = !carreraAsignadaCode || (student.carrera === carreraAsignadaCode);

      return matchesSearch && matchesNivel && matchesCarrera;
    });
  }, [alumnos, searchTerm, nivelFilter, carreraAsignadaCode]);

  // Datos para el Gráfico
  const chartData = useMemo(() => {
    const counts = {};
    // Queremos el orden: Intro, Nivel 1..Nivel 6, Otros
    const order = ['Intro', 'Nivel 1', 'Nivel 2', 'Nivel 3', 'Nivel 4', 'Nivel 5', 'Nivel 6'];
    order.forEach(n => counts[n] = 0);

    // Contar sólo los estudiantes filtrados (por carrera y filtros)
    filteredStudents.forEach(a => {
      const nivel = a.nivel || 'Otros';
      if (counts.hasOwnProperty(nivel)) {
        counts[nivel]++;
      } else {
        counts['Otros'] = (counts['Otros'] || 0) + 1;
      }
    });

    const labels = [...order];
    if (counts['Otros']) labels.push('Otros');

    return {
      labels,
      datasets: [
        {
          label: 'Estudiantes',
          data: labels.map(l => counts[l] || 0),
          backgroundColor: labels.map(l => nivelColorMap[l] || '#cbd5e1'),
          borderRadius: 6,
        },
      ],
    };
  }, [filteredStudents]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  };

  // --- Manejadores ---
  // Nota: Eliminado el manejo de agregar estudiante por petición del usuario.

  // Configuración de columnas para DataGrid
  const columns = [
    { field: 'numero_control', headerName: 'Número de Control', width: 160 },
    { field: 'nombre', headerName: 'Nombre Completo', width: 260, flex: 1 },
    { field: 'carrera', headerName: 'Carrera', width: 240 },
    { field: 'nivel', headerName: 'Nivel', width: 140 },
    { field: 'avance', headerName: 'Avance Estimado', width: 160 }
  ];

  const rows = filteredStudents.map((s, idx) => ({
    id: s.numero_control || idx,
    numero_control: s.numero_control,
    nombre: s.nombre,
    carrera: s.carrera,
    nivel: s.nivel,
    avance: getAvancePorNivel(s.nivel) + '%'
  }));

  // Orden explícito para los niveles en los select/visualizaciones
  const nivelesOrder = ['Intro', 'Nivel 1', 'Nivel 2', 'Nivel 3', 'Nivel 4', 'Nivel 5', 'Nivel 6'];

  return (
    <div className="coord-container">
      <div className="coord-header">
        <h1>Dashboard Coordinador de Carrera</h1>
        <p>{carreraAsignada ? carreraAsignada.label : 'Carrera no asignada'}</p>
      </div>

      {/* Sección de Tabla */}
      <div className="coord-section">
        <h2>Estudiantes Registrados</h2>
        
        {/* Controles */}
        <div className="coord-controls">
          <input 
            type="text" 
            className="coord-search-box" 
            placeholder="Buscar por nombre o número de control..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="coord-filter-select"
            value={nivelFilter}
            onChange={(e) => setNivelFilter(e.target.value)}
          >
            <option value="">Todos los niveles</option>
            {nivelesOrder.map(nivel => (
              <option key={nivel} value={nivel}>{nivel}</option>
            ))}
          </select>
        </div>
          {/* DataGrid de MUI */}
          <div className="coord-table-wrapper">
            <Box sx={{ height: 520, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                disableSelectionOnClick
                autoHeight
              />
            </Box>
          </div>
      </div>

      {/* Sección de Gráfico */}
      <div className="coord-section">
        <h2>Distribución por Nivel de Inglés</h2>
        <div className="coord-chart-container">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Nota: la funcionalidad de agregar alumnos fue retirada por petición del usuario. */}
    </div>
  );
}

export default DashboardCoordinador;