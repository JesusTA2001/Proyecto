import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, useGridApiRef } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import '../../styles/listaEstudiante.css';
import CrearAdministradorModal from './CrearAdministradorModal';
import VerAdministradorModal from './VerAdministradorModal';
import ModificarAdministradorModal from './ModificarAdministradorModal';
import EliminarAdministradorModal from './EliminarAdministradorModal';

export default function ListaAdministradorMUI({ administradores = [], toggleEstado, agregarAdministrador, actualizarAdministrador, eliminarAdministrador }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('');
  const apiRef = useGridApiRef();

  const [openCreate, setOpenCreate] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [selectedAdmin, setSelectedAdmin] = React.useState(null);

  const filtered = (administradores || []).filter(a => {
    const term = (searchTerm || '').toLowerCase();
    const matchesSearch = !term || (a.nombre || '').toLowerCase().includes(term) || (a.numero_empleado || '').toLowerCase().includes(term);
    const matchesStatus = !selectedStatus || a.estado === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const rows = filtered.map(a => ({ id: a.numero_empleado, numero_empleado: a.numero_empleado, nombre: a.nombre, estado: a.estado }));

  const exportToCSV = () => {
    let exportRows = filtered;
    try {
      if (apiRef && apiRef.current) {
        const visible = Array.from(apiRef.current.getVisibleRowModels().values());
        if (visible && visible.length) exportRows = visible.map(r => r);
      }
    } catch (e) {}

    if (!exportRows || exportRows.length === 0) { alert('No hay registros para exportar.'); return; }

    const headers = ['N° Empleado', 'Nombre', 'Estado'];
    const rowsData = exportRows.map(a => [a.numero_empleado, a.nombre, a.estado]);
    const csvContent = [headers, ...rowsData].map(e => e.map(v => `"${String(v).replace(/"/g,'""')}"`).join(';')).join('\n');
    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const now = new Date().toISOString().slice(0,10);
    a.download = `administradores_${now}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const columns = [
    { field: 'numero_empleado', headerName: 'N° Empleado', width: 160 },
    { field: 'nombre', headerName: 'Nombre Completo', flex: 1, minWidth: 220 },
    {
      field: 'estado', headerName: 'Estado', width: 140,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'Activo' ? 'success' : 'error'}
          onClick={() => toggleEstado && toggleEstado(params.row.numero_empleado, 'administrador')}
          sx={{ cursor: 'pointer' }}
        />
      )
    },
    {
      field: 'acciones', headerName: 'Acciones', width: 200, sortable: false,
      renderCell: (params) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className='view-button icon-button' title='Ver' onClick={() => { const a = administradores.find(x => x.numero_empleado === params.row.id || x.numero_empleado === params.row.numero_empleado); setSelectedAdmin(a); setOpenView(true); }}>👁️</button>
          <button className='modifybutton icon-button' title='Modificar' onClick={() => { const a = administradores.find(x => x.numero_empleado === params.row.id || x.numero_empleado === params.row.numero_empleado); setSelectedAdmin(a); setOpenEdit(true); }}>✏️</button>
          <button className='deletebutton icon-button' title='Eliminar' onClick={() => { const a = administradores.find(x => x.numero_empleado === params.row.id || x.numero_empleado === params.row.numero_empleado); setSelectedAdmin(a); setOpenDelete(true); }}>🗑️</button>
        </div>
      )
    }
  ];

  return (
    <div className="lista-container">
      <div className="lista-header">
        <div className="header-actions" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <input className="search-input" placeholder="🔍 Buscar por nombre o N° empleado..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <button className='createbutton' onClick={() => setOpenCreate(true)} style={{ marginLeft: 8 }}>Nuevo Administrador</button>
          <button className='createbutton' onClick={exportToCSV} style={{ marginLeft: 8 }}>Exportar a Excel</button>
        </div>
      </div>

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

      {/* Modales */}
      <CrearAdministradorModal open={openCreate} onClose={() => setOpenCreate(false)} agregarAdministrador={agregarAdministrador} />
      <VerAdministradorModal open={openView} onClose={() => setOpenView(false)} admin={selectedAdmin} />
      <ModificarAdministradorModal open={openEdit} onClose={() => setOpenEdit(false)} admin={selectedAdmin} actualizarAdministrador={actualizarAdministrador} />
      <EliminarAdministradorModal open={openDelete} onClose={() => setOpenDelete(false)} admin={selectedAdmin} eliminarAdministrador={eliminarAdministrador} />

    </div>
  );
}
