import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, useGridApiRef } from '@mui/x-data-grid'; // Importar useGridApiRef
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
  
  // --- Añadido: Referencia para el DataGrid ---
  const apiRef = useGridApiRef(); 

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
    
    // --- Lógica de exportación actualizada para usar la vista filtrada/ordenada del DataGrid ---
    let exportRows = filteredAlumnos; // Fallback a los alumnos filtrados manualmente
    try {
      if (apiRef && apiRef.current) {
        const visibleRowIds = Array.from(apiRef.current.getVisibleRowModels().keys());
        if (visibleRowIds && visibleRowIds.length > 0) {
            // Mapear los IDs visibles a los datos completos de las filas (rows)
            const visibleRowsData = visibleRowIds.map(id => rows.find(row => row.id === id)).filter(Boolean);
             // Mapear esto de vuelta a la estructura de alumno si es necesario, o usar los datos de 'rows'
             // Usaremos los datos de 'rows' que ya están listos para la grilla.
             exportRows = visibleRowsData;
        }
      }
    } catch (e) {
        console.error("Error al obtener filas visibles de DataGrid, usando filtro manual.", e);
        // exportRows ya está seteado a filteredAlumnos
    }
    
    if (!exportRows || exportRows.length === 0) {
      alert('No hay registros para exportar.');
      return;
    }
    
    // Usar las cabeceras y campos del DataGrid (rows)
    const headers = ['N° Control', 'Nombre', 'Carrera', 'Ubicación', 'Estado'];
    // Asegurarse de que los datos de 'rows' se mapean correctamente
    const rowsData = exportRows.map(row => [row.numero_control, row.nombre, row.carrera, row.ubicacion, row.estado]);
    // -------------------------------------------------------------------------------

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
      {/* --- ENCABEZADO MODIFICADO --- */}
      <div className="lista-header">
        <div className="header-actions" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', // Cambiado de 'flex-end'
            alignItems: 'center',      // Añadido para alinear verticalmente
            width: '100%'               // Asegura que ocupe todo el ancho
        }}>
          
          {/* 1. Barra de búsqueda añadida */}
          <input 
            type="text"
            placeholder="🔍 Buscar por Nombre o N° de Control..."
            className="search-input" // Usa la misma clase que en otros listados
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flexGrow: 1, marginRight: '16px' }} // Permite que crezca y añade espacio
          />

          {/* 2. Contenedor para los botones */}
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}> 
            <button className="createbutton" onClick={() => setOpenModal(true)}>Nuevo Alumno</button>
            <button className="createbutton" onClick={exportFilteredToCSV}>Exportar a Excel</button>
          </div>
        </div>
      </div>
      {/* --- FIN DE MODIFICACIÓN --- */}


      {/* Modal del Stepper */}
      <CrearAlumnoModal open={openModal} onClose={() => setOpenModal(false)} agregarAlumno={agregarAlumno} />

      {/* Modales: ver, editar y eliminar alumno (respetan colores institucionales) */}
      <VerAlumnoModal open={openView} onClose={() => setOpenView(false)} alumno={selectedAlumno} />
      <ModificarAlumnoModal open={openEdit} onClose={() => setOpenEdit(false)} alumno={selectedAlumno} actualizarAlumno={actualizarAlumno} />
      <EliminarAlumnoModal open={openDelete} onClose={() => setOpenDelete(false)} alumno={selectedAlumno} eliminarAlumno={eliminarAlumno} />

      {/* DataGrid con toolbar de Material UI */}
      <Box sx={{ height: 600, width: '100%', mt: 2 }}>
        <DataGrid
          apiRef={apiRef} // <-- Añadido apiRef
          rows={rows}
          columns={columns}
          pagination
          pageSizeOptions={[10, 25, 50, 100]}
          disableRowSelectionOnClick
          density="comfortable"
          components={{ Toolbar: GridToolbar }}
          
          componentsProps={{
            toolbar: {
              showQuickFilter: true, 
              quickFilterProps: { debounceMs: 500 },
              printOptions: { 
                disableToolbarButton: false 
              },
              csvOptions: { 
                disableToolbarButton: true // Deshabilitamos el CSV nativo para usar el nuestro
              },
            },
          }}

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