import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import '../../styles/listaEstudiante.css';
import { carrerasOptions } from '../../data/mapping';
import CrearAlumnoModal from './CrearAlumnoModal';
import VerAlumnoModal from './VerAlumnoModal';
import ModificarAlumnoModal from './ModificarAlumnoModal';
import EliminarAlumnoModal from './EliminarAlumnoModal';

export default function ListaEstudianteMUI({ alumnos, toggleEstado, agregarAlumno, actualizarAlumno, eliminarAlumno }) {
  // --- Estados para filtros ---
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('');
  const [selectedCareer, setSelectedCareer] = React.useState('');
  const [selectedLocation, setSelectedLocation] = React.useState('');

  // --- Filtros personalizados ---
  const filteredAlumnos = (alumnos || []).filter(alumno => {
    const term = (searchTerm || '').toLowerCase();
    const matchesSearch =
      !term ||
      (alumno.nombre || '').toLowerCase().includes(term) ||
      (alumno.numero_control || '').toLowerCase().includes(term);
    const matchesStatus = !selectedStatus || alumno.estado === selectedStatus;
    const matchesCareer = !selectedCareer || alumno.carrera === selectedCareer;
    const matchesLocation = !selectedLocation || alumno.ubicacion === selectedLocation;
    return matchesSearch && matchesStatus && matchesCareer && matchesLocation;
  });

  // --- Filas para el DataGrid (usar numero_control como id para unicidad) ---
  const rows = filteredAlumnos.map((alumno) => ({
    id: alumno.numero_control,
    numero_control: alumno.numero_control,
    nombre: alumno.nombre,
    carrera: alumno.carrera === '' ? 'No Aplica' : alumno.carrera,
    ubicacion: alumno.ubicacion,
    estado: alumno.estado,
  }));

  // --- Exportar filtrados a CSV (.csv que abre en Excel) ---
  const exportFilteredToCSV = () => {
    if (!filteredAlumnos || filteredAlumnos.length === 0) {
      alert('No hay registros para exportar.');
      return;
    }
    const headers = ['N° Control', 'Nombre', 'Carrera', 'Ubicación', 'Estado'];
    const rowsData = filteredAlumnos.map(a => [a.numero_control, a.nombre, a.carrera || 'No Aplica', a.ubicacion, a.estado]);
    // Usar punto y coma como separador para compatibilidad regional en Excel
    const csvContent = [headers, ...rowsData].map(e => e.map(v => `"${String(v).replace(/"/g,'""')}"`).join(';')).join('\n');
    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const now = new Date().toISOString().slice(0,10);
    a.download = `alumnos_${now}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // --- Columnas del DataGrid ---
  const columns = [
    { field: 'numero_control', headerName: 'N° Control', width: 150 },
    { field: 'nombre', headerName: 'Nombre Completo', flex: 1, minWidth: 200 },
    { field: 'carrera', headerName: 'Carrera', width: 180 },
    { field: 'ubicacion', headerName: 'Ubicación', width: 180 },
    {
      field: 'estado',
      headerName: 'Estado',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'Activo' ? 'success' : 'error'}
          onClick={() => toggleEstado(params.row.numero_control, 'alumno')}
          sx={{ cursor: 'pointer' }}
        />
      ),
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            className="accion-link view-button"
            title="Ver"
            onClick={() => { const a = (alumnos || []).find(x => x.numero_control === params.row.numero_control); setSelectedAlumno(a); setOpenView(true); }}
          >
            👁️
          </button>
          <button
            className="accion-link icon-button"
            title="Modificar"
            onClick={() => { const a = (alumnos || []).find(x => x.numero_control === params.row.numero_control); setSelectedAlumno(a); setOpenEdit(true); }}
          >
            ✏️
          </button>
          <button
            className="accion-link icon-button"
            title="Eliminar"
            onClick={() => { const a = (alumnos || []).find(x => x.numero_control === params.row.numero_control); setSelectedAlumno(a); setOpenDelete(true); }}
          >
            🗑️
          </button>
        </div>
      ),
    },
  ];

  const [openModal, setOpenModal] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [selectedAlumno, setSelectedAlumno] = React.useState(null);

  return (
    <div className="lista-container">
      {/* Encabezado con botón de creación */}
      <div className="lista-header">
        <div className="header-actions" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="createbutton" onClick={() => setOpenModal(true)}>Nuevo Alumno</button>
          <button className="createbutton" onClick={() => exportFilteredToCSV()} style={{marginLeft:8}}>Exportar a Excel</button>
        </div>
      </div>

  {/* Modal del Stepper */}
  <CrearAlumnoModal open={openModal} onClose={() => setOpenModal(false)} agregarAlumno={agregarAlumno} />

  {/* Modales: ver, editar y eliminar alumno (respetan colores institucionales) */}
  <VerAlumnoModal open={openView} onClose={() => setOpenView(false)} alumno={selectedAlumno} />
  <ModificarAlumnoModal open={openEdit} onClose={() => setOpenEdit(false)} alumno={selectedAlumno} actualizarAlumno={actualizarAlumno} />
  <EliminarAlumnoModal open={openDelete} onClose={() => setOpenDelete(false)} alumno={selectedAlumno} eliminarAlumno={eliminarAlumno} />

      {/* DataGrid con toolbar de Material UI */}
      <Box sx={{ height: 600, width: '100%', mt: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pagination
          pageSizeOptions={[10, 25, 50, 100]}
          disableRowSelectionOnClick
          density="comfortable"
          components={{ Toolbar: GridToolbar }}
          
          // --- SECCIÓN CORREGIDA ---
          componentsProps={{
            toolbar: {
              showQuickFilter: true, // Buscador interno (filtrado rápido)
              quickFilterProps: { debounceMs: 500 },
              
              // Habilita la opción de Imprimir
              printOptions: { 
                disableToolbarButton: false 
              },
              
              // Deshabilita la opción nativa de CSV
              csvOptions: { 
                disableToolbarButton: true 
              },
            },
          }}
          // --- FIN DE SECCIÓN CORREGIDA ---

          initialState={{
            pagination: { paginationModel: { pageSize: 50, page: 0 } },
            sorting: { sortModel: [{ field: 'nombre', sort: 'asc' }] },
          }}
          sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 2,
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f4f4f4',
              fontWeight: 'bold',
            },
          }}
        />
      </Box>
    </div>
  );
}