import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, useGridApiRef } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import '../../styles/listaEstudiante.css';
import CrearProfesorModal from './CrearProfesorModal';
import VerProfesorModal from './VerProfesorModal';
import ModificarProfesorModal from './ModificarProfesorModal';
import EliminarProfesorModal from './EliminarProfesorModal';

export default function ListaProfesorMUI({ profesores = [], toggleEstado, agregarProfesor, actualizarProfesor, eliminarProfesor }) {
  // --- Estados de Filtro (Solo término de búsqueda) ---
  const [searchTerm, setSearchTerm] = React.useState('');
  // Se eliminaron selectedLocation y selectedStatus
  const apiRef = useGridApiRef();

  const currentUser = React.useMemo(() => {
    try { return JSON.parse(localStorage.getItem('currentUser') || 'null'); } catch (e) { return null; }
  }, []);
  const isDirectivo = currentUser && currentUser.role === 'directivo';

  // --- Estados de Modales ---
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [selectedProfesor, setSelectedProfesor] = React.useState(null);

  // --- Lógica de Filtrado (Simplificada) ---
  const filtered = (profesores || []).filter(p => {
    const term = (searchTerm || '').toLowerCase();
    const textMatch = !term || (p.nombre || '').toLowerCase().includes(term) || String(p.numero_empleado || '').toLowerCase().includes(term);
    // Se eliminaron locationMatch y statusMatch
    return textMatch;
  });

  // --- Filas para el DataGrid ---
  const rows = filtered.map(p => ({ id: p.numero_empleado, numero_empleado: p.numero_empleado, nombre: p.nombre, ubicacion: p.ubicacion, grado: p.gradoEstudio, estado: p.estado }));

  // --- Lógica de Exportación (Mejorada para usar la vista del DataGrid) ---
  const exportToCSV = () => {
    let exportRows = filtered; // Fallback
    try {
      if (apiRef && apiRef.current) {
        const visible = Array.from(apiRef.current.getVisibleRowModels().values());
        if (visible && visible.length) exportRows = visible.map(r => r);
      }
    } catch (e) {
      console.error("Error al obtener filas visibles, exportando filas filtradas manualmente.", e);
    }

    if (!exportRows || exportRows.length === 0) { alert('No hay registros para exportar.'); return; }

    const headers = ['N° Empleado', 'Nombre', 'Ubicación', 'Grado', 'Estado'];
    const rowsData = exportRows.map(a => [a.numero_empleado, a.nombre, a.ubicacion, a.grado, a.estado]);
    const csvContent = [headers, ...rowsData].map(e => e.map(v => `"${String(v).replace(/"/g,'""')}"`).join(';')).join('\n');
    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const now = new Date().toISOString().slice(0,10);
    a.download = `profesores_${now}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // --- Definición de Columnas ---
  const columns = [
    { field: 'numero_empleado', headerName: 'N° Empleado', width: 150 },
    { field: 'nombre', headerName: 'Nombre Completo', flex: 1, minWidth: 200 },
    { field: 'ubicacion', headerName: 'Ubicación', width: 160 },
    { field: 'grado', headerName: 'Grado de Estudio', width: 160 },
    {
      field: 'estado', headerName: 'Estado', width: 130,
      renderCell: (params) => (
        <Chip label={params.value} color={params.value === 'Activo' ? 'success' : 'error'} onClick={!isDirectivo && toggleEstado ? () => toggleEstado(params.row.numero_empleado, 'profesor') : undefined} sx={{ cursor: isDirectivo ? 'default' : 'pointer' }} disabled={isDirectivo} />
      )
    },
    {
      field: 'acciones', headerName: 'Acciones', width: 200, sortable: false,
      renderCell: (params) => {
        const p = profesores.find(x => x.numero_empleado === params.row.id || x.numero_empleado === params.row.numero_empleado);
        return (
          <div className='acciones-cell' style={{ display: 'flex', gap: '0.4rem' }}>
            <button className='view-button icon-button' title='Ver' onClick={() => { setSelectedProfesor(p); setOpenView(true); }}>👁️</button>
            {!isDirectivo && (
              <>
                <button className='modifybutton icon-button' title='Modificar' onClick={() => { setSelectedProfesor(p); setOpenEdit(true); }}>✏️</button>
                <button className='deletebutton icon-button' title='Eliminar' onClick={() => { setSelectedProfesor(p); setOpenDelete(true); }}>🗑️</button>
              </>
            )}
          </div>
        );
      }
    }
  ];


  return (
    <div className="lista-container">
      {/* --- ENCABEZADO MODIFICADO --- */}
      <div className="lista-header">
        <div className="header-actions" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', // Alinea izquierda y derecha
            alignItems: 'center',            // Centra verticalmente
            width: '100%'
        }}>
          
          {/* 1. Barra de búsqueda (Izquierda) */}
          <input 
            className="search-input" 
            placeholder="🔍 Buscar por nombre o N° empleado..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)}
            style={{ flexGrow: 1, marginRight: '16px' }} // Ocupa espacio disponible
          />
          
          {/* 2. Contenedor de Botones (Derecha) */}
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            {!isDirectivo && (
              <button className='createbutton' onClick={() => setOpenCreate(true)}>Nuevo Profesor</button>
            )}
            <button className='createbutton' onClick={exportToCSV}>Exportar a Excel</button>
          </div>

        </div>
      </div>
      {/* --- FIN DE MODIFICACIÓN --- */}

      <Box sx={{ height: 600, width: '100%', mt: 2 }}>
        <DataGrid
          apiRef={apiRef}
          rows={rows}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          componentsProps={{ toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 300 }, csvOptions: { disableToolbarButton: true } } }}
          pageSizeOptions={[10, 25, 50, 100]}
          disableRowSelectionOnClick
          density="comfortable"
          initialState={{ pagination: { paginationModel: { pageSize: 50, page: 0 } }, sorting: { sortModel: [{ field: 'nombre', sort: 'asc' }] } }}
          sx={{ backgroundColor: 'white', borderRadius: 2, boxShadow: 2 }}
        />
      </Box>
      
      {/* Modales de Profesor */}
      <CrearProfesorModal open={openCreate} onClose={() => setOpenCreate(false)} agregarProfesor={agregarProfesor} />
      <VerProfesorModal open={openView} onClose={() => setOpenView(false)} profesor={selectedProfesor} />
      <ModificarProfesorModal open={openEdit} onClose={() => setOpenEdit(false)} profesor={selectedProfesor} actualizarProfesor={actualizarProfesor} />
      <EliminarProfesorModal open={openDelete} onClose={() => setOpenDelete(false)} profesor={selectedProfesor} eliminarProfesor={eliminarProfesor} />
    </div>
  );
}