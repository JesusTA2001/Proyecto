import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Chip,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import api from '../../api/axios';
import CrearPeriodo from './CrearPeriodo';
import '../../styles/perfil-usuario.css';

function AdministrarPeriodos() {
  const [periodos, setPeriodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCrear, setOpenCrear] = useState(false);
  const [periodoModificar, setPeriodoModificar] = useState(null);

  useEffect(() => {
    cargarPeriodos();
  }, []);

  const cargarPeriodos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/periodos');
      setPeriodos(response.data || []);
    } catch (error) {
      console.error('Error al cargar periodos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodoCreado = (nuevoPeriodo) => {
    cargarPeriodos();
  };

  const handlePeriodoModificado = () => {
    cargarPeriodos();
    setPeriodoModificar(null);
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-MX', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getEstadoPeriodo = (fechaFin) => {
    if (!fechaFin) return { label: 'Sin fecha', color: 'default' };
    
    const hoy = new Date();
    const fin = new Date(fechaFin);
    
    if (fin < hoy) {
      return { label: 'Finalizado', color: 'error' };
    } else if (fin.getTime() - hoy.getTime() < 30 * 24 * 60 * 60 * 1000) {
      return { label: 'Por finalizar', color: 'warning' };
    } else {
      return { label: 'Activo', color: 'success' };
    }
  };

  const getSemestreInfo = (descripcion) => {
    if (descripcion?.includes('-1')) {
      return { tipo: 'Semestre 1', periodo: 'Feb - Jun', color: '#3b82f6', icono: '📘' };
    } else if (descripcion?.includes('-2')) {
      return { tipo: 'Semestre 2', periodo: 'Ago - Ene', color: '#8b5cf6', icono: '📗' };
    } else if (descripcion?.includes('-I1')) {
      return { tipo: 'Intensivo 1', periodo: 'Feb - Jun (2 niveles)', color: '#f59e0b', icono: '⚡' };
    } else if (descripcion?.includes('-I2')) {
      return { tipo: 'Intensivo 2', periodo: 'Ago - Ene (2 niveles)', color: '#ef4444', icono: '⚡' };
    } else if (descripcion?.includes('-V')) {
      return { tipo: 'Verano', periodo: 'Julio (1 nivel)', color: '#10b981', icono: '☀️' };
    }
    return { tipo: 'Desconocido', periodo: 'Sin definir', color: '#6b7280', icono: '❓' };
  };

  if (loading) {
    return (
      <div className="da-container">
        <div className="da-header">
          <h1>Cargando periodos...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="da-container">
      <div className="da-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <h1>Administrar Periodos</h1>
            <p>Gestión de periodos escolares y semestres</p>
          </div>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCrear(true)}
            sx={{ 
              fontSize: '1.01em',
              fontWeight: 'bold',
              padding: '10px 20px',
              borderRadius: '10px',
              border: '2px solid green',
              boxShadow: '2px 2px 10px black',
              color: 'white',
              backgroundColor: '#00903D',
              '&:hover': { 
                backgroundColor: '#007a33',
                cursor: 'pointer'
              }
            }}
          >
            Nuevo Periodo
          </Button>
        </div>
      </div>

      <Box sx={{ padding: '20px' }}>
        <TableContainer component={Paper} sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f9fafb' }}>
              <TableRow>
                <TableCell><strong>Periodo</strong></TableCell>
                <TableCell><strong>Tipo</strong></TableCell>
                <TableCell><strong>Año</strong></TableCell>
                <TableCell><strong>Fecha Inicio</strong></TableCell>
                <TableCell><strong>Fecha Fin</strong></TableCell>
                <TableCell><strong>Estado</strong></TableCell>
                <TableCell align="center"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {periodos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ padding: '40px' }}>
                    <CalendarTodayIcon sx={{ fontSize: 48, color: '#9ca3af', marginBottom: '10px' }} />
                    <Typography variant="body1" color="textSecondary">
                      No hay periodos registrados
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => setOpenCrear(true)}
                      sx={{ marginTop: '15px' }}
                    >
                      Crear Primer Periodo
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                periodos.map((periodo) => {
                  const estado = getEstadoPeriodo(periodo.fecha_fin);
                  const semestreInfo = getSemestreInfo(periodo.descripcion);
                  
                  return (
                    <TableRow key={periodo.id_Periodo} hover>
                      <TableCell>
                        <strong>{periodo.descripcion}</strong>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={`${semestreInfo.icono} ${semestreInfo.tipo}`}
                          size="small"
                          sx={{ 
                            backgroundColor: semestreInfo.color,
                            color: 'white',
                            fontWeight: '500'
                          }}
                        />
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
                          {semestreInfo.periodo}
                        </div>
                      </TableCell>
                      <TableCell>{periodo.año}</TableCell>
                      <TableCell>{formatearFecha(periodo.fecha_inicio)}</TableCell>
                      <TableCell>{formatearFecha(periodo.fecha_fin)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={estado.label} 
                          color={estado.color} 
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <button
                          onClick={() => setPeriodoModificar(periodo)}
                          title="Modificar periodo"
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1.2em',
                            padding: '4px 8px'
                          }}
                        >
                          ✏️
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Dialog para crear periodo */}
      <CrearPeriodo
        open={openCrear}
        onClose={() => setOpenCrear(false)}
        onPeriodoCreado={handlePeriodoCreado}
      />

      {/* Dialog para modificar periodo */}
      {periodoModificar && (
        <CrearPeriodo
          open={Boolean(periodoModificar)}
          onClose={() => setPeriodoModificar(null)}
          onPeriodoCreado={handlePeriodoModificado}
          periodoEditar={periodoModificar}
        />
      )}
    </div>
  );
}

export default AdministrarPeriodos;
