import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, useGridApiRef } from '@mui/x-data-grid';
import '../../styles/listaEstudiante.css';
import CrearGrupoModal from './CrearGrupoModal';
import VerGrupoModal from './VerGrupoModal';
import ModificarGrupoModal from './ModificarGrupoModal';
import EliminarGrupoModal from './EliminarGrupoModal';

export default function ListaGruposMUI({ grupos = [], profesores = [], alumnos = [], niveles = [], periodos = [], agregarGrupo, actualizarGrupo, eliminarGrupo }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const apiRef = useGridApiRef();

  const currentUser = React.useMemo(() => {
    try { return JSON.parse(localStorage.getItem('currentUser') || 'null'); } catch (e) { return null; }
  }, []);
  const isDirectivo = currentUser && currentUser.role === 'directivo';

  const [openCreate, setOpenCreate] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [selectedGrupo, setSelectedGrupo] = React.useState(null);

  const filtered = (grupos || []).filter(g => {
    const term = (searchTerm || '').toLowerCase();
    return !term || (g.nombre || '').toLowerCase().includes(term) || (g.nivel || '').toLowerCase().includes(term);
  });

  console.log('Grupos filtrados:', filtered.map(g => ({ 
    id: g.id, 
    nombre: g.nombre, 
    profesorId: g.profesorId, 
    profesor_nombre: g.profesor_nombre 
  })));

  const rows = filtered.map(g => ({ 
    id: g.id, 
    nombre: g.nombre, 
    nivel: g.nivel, 
    periodo: periodos.find(p => p.id === g.id_Periodo)?.nombre || 'N/A', 
    ubicacion: g.ubicacion, 
    profesorId: g.profesorId, 
    profesor_nombre: g.profesor_nombre || 'No asignado',
    alumnosCount: g.num_alumnos || (g.alumnoIds ? g.alumnoIds.length : 0)
  }));

  const exportToCSV = () => {
    let exportRows = filtered;
    try {
      if (apiRef && apiRef.current) {
        const visible = Array.from(apiRef.current.getVisibleRowModels().values());
        if (visible && visible.length) exportRows = visible.map(r => r);
      }
    } catch (e) {}
    if (!exportRows || exportRows.length === 0) { alert('No hay registros para exportar.'); return; }
    const headers = ['ID','Nombre','Nivel','Periodo','Ubicación','Profesor','# Alumnos'];
    const rowsData = exportRows.map(a => [a.id, a.nombre, a.nivel, a.periodo, a.ubicacion, (profesores.find(p=>p.numero_empleado===a.profesorId)||{}).nombre||'', a.alumnosCount]);
    const csvContent = [headers, ...rowsData].map(e => e.map(v => `"${String(v).replace(/"/g,'""')}"`).join(';')).join('\n');
    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `grupos_${new Date().toISOString().slice(0,10)}.csv`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const columns = [
    { field: 'nombre', headerName: 'Nombre del Grupo', flex: 1, minWidth: 200 },
    { field: 'nivel', headerName: 'Nivel', width: 140 },
    { field: 'periodo', headerName: 'Periodo', width: 140 },
    { field: 'ubicacion', headerName: 'Ubicación', width: 140 },
    { field: 'profesor_nombre', headerName: 'Profesor', width: 220 },
    { field: 'alumnosCount', headerName: '# Alumnos', width: 120 },
    { field: 'acciones', headerName: 'Acciones', width: 200, sortable: false, renderCell: (params) => {
      const rowId = params && params.row ? params.row.id : null;
      const handleSelect = () => { const g = grupos.find(x => x.id === rowId); setSelectedGrupo(g); };
      return (
        <div className='acciones-cell' style={{ display: 'flex', gap: '0.4rem' }}>
          <button className='view-button icon-button' title='Ver' onClick={() => { handleSelect(); setOpenView(true); }}>👁️</button>
          {!isDirectivo && (
            <>
              <button className='modifybutton icon-button' title='Modificar' onClick={() => { handleSelect(); setOpenEdit(true); }}>✏️</button>
              <button className='deletebutton icon-button' title='Eliminar' onClick={() => { handleSelect(); setOpenDelete(true); }}>🗑️</button>
            </>
          )}
        </div>
      );
    } }
  ];

  return (
    <div className="lista-container">
      <div className="lista-header">
        <div className="header-actions" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <input className="search-input" placeholder="🔍 Buscar por nombre o nivel..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
          {!isDirectivo && (
            <button className='createbutton' onClick={()=>setOpenCreate(true)} style={{ marginLeft: 8 }}>Nuevo Grupo</button>
          )}
          <button className='createbutton' onClick={exportToCSV} style={{ marginLeft: 8 }}>Exportar a Excel</button>
        </div>
      </div>

      <Box sx={{ height: 600, width: '100%', mt: 2 }}>
        <DataGrid apiRef={apiRef} rows={rows} columns={columns} components={{ Toolbar: GridToolbar }} componentsProps={{ toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 300 }, csvOptions: { disableToolbarButton: true } } }} pageSizeOptions={[10,25,50,100]} disableRowSelectionOnClick density="comfortable" initialState={{ pagination: { paginationModel: { pageSize: 50, page: 0 } } }} sx={{ backgroundColor: 'white', borderRadius: 2, boxShadow: 2 }} />
      </Box>

      <CrearGrupoModal open={openCreate} onClose={()=>setOpenCreate(false)} agregarGrupo={agregarGrupo} niveles={niveles} periodos={periodos} profesores={profesores} alumnos={alumnos} />
      <VerGrupoModal open={openView} onClose={()=>setOpenView(false)} grupo={selectedGrupo} profesores={profesores} alumnos={alumnos} periodos={periodos} />
      <ModificarGrupoModal open={openEdit} onClose={()=>setOpenEdit(false)} grupo={selectedGrupo} actualizarGrupo={actualizarGrupo} niveles={niveles} periodos={periodos} profesores={profesores} alumnos={alumnos} />
      <EliminarGrupoModal open={openDelete} onClose={()=>setOpenDelete(false)} grupo={selectedGrupo} eliminarGrupo={eliminarGrupo} />
    </div>
  );
}
