import React, { useEffect, useState, useCallback } from 'react';
import { Button, Paper, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import api from '../../api/axios';
import { Link as RouterLink } from 'react-router-dom';

export default function HistorialGrupos() {
  const [periodos, setPeriodos] = useState([]);
  const [periodoSel, setPeriodoSel] = useState('');
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // fetch periodos from API if available
    const fetchPeriodos = async () => {
      try {
        const res = await api.get('/periodos');
        if (res.data && Array.isArray(res.data)) setPeriodos(res.data);
      } catch (e) {
        // ignore
      }
    };
    fetchPeriodos();
  }, []);

  const fetchHistorial = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const url = periodoSel ? `/grupos/historial?id_Periodo=${periodoSel}` : '/grupos/historial';
      const res = await api.get(url);
      if (res.data && res.data.success) {
        const filtered = (res.data.grupos || []).filter(g => Array.isArray(g.alumnos) && g.alumnos.length > 0);
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
  }, [periodoSel]);

  useEffect(() => {
    fetchHistorial();
  }, [fetchHistorial]);

  const rows = grupos.map((g, idx) => ({
    id: g.id_Grupo || idx,
    grupo: g.grupo,
    nivel: g.nivel_nombre || g.id_Nivel,
    periodo: g.periodo_nombre || g.id_Periodo,
    alumnosCount: Array.isArray(g.alumnos) ? g.alumnos.length : 0,
  }));

  const columns = [
    { field: 'grupo', headerName: 'Grupo', width: 240 },
    { field: 'nivel', headerName: 'Nivel', width: 140 },
    { field: 'periodo', headerName: 'Periodo', width: 200 },
    { field: 'alumnosCount', headerName: 'Alumnos Concluidos', width: 180 },
    {
      field: 'actions', headerName: 'Acciones', width: 180, renderCell: (params) => {
        const g = grupos.find(x => (x.id_Grupo || x.id) === params.id);
        return (
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="outlined" size="small" component={RouterLink} to={`/profesores/historial/${params.id}`}>
              Ver detalle
            </Button>
            <Button variant="contained" color="success" size="small" onClick={() => exportGrupo(g)}>
              Exportar Excel
            </Button>
          </div>
        );
      }
    }
  ];

  const exportGrupo = (grupo) => {
    // placeholder: implement export on demand
    console.log('Exportar Excel para grupo', grupo);
    alert('Exportar Excel no implementado en este entorno.');
  };

  return (
    <Paper style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Typography variant="h6">Historial de Grupos (Concluidos)</Typography>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select value={periodoSel} onChange={(e) => setPeriodoSel(e.target.value)} className="form-select">
            <option value="">Todos</option>
            {periodos.map(p => <option key={p.id_Periodo} value={p.id_Periodo}>{p.descripcion || p.nombre || p.id_Periodo}</option>)}
          </select>
        </div>
      </div>

      {error && <div style={{ color: '#b91c1c', marginBottom: 12 }}>{error}</div>}

      <div style={{ height: 480, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10, 25, 50]} components={{ Toolbar: GridToolbar }} loading={loading} />
      </div>
    </Paper>
  );
}
