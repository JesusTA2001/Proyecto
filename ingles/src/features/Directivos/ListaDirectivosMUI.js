import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, useGridApiRef } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import '../../styles/listaEstudiante.css';
import CrearDirectivoCoordinadorModal from './CrearDirectivoCoordinadorModal';
import VerDirectivoCoordinadorModal from './VerDirectivoCoordinadorModal';
import ModificarDirectivoCoordinadorModal from './ModificarDirectivoCoordinadorModal';
import RestablecerContrasenaModal from '../Auth/RestablecerContrasenaModal';

const normalize = (str) => (str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function ListaDirectivosMUI({
  registros = [],
  toggleEstadoDirectivo,
  agregarDirectivoCoordinador,
  actualizarDirectivoCoordinador
}) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const apiRef = useGridApiRef();

  const currentUser = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('currentUser') || 'null');
    } catch (e) {
      return null;
    }
  }, []);
  const isDirectivo = currentUser && currentUser.role === 'directivo';

  const [openCreate, setOpenCreate] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openReset, setOpenReset] = React.useState(false);
  const [selectedRegistro, setSelectedRegistro] = React.useState(null);

  const filtered = (registros || []).filter((r) => {
    const term = normalize(searchTerm);
    if (!term) return true;
    return normalize(r.nombreCompleto).includes(term) || normalize(String(r.numero_empleado)).includes(term);
  });

  const rows = filtered.map((r) => ({
    id: `${r.tipoRol}-${r.id_rol}`,
    id_rol: r.id_rol,
    tipoRol: r.tipoRol,
    numero_empleado: r.numero_empleado,
    nombreCompleto: r.nombreCompleto,
    estado: r.estado,
    email: r.email,
    CURP: r.CURP,
    telefono: r.telefono,
    direccion: r.direccion,
    genero: r.genero,
    RFC: r.RFC,
    apellidoPaterno: r.apellidoPaterno,
    apellidoMaterno: r.apellidoMaterno,
    nombre: r.nombre
  }));

  const exportToCSV = () => {
    let exportRows = filtered;
    try {
      if (apiRef && apiRef.current) {
        const visible = Array.from(apiRef.current.getVisibleRowModels().values());
        if (visible && visible.length) exportRows = visible.map((r) => r);
      }
    } catch (e) {}

    if (!exportRows || exportRows.length === 0) {
      alert('No hay registros para exportar.');
      return;
    }

    const headers = ['N° Empleado', 'Tipo', 'Nombre Completo', 'Estado'];
    const rowsData = exportRows.map((r) => [r.numero_empleado, r.tipoRol, r.nombreCompleto, r.estado]);
    const csvContent = [headers, ...rowsData].map((e) => e.join(',')).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const now = new Date().toISOString().slice(0, 10);
    a.download = `directivos_coordinadores_${now}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const columns = [
    { field: 'numero_empleado', headerName: 'N° Empleado', width: 160 },
    { field: 'tipoRol', headerName: 'Tipo', width: 150 },
    { field: 'nombreCompleto', headerName: 'Nombre Completo', flex: 1, minWidth: 240 },
    {
      field: 'estado',
      headerName: 'Estado',
      width: 140,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'Activo' ? 'success' : 'error'}
          onClick={!isDirectivo && toggleEstadoDirectivo ? () => toggleEstadoDirectivo(params.row.id_rol, params.row.tipoRol) : undefined}
          sx={{ cursor: isDirectivo ? 'default' : 'pointer' }}
          disabled={isDirectivo}
        />
      )
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 190,
      sortable: false,
      renderCell: (params) => {
        const original = registros.find((x) => x.id_rol === params.row.id_rol && x.tipoRol === params.row.tipoRol) || params.row;
        return (
          <div className='acciones-cell' style={{ display: 'flex', gap: '0.5rem' }}>
            <button className='view-button icon-button' title='Ver' onClick={() => { setSelectedRegistro(original); setOpenView(true); }}>👁️</button>
            {!isDirectivo && (
              <>
                <button className='modifybutton icon-button' title='Modificar' onClick={() => { setSelectedRegistro(original); setOpenEdit(true); }}>✏️</button>
                <Tooltip title='Restablecer contraseña'>
                  <button
                    className='icon-button'
                    title='Restablecer contraseña'
                    onClick={() => { setSelectedRegistro(original); setOpenReset(true); }}
                    style={{ color: '#d97706', background: 'none', border: 'none', boxShadow: 'none' }}
                  >
                    <VpnKeyIcon fontSize='small' />
                  </button>
                </Tooltip>
              </>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className='lista-container'>
      <div className='lista-header'>
        <div className='header-actions' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <input
            className='search-input'
            placeholder='🔍 Buscar por nombre completo o N° empleado...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flexGrow: 1, marginRight: '16px' }}
          />

          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            {!isDirectivo && (
              <button className='createbutton' onClick={() => setOpenCreate(true)}>Nuevo</button>
            )}
            <button className='createbutton' onClick={exportToCSV}>Exportar a Excel</button>
          </div>
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
          density='comfortable'
          initialState={{ pagination: { paginationModel: { pageSize: 50, page: 0 } }, sorting: { sortModel: [{ field: 'nombreCompleto', sort: 'asc' }] } }}
          sx={{ backgroundColor: 'white', borderRadius: 2, boxShadow: 2 }}
        />
      </Box>

      <CrearDirectivoCoordinadorModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        agregarDirectivoCoordinador={agregarDirectivoCoordinador}
      />
      <VerDirectivoCoordinadorModal open={openView} onClose={() => setOpenView(false)} registro={selectedRegistro} />
      <ModificarDirectivoCoordinadorModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        registro={selectedRegistro}
        actualizarDirectivoCoordinador={actualizarDirectivoCoordinador}
      />
      <RestablecerContrasenaModal
        open={openReset}
        onClose={() => setOpenReset(false)}
        tipoUsuario={selectedRegistro?.tipoRol || 'directivo'}
        idRelacion={selectedRegistro?.id_rol}
        nombreCompleto={selectedRegistro?.nombreCompleto}
      />
    </div>
  );
}
