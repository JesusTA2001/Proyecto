import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, useGridApiRef } from '@mui/x-data-grid';
import '../../styles/listaEstudiante.css';
import VerHorarioModal from './VerHorarioModal';

export default function ListaHorarioMUI({ horarios = [], profesores = [], grupos = [] }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const apiRef = useGridApiRef();
  const [openView, setOpenView] = React.useState(false);
  const [selectedProfesor, setSelectedProfesor] = React.useState(null);

  // Agrupar grupos por profesor para crear las filas del DataGrid
  const profesoresConHorario = React.useMemo(() => {
    return profesores.map(prof => {
      const gruposDelProfesor = grupos.filter(g => g.profesorId === prof.numero_empleado);
      const horarios = gruposDelProfesor.map(g => ({
        dia: g.dia,
        hora: g.hora,
        grupo: g.nombre,
        nivel: g.nivel,
        ubicacion: g.ubicacion
      }));
      
      return {
        ...prof,
        horarios,
        cantidadGrupos: gruposDelProfesor.length
      };
    });
  }, [profesores, grupos]);

  const filtered = profesoresConHorario.filter(p => {
    const term = (searchTerm || '').toLowerCase();
    return !term || 
      (p.nombre || '').toLowerCase().includes(term) ||
      (p.apellidoPaterno || '').toLowerCase().includes(term) ||
      (p.apellidoMaterno || '').toLowerCase().includes(term) ||
      (p.ubicacion || '').toLowerCase().includes(term);
  });

  const rows = filtered.map(p => ({ 
    id: p.numero_empleado,
    id_profesor: p.numero_empleado,
    nombre: `${p.apellidoPaterno} ${p.apellidoMaterno} ${p.nombre}`,
    ubicacion: p.ubicacion,
    cantidadGrupos: p.cantidadGrupos,
    estado: p.estado,
    profesor: p
  }));

  const columns = [
    { field: 'id_profesor', headerName: 'ID Profesor', width: 100 },
    { field: 'nombre', headerName: 'Nombre del Profesor', flex: 1, minWidth: 250 },
    { field: 'ubicacion', headerName: 'Ubicación', width: 160 },
    { field: 'cantidadGrupos', headerName: 'Grupos', width: 100 },
    { field: 'estado', headerName: 'Estado', width: 120 },
    { field: 'acciones', headerName: 'Acciones', width: 140, sortable: false, renderCell: (params) => (
      <div style={{ display: 'flex', gap: 8 }}>
        <button 
          className='view-button icon-button' 
          title='Ver Horario Completo' 
          onClick={() => { 
            setSelectedProfesor(params.row.profesor); 
            setOpenView(true); 
          }}>
          👁️
        </button>
      </div>
    )}
  ];

  return (
    <div className="lista-container">
      <div className="lista-header">
        <div className="header-actions" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <input 
            className="search-input" 
            placeholder="🔍 Buscar por nombre de profesor o ubicación..." 
            value={searchTerm} 
            onChange={e=>setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      <Box sx={{ height: 600, width: '100%', mt: 2 }}>
        <DataGrid 
          apiRef={apiRef} 
          rows={rows} 
          columns={columns} 
          components={{ Toolbar: GridToolbar }} 
          componentsProps={{ 
            toolbar: { 
              showQuickFilter: true, 
              quickFilterProps: { debounceMs: 300 } 
            } 
          }} 
          pageSizeOptions={[10,25,50,100]} 
          disableRowSelectionOnClick 
          density="comfortable" 
          initialState={{ 
            pagination: { 
              paginationModel: { pageSize: 50, page: 0 } 
            } 
          }} 
          sx={{ 
            backgroundColor: 'white', 
            borderRadius: 2, 
            boxShadow: 2 
          }} 
        />
      </Box>

      <VerHorarioModal 
        open={openView} 
        onClose={()=>setOpenView(false)} 
        profesor={selectedProfesor} 
        grupos={grupos} 
      />
    </div>
  );
}
