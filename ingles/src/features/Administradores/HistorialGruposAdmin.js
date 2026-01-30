import React, { useEffect, useState } from 'react';
import { Button, Paper, Typography, Modal, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import api from '../../api/axios';

export default function HistorialGruposAdmin() {
  const [periodos, setPeriodos] = useState([]);
  const [periodoSel, setPeriodoSel] = useState('');
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Para el modal de ver calificaciones
  const [openCalificaciones, setOpenCalificaciones] = useState(false);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
  const [calificacionesGrupo, setCalificacionesGrupo] = useState([]);

  // Cargar períodos al montar el componente
  useEffect(() => {
    const fetchPeriodos = async () => {
      try {
        const res = await api.get('/periodos');
        // El endpoint devuelve directamente un array
        if (res.data && Array.isArray(res.data)) {
          setPeriodos(res.data);
        }
      } catch (e) {
        console.error('Error cargando períodos:', e);
      }
    };
    fetchPeriodos();
  }, []);

  // Cargar historial de grupos (con filtro opcional)
  const fetchHistorial = async () => {
    setLoading(true);
    setError('');
    try {
      const url = periodoSel ? `/grupos/historial?id_Periodo=${periodoSel}` : '/grupos/historial';
      console.log('Obteniendo historial desde:', url);
      const res = await api.get(url);
      console.log('Respuesta del servidor:', res.data);
      if (res.data && res.data.success) {
        console.log('Grupos recibidos:', res.data.grupos);
        const filtered = (res.data.grupos || []).filter(g => Array.isArray(g.alumnos) && g.alumnos.length > 0);
        console.log('Grupos después de filtrar (con alumnos):', filtered);
        setGrupos(filtered);
      } else {
        setGrupos([]);
        setError('Respuesta inesperada del servidor.');
      }
    } catch (e) {
      console.error('Error al cargar historial de grupos:', e);
      setError('Error al cargar historial. Revisa la consola.');
      setGrupos([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar historial al montar y cuando cambia el período
  useEffect(() => {
    fetchHistorial();
  }, []);

  // Abrir modal de calificaciones
  const handleVerCalificaciones = async (grupo) => {
    setGrupoSeleccionado(grupo);
    setOpenCalificaciones(true);
    
    try {
      const res = await api.get(`/calificaciones/grupo/${grupo.id_Grupo}`);
      if (res.data && Array.isArray(res.data.calificaciones)) {
        setCalificacionesGrupo(res.data.calificaciones);
      }
    } catch (e) {
      console.error('Error cargando calificaciones:', e);
      setCalificacionesGrupo([]);
    }
  };

  // Cerrar modal
  const handleCloseCalificaciones = () => {
    setOpenCalificaciones(false);
    setGrupoSeleccionado(null);
    setCalificacionesGrupo([]);
  };

  // Exportar calificaciones a CSV (misma lógica que en AsignarCalificaciones)
  const exportarCalificacionesCSV = (grupo) => {
    if (!calificacionesGrupo || calificacionesGrupo.length === 0) {
      alert('No hay calificaciones para exportar');
      return;
    }

    const rows = calificacionesGrupo.map((cal, idx) => ({
      No: String(idx + 1).padStart(2, '0'),
      Control: cal.nControl,
      Parcial1: cal.parcial1 || '-',
      Parcial2: cal.parcial2 || '-',
      Parcial3: cal.parcial3 || '-',
      'Calificación Final': cal.final || '-',
    }));

    const csvHeader = Object.keys(rows[0] || {}).join(',') + '\r\n';
    const csvBody = rows.map(r => Object.values(r).join(',')).join('\r\n');
    const csv = csvHeader + csvBody;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const groupName = grupo.grupo.replace(/\s+/g, '_');
    link.setAttribute('download', `calificaciones_${groupName}_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Preparar filas para DataGrid
  const rows = grupos.map((g, idx) => ({
    id: g.id_Grupo || idx,
    grupo: g.grupo,
    nivel: g.nivel_nombre || g.id_Nivel,
    periodo: g.periodo_descripcion || g.periodo_nombre || g.id_Periodo,
    alumnosCount: Array.isArray(g.alumnos) ? g.alumnos.length : 0,
  }));

  // Columnas para DataGrid
  const columns = [
    { field: 'grupo', headerName: 'Grupo', width: 200, flex: 1 },
    { field: 'nivel', headerName: 'Nivel', width: 150, flex: 0.8 },
    { field: 'periodo', headerName: 'Período', width: 180, flex: 1 },
    { field: 'alumnosCount', headerName: 'Estudiantes', width: 140, flex: 0.8 },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 280,
      flex: 1.2,
      sortable: false,
      renderCell: (params) => {
        const g = grupos.find(x => (x.id_Grupo || x.id) === params.id);
        return (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="small"
              onClick={() => handleVerCalificaciones(g)}
              style={{ whiteSpace: 'nowrap' }}
            >
              👁️ Ver Calificaciones
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <div style={{ padding: 16 }}>
      <Paper style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: 8 }}>
              Historial de Grupos (Períodos Finalizados)
            </Typography>
            <Typography variant="body2" style={{ color: '#666' }}>
              Consulta los grupos concluidos y sus calificaciones. Puedes filtrar por período académico.
            </Typography>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <select 
              value={periodoSel} 
              onChange={(e) => setPeriodoSel(e.target.value)} 
              className="form-select"
              style={{ padding: '8px 12px', borderRadius: 4, border: '1px solid #ddd' }}
            >
              <option value="">Todos los Períodos</option>
              {periodos.map(p => (
                <option key={p.id} value={p.id}>
                  {p.descripcion || p.nombre || `Período ${p.id}`}
                </option>
              ))}
            </select>
            <Button variant="contained" color="primary" onClick={fetchHistorial}>
              Filtrar
            </Button>
          </div>
        </div>

        {error && (
          <div style={{ color: '#b91c1c', marginBottom: 16, padding: 12, backgroundColor: '#fee2e2', borderRadius: 4 }}>
            {error}
          </div>
        )}

        <div style={{ height: 480, width: '100%' }}>
          <DataGrid 
            rows={rows} 
            columns={columns} 
            pageSize={10} 
            rowsPerPageOptions={[10, 25, 50]}
            components={{ Toolbar: GridToolbar }} 
            loading={loading}
            experimentalFeatures={{ newEditingApi: true }}
            sx={{
              '& .MuiDataGrid-root': {
                fontFamily: 'inherit',
              },
              '& .MuiDataGrid-cell': {
                paddingY: 1,
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 'bold',
              }
            }}
          />
        </div>
      </Paper>

      {/* Modal para ver calificaciones detalladas */}
      <Modal open={openCalificaciones} onClose={handleCloseCalificaciones}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: '90vh',
            overflowY: 'auto',
            minWidth: '600px',
            maxWidth: '900px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                Calificaciones - {grupoSeleccionado?.grupo}
              </Typography>
              {grupoSeleccionado && (
                <Typography variant="body2" style={{ color: '#666', marginTop: 4 }}>
                  Nivel: {grupoSeleccionado.nivel_nombre || grupoSeleccionado.id_Nivel} | 
                  Período: {grupoSeleccionado.periodo_descripcion || grupoSeleccionado.periodo_nombre || grupoSeleccionado.id_Periodo}
                </Typography>
              )}
            </div>
            <Button 
              variant="contained" 
              color="success" 
              onClick={() => exportarCalificacionesCSV(grupoSeleccionado)}
              style={{ marginRight: 8 }}
            >
              📥 Exportar Excel
            </Button>
            <Button variant="outlined" onClick={handleCloseCalificaciones}>
              Cerrar
            </Button>
          </div>

          {calificacionesGrupo.length > 0 ? (
            <TableContainer>
              <Table size="small" style={{ marginTop: 12 }}>
                <TableHead>
                  <TableRow style={{ backgroundColor: '#00903D' }}>
                    <TableCell style={{ color: 'white', fontWeight: 'bold' }}>No. Control</TableCell>
                    <TableCell align="center" style={{ color: 'white', fontWeight: 'bold' }}>Parcial 1</TableCell>
                    <TableCell align="center" style={{ color: 'white', fontWeight: 'bold' }}>Parcial 2</TableCell>
                    <TableCell align="center" style={{ color: 'white', fontWeight: 'bold' }}>Parcial 3</TableCell>
                    <TableCell align="center" style={{ color: 'white', fontWeight: 'bold' }}>Calificación Final</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {calificacionesGrupo.map((cal, idx) => (
                    <TableRow key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f9fafb' : 'white' }}>
                      <TableCell>{cal.nControl}</TableCell>
                      <TableCell align="center">{cal.parcial1 || '-'}</TableCell>
                      <TableCell align="center">{cal.parcial2 || '-'}</TableCell>
                      <TableCell align="center">{cal.parcial3 || '-'}</TableCell>
                      <TableCell 
                        align="center" 
                        style={{ 
                          fontWeight: 'bold',
                          color: cal.final >= 70 ? '#059669' : '#dc2626'
                        }}
                      >
                        {cal.final || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography style={{ marginTop: 16, color: '#666' }}>
              No hay calificaciones registradas para este grupo.
            </Typography>
          )}
        </Box>
      </Modal>
    </div>
  );
}

