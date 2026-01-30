import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, Button, Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import api from '../../api/axios';

function CrearPeriodo({ open, onClose, onPeriodoCreado, periodoEditar }) {
  const [periodo, setPeriodo] = useState({
    descripcion: '1', // 1 o 2 para semestre
    año: new Date().getFullYear(),
    fechaInicio: '',
    fechaFin: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Cargar datos del periodo a editar
  useEffect(() => {
    if (periodoEditar) {
      console.log('Cargando periodo para editar:', periodoEditar);
      // Extraer semestre y año de la descripción (ej: "2025-1" -> año=2025, semestre=1)
      const partes = periodoEditar.descripcion.split('-');
      const formatFecha = (fecha) => {
        if (!fecha) return '';
        const date = new Date(fecha);
        // Ajustar por zona horaria
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      const formData = {
        descripcion: partes[1] || '1',
        año: parseInt(partes[0]) || new Date().getFullYear(),
        fechaInicio: formatFecha(periodoEditar.fecha_inicio),
        fechaFin: formatFecha(periodoEditar.fecha_fin)
      };
      
      console.log('Datos del formulario cargados:', formData);
      setPeriodo(formData);
    } else {
      // Reset al formulario inicial cuando no hay periodo a editar
      setPeriodo({
        descripcion: '1',
        año: new Date().getFullYear(),
        fechaInicio: '',
        fechaFin: ''
      });
    }
  }, [periodoEditar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPeriodo(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!periodo.descripcion || !periodo.año || !periodo.fechaInicio || !periodo.fechaFin) {
      setError('Todos los campos son obligatorios');
      return;
    }

    // Validar que el año sea actual o futuro (solo para crear, no para editar)
    if (!periodoEditar) {
      const añoActual = new Date().getFullYear();
      if (parseInt(periodo.año) < añoActual) {
        setError('El año debe ser el actual o posterior');
        return;
      }
    }

    // Validar formato de fechas
    const fechaInicio = new Date(periodo.fechaInicio);
    const fechaFin = new Date(periodo.fechaFin);
    if (isNaN(fechaInicio.getTime())) {
      setError('Fecha de inicio inválida');
      return;
    }
    if (isNaN(fechaFin.getTime())) {
      setError('Fecha de término inválida');
      return;
    }

    // Validar que fecha fin sea posterior a fecha inicio
    if (fechaFin <= fechaInicio) {
      setError('La fecha de término debe ser posterior a la fecha de inicio');
      return;
    }

    setLoading(true);
    setError(''); // Limpiar errores previos

    try {
      const dataPeriodo = {
        descripcion: `${periodo.año}-${periodo.descripcion}`,
        año: parseInt(periodo.año),
        fecha_inicio: periodo.fechaInicio,
        fecha_fin: periodo.fechaFin
      };

      console.log('Enviando datos:', dataPeriodo);
      console.log('Modo edición:', periodoEditar ? 'Sí' : 'No');
      console.log('ID Periodo:', periodoEditar?.id_Periodo);
      console.log('Tipo de ID:', typeof periodoEditar?.id_Periodo);
      console.log('ID como string:', String(periodoEditar?.id_Periodo));

      let response;
      if (periodoEditar) {
        // Modo edición
        const url = `/periodos/${periodoEditar.id_Periodo}`;
        console.log('URL construida:', url);
        response = await api.put(url, dataPeriodo);
      } else {
        // Modo creación
        response = await api.post('/periodos', dataPeriodo);
      }

      console.log('Respuesta del servidor:', response.data);

      if (response.data.success) {
        onPeriodoCreado(response.data.periodo);
        setPeriodo({
          descripcion: '1',
          año: new Date().getFullYear(),
          fechaInicio: '',
          fechaFin: ''
        });
        onClose();
      } else {
        setError(response.data.message || 'Error desconocido');
      }
    } catch (error) {
      console.error(`Error al ${periodoEditar ? 'modificar' : 'crear'} periodo:`, error);
      console.error('Detalles del error:', error.response?.data);
      setError(error.response?.data?.message || `Error al ${periodoEditar ? 'modificar' : 'crear'} el periodo`);
    } finally {
      setLoading(false);
    }
  };

  const añoActual = new Date().getFullYear();
  // Generar años desde 2 años atrás hasta 5 años adelante para permitir editar periodos pasados
  const años = Array.from({ length: 8 }, (_, i) => añoActual - 2 + i);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {periodoEditar ? 'Modificar Periodo' : 'Crear Nuevo Periodo'}
        <Tooltip 
          title={
            <div style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
              <strong>Formatos de periodo:</strong><br/>
              • Semestre: 2025-1, 2025-2<br/>
              • Intensivo: 2025-I1, 2025-I2<br/>
              • Verano: 2025-V<br/><br/>
              <strong>Semestre 1:</strong> Febrero - Junio<br/>
              <strong>Intensivo 1:</strong> Febrero - Junio (2 niveles)<br/>
              <strong>Verano:</strong> Julio (1 mes)<br/>
              <strong>Semestre 2:</strong> Agosto - Enero<br/>
              <strong>Intensivo 2:</strong> Agosto - Enero (2 niveles)
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
              Tipo de Periodo *
            </label>
            <Select
              name="descripcion"
              value={periodo.descripcion}
              onChange={handleChange}
              fullWidth
              size="small"
            >
              <MenuItem value="1">Semestre 1 (Febrero - Junio)</MenuItem>
              <MenuItem value="I1">Intensivo 1 (Febrero - Junio)</MenuItem>
              <MenuItem value="V">Verano (Julio)</MenuItem>
              <MenuItem value="2">Semestre 2 (Agosto - Enero)</MenuItem>
              <MenuItem value="I2">Intensivo 2 (Agosto - Enero)</MenuItem>
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
              Fecha de Inicio *
            </label>
            <TextField
              type="date"
              name="fechaInicio"
              value={periodo.fechaInicio}
              onChange={handleChange}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
              {periodo.descripcion === '1' || periodo.descripcion === 'I1'
                ? 'Recomendado: 1 de Febrero'
                : periodo.descripcion === 'V'
                ? 'Recomendado: 1 de Julio'
                : 'Recomendado: 1 de Agosto'}
            </div>
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
            />
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
              {periodo.descripcion === '1' || periodo.descripcion === 'I1'
                ? 'Recomendado: 30 de Junio'
                : periodo.descripcion === 'V'
                ? 'Recomendado: 31 de Julio'
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
            <strong>Tipo:</strong> {
              periodo.descripcion === '1' ? 'Semestre 1 (Feb-Jun)' :
              periodo.descripcion === '2' ? 'Semestre 2 (Ago-Ene)' :
              periodo.descripcion === 'I1' ? 'Intensivo 1 (Feb-Jun) - 2 niveles' :
              periodo.descripcion === 'I2' ? 'Intensivo 2 (Ago-Ene) - 2 niveles' :
              periodo.descripcion === 'V' ? 'Verano (Jul) - 1 nivel' :
              'No definido'
            }
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
            {loading ? (periodoEditar ? 'Modificando...' : 'Creando...') : (periodoEditar ? 'Guardar Cambios' : 'Crear Periodo')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CrearPeriodo;
