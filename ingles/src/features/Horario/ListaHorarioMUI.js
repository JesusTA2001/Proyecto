import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, useGridApiRef } from '@mui/x-data-grid';
import '../../styles/listaEstudiante.css';
import VerHorarioModal from './VerHorarioModal';

export default function ListaHorarioMUI({ profesores = [], grupos = [] }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const apiRef = useGridApiRef();
  const [openView, setOpenView] = React.useState(false);
  const [selectedProfesor, setSelectedProfesor] = React.useState(null);

  const filtered = (profesores || []).filter(p => {
    const term = (searchTerm || '').toLowerCase();
    return !term || (p.nombre || '').toLowerCase().includes(term) || (p.numero_empleado || '').toLowerCase().includes(term);
  });

  const rows = filtered.map(p => ({ id: p.numero_empleado, numero_empleado: p.numero_empleado, nombre: p.nombre, ubicacion: p.ubicacion, correo: p.correo }));

  const columns = [
    { field: 'numero_empleado', headerName: 'N° Empleado', width: 150 },
    { field: 'nombre', headerName: 'Nombre', flex: 1, minWidth: 180 },
    { field: 'ubicacion', headerName: 'Ubicación', width: 160 },
    { field: 'correo', headerName: 'Correo', width: 220 },
    { field: 'acciones', headerName: 'Acciones', width: 140, sortable: false, renderCell: (params) => (
      <div style={{ display: 'flex', gap: 8 }}>
        <button className='view-button icon-button' title='Ver Horario' onClick={() => { const prof = profesores.find(x => x.numero_empleado === params.row.id); setSelectedProfesor(prof); setOpenView(true); }}>👁️</button>
      </div>
    )}
  ];

  return (
    <div className="lista-container">
      <div className="lista-header">
        <div className="header-actions" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <input className="search-input" placeholder="🔍 Buscar por nombre o N° empleado..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
        </div>
      </div>

      <Box sx={{ height: 600, width: '100%', mt: 2 }}>
        <DataGrid apiRef={apiRef} rows={rows} columns={columns} components={{ Toolbar: GridToolbar }} componentsProps={{ toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 300 } } }} pageSizeOptions={[10,25,50,100]} disableRowSelectionOnClick density="comfortable" initialState={{ pagination: { paginationModel: { pageSize: 50, page: 0 } } }} sx={{ backgroundColor: 'white', borderRadius: 2, boxShadow: 2 }} />
      </Box>

      <VerHorarioModal open={openView} onClose={()=>setOpenView(false)} profesor={selectedProfesor} grupos={grupos} />
    </div>
  );
}
