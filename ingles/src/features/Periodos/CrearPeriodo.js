import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, Button, Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import api from '../../api/axios';

function CrearPeriodo({ open, onClose, onPeriodoCreado }) {
  const [periodo, setPeriodo] = useState({
    descripcion: '1', // 1 o 2 para semestre
    año: new Date().getFullYear(),
    fechaFin: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPeriodo(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!periodo.descripcion || !periodo.año || !periodo.fechaFin) {
      setError('Todos los campos son obligatorios');
      return;
    }

    // Validar que el año sea actual o futuro
    const añoActual = new Date().getFullYear();
    if (parseInt(periodo.año) < añoActual) {
      setError('El año debe ser el actual o posterior');
      return;
    }

    // Validar formato de fecha
    const fechaFin = new Date(periodo.fechaFin);
    if (isNaN(fechaFin.getTime())) {
      setError('Fecha de término inválida');
      return;
    }

    setLoading(true);

    try {
      // Calcular fecha de inicio según el semestre
      let fechaInicio;
      if (periodo.descripcion === '1') {
        // Semestre 1: inicia en febrero
        fechaInicio = `${periodo.año}-02-01`;
      } else {
        // Semestre 2: inicia en agosto
        fechaInicio = `${periodo.año}-08-01`;
      }

      const response = await api.post('/periodos', {
        descripcion: `${periodo.año}-${periodo.descripcion}`,
        año: parseInt(periodo.año),
        fecha_inicio: fechaInicio,
        fecha_fin: periodo.fechaFin
      });

      if (response.data.success) {
        onPeriodoCreado(response.data.periodo);
        setPeriodo({
          descripcion: '1',
          año: new Date().getFullYear(),
          fechaFin: ''
        });
        onClose();
      }
    } catch (error) {
      console.error('Error al crear periodo:', error);
      setError(error.response?.data?.message || 'Error al crear el periodo');
    } finally {
      setLoading(false);
    }
  };

  const añoActual = new Date().getFullYear();
  const años = Array.from({ length: 5 }, (_, i) => añoActual + i);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Crear Nuevo Periodo
        <Tooltip 
          title={
            <div style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
              <strong>Formato de periodo:</strong><br/>
              • Año-Semestre (ej: 2025-1, 2026-2)<br/><br/>
              <strong>Semestre 1:</strong> Febrero - Junio<br/>
              <strong>Semestre 2:</strong> Agosto - Enero (siguiente año)
            </div>
          }
          placement="right"
          arrow
        >
          <IconButton size="small" sx={{ ml: 1 }}>
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <div style={{ 
              padding: '10px', 
              marginBottom: '15px', 
              backgroundColor: '#fee2e2', 
              color: '#dc2626', 
              borderRadius: '4px',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem', color: '#374151' }}>
              Semestre *
            </label>
            <Select
              name="descripcion"
              value={periodo.descripcion}
              onChange={handleChange}
              fullWidth
              size="small"
            >
              <MenuItem value="1">Semestre 1 (Febrero - Junio)</MenuItem>
              <MenuItem value="2">Semestre 2 (Agosto - Enero)</MenuItem>
            </Select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem', color: '#374151' }}>
              Año *
            </label>
            <Select
              name="año"
              value={periodo.año}
              onChange={handleChange}
              fullWidth
              size="small"
            >
              {años.map(año => (
                <MenuItem key={año} value={año}>{año}</MenuItem>
              ))}
            </Select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem', color: '#374151' }}>
              Fecha de Término *
            </label>
            <TextField
              type="date"
              name="fechaFin"
              value={periodo.fechaFin}
              onChange={handleChange}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: `${añoActual}-01-01`
              }}
            />
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
              {periodo.descripcion === '1' 
                ? 'Recomendado: 30 de Junio' 
                : 'Recomendado: 30 de Enero (del año siguiente)'}
            </div>
          </div>

          <div style={{ 
            padding: '12px', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '6px',
            fontSize: '0.875rem',
            color: '#4b5563'
          }}>
            <strong>Vista previa:</strong> {periodo.año}-{periodo.descripcion}
            <br/>
            <strong>Tipo:</strong> Semestre {periodo.descripcion} 
            ({periodo.descripcion === '1' ? 'Feb-Jun' : 'Ago-Ene'})
          </div>
        </DialogContent>

        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            sx={{ 
              backgroundColor: '#3b82f6',
              '&:hover': { backgroundColor: '#2563eb' }
            }}
          >
            {loading ? 'Creando...' : 'Crear Periodo'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CrearPeriodo;
