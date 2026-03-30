import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import '../../styles/listaEstudiante.css';
import { generoOptions } from '../../data/mapping';

export default function ModificarDirectivoCoordinadorModal({ open, onClose, registro, actualizarDirectivoCoordinador }) {
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({ curp: '', telefono: '' });

  useEffect(() => {
    if (registro) {
      setForm({ ...registro });
    }
  }, [registro]);

  if (!form) return null;

  const handleChange = (e) => {
    const { name } = e.target;
    let value = e.target.value;

    if (name === 'telefono') {
      value = String(value).replace(/\D/g, '').slice(0, 10);
      setErrors((prev) => ({ ...prev, telefono: value && value.length !== 10 ? 'Debe tener 10 dígitos' : '' }));
    }
    if (name === 'CURP') {
      value = String(value).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 18);
      setErrors((prev) => ({ ...prev, curp: value && value.length !== 18 ? 'CURP debe tener 18 caracteres' : '' }));
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.CURP && form.CURP.length !== 18) {
      setErrors((prev) => ({ ...prev, curp: 'CURP debe tener 18 caracteres' }));
      return;
    }
    if (form.telefono && form.telefono.length !== 10) {
      setErrors((prev) => ({ ...prev, telefono: 'Teléfono debe tener 10 dígitos' }));
      return;
    }

    actualizarDirectivoCoordinador(form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth PaperProps={{ sx: { width: '95vw', maxWidth: 1000, maxHeight: '90vh' } }}>
      <DialogTitle sx={{ m: 0, p: 2, backgroundColor: 'var(--color-primary)', color: '#fff' }}>
        Modificar {form.tipoRol === 'DIRECTIVO' ? 'Directivo' : 'Coordinador'}
        <IconButton aria-label='close' onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <span style={{ fontSize: 20, lineHeight: 1, color: '#fff' }}>×</span>
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ overflowY: 'auto', maxHeight: '78vh', px: 3, py: 2 }}>
        <form onSubmit={handleSubmit} className='form-container' style={{ maxWidth: '100%', margin: 0, width: '100%' }}>
          <Grid container spacing={3} sx={{ width: '100%' }}>
            <Grid item xs={12} sm={6}>
              <TextField label='Tipo' name='tipoRol' value={form.tipoRol} fullWidth size='small' InputProps={{ readOnly: true }} disabled margin='dense' />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='Número empleado' name='numero_empleado' value={form.numero_empleado} fullWidth size='small' InputProps={{ readOnly: true }} disabled margin='dense' />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField label='Apellido Paterno' name='apellidoPaterno' value={form.apellidoPaterno || ''} onChange={handleChange} fullWidth size='small' required margin='dense' />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='Apellido Materno' name='apellidoMaterno' value={form.apellidoMaterno || ''} onChange={handleChange} fullWidth size='small' required margin='dense' />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='Nombre(s)' name='nombre' value={form.nombre || ''} onChange={handleChange} fullWidth size='small' required margin='dense' />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField label='Email' name='email' type='email' value={form.email || ''} onChange={handleChange} fullWidth size='small' required margin='dense' />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select name='genero' value={form.genero || ''} onChange={handleChange} fullWidth size='small' displayEmpty required>
                <MenuItem value=''>Selecciona un género</MenuItem>
                {generoOptions.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='CURP' name='CURP' value={form.CURP || ''} onChange={handleChange} fullWidth size='small' margin='dense' inputProps={{ maxLength: 18 }} helperText={errors.curp || '18 caracteres (alfanumérico)'} error={Boolean(errors.curp)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='RFC' name='RFC' value={form.RFC || ''} onChange={handleChange} fullWidth size='small' margin='dense' inputProps={{ maxLength: 13 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='Número de Teléfono' name='telefono' value={form.telefono || ''} onChange={handleChange} fullWidth size='small' margin='dense' inputProps={{ maxLength: 10 }} helperText={errors.telefono || '10 dígitos'} error={Boolean(errors.telefono)} />
            </Grid>

            <Grid item xs={12}>
              <TextField label='Dirección' name='direccion' value={form.direccion || ''} onChange={handleChange} fullWidth size='small' margin='dense' />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Select name='estado' value={form.estado || 'Activo'} onChange={handleChange} fullWidth size='small' displayEmpty>
                <MenuItem value='Activo'>Activo</MenuItem>
                <MenuItem value='Inactivo'>Inactivo</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12}>
              <div className='button-list' style={{ justifyContent: 'flex-end', paddingTop: 8 }}>
                <button className='createbutton' type='button' onClick={onClose} style={{ backgroundColor: '#777', borderColor: '#666' }}>Cancelar</button>
                <button className='modifybutton' type='submit' style={{ marginLeft: 12 }}>Guardar Cambios</button>
              </div>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
}
