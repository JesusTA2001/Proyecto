import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import '../../styles/listaEstudiante.css';
import { generoOptions, carrerasOptions } from '../../data/mapping';
import { initialModalidades } from '../../data/modalidad';
import { initialNiveles } from '../../data/niveles';

export default function ModificarAlumnoModal({ open, onClose, alumno, actualizarAlumno }) {
  const [form, setForm] = useState(null);
  const [nivelesDisponibles, setNivelesDisponibles] = useState([]);
  const [errors, setErrors] = useState({ curp: '', telefono: '' });

  useEffect(() => {
    if (alumno) {
      setForm({ ...alumno });
    }
  }, [alumno]);

  useEffect(() => {
    if (!form) return;
    const tecNivelIdsPattern = /^N[0-6]$/;
    if (form.ubicacion === 'Tecnologico') setNivelesDisponibles(initialNiveles.filter(n => tecNivelIdsPattern.test(n.id)));
    else setNivelesDisponibles(initialNiveles);
  }, [form?.ubicacion]);

  if (!form) return null;

  const handleChange = (e) => {
    const { name } = e.target;
    let value = e.target.value;
    if (name === 'telefono') {
      value = String(value).replace(/\D/g, '').slice(0, 10);
      setErrors(prev => ({ ...prev, telefono: value && value.length !== 10 ? 'Debe tener 10 dígitos' : '' }));
    }
    if (name === 'curp') {
      value = String(value).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 18);
      setErrors(prev => ({ ...prev, curp: value && value.length !== 18 ? 'CURP debe tener 18 caracteres' : '' }));
    }
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const final = { ...form };
    if (final.ubicacion === 'Centro de Idiomas' && !final.carrera) final.carrera = 'No Aplica';
    if (final.ubicacion === 'Tecnologico' && !final.carrera) {
      alert('Debes seleccionar una carrera para alumnos del Tecnológico.');
      return;
    }
    // Validaciones de formato
    if (final.curp && final.curp.length !== 18) {
      setErrors(prev => ({ ...prev, curp: 'CURP debe tener 18 caracteres' }));
      return;
    }
    if (final.telefono && final.telefono.length !== 10) {
      setErrors(prev => ({ ...prev, telefono: 'Teléfono debe tener 10 dígitos' }));
      return;
    }
    actualizarAlumno(final);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { width: '95vw', maxWidth: 1000, maxHeight: '90vh' } }}
    >
      <DialogTitle sx={{ m: 0, p: 2, backgroundColor: 'var(--color-primary)', color: '#fff' }}>
        Modificar Alumno
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <span style={{ fontSize: 20, lineHeight: 1, color: '#fff' }}>×</span>
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ overflowY: 'auto', maxHeight: '78vh', px: 3, py: 2 }}>
        <form onSubmit={handleSubmit} className="form-container" style={{ maxWidth: '100%', margin: 0, width: '100%' }}>
          <Grid container spacing={3} sx={{ width: '100%' }}>
            <Grid item xs={12} sm={6}>
              <TextField label="Número de control" name="numero_control" value={form.numero_control} fullWidth size="small" InputProps={{ readOnly: true }} disabled margin="dense" />
            </Grid>
            <Grid item xs={12} sm={6} md={8}>
              <TextField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} fullWidth size="small" required margin="dense" />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <TextField label="Correo" name="correo" type="email" value={form.correo} onChange={handleChange} fullWidth size="small" required margin="dense" />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Select name="genero" value={form.genero} onChange={handleChange} fullWidth size="small" displayEmpty>
                <MenuItem value="">Selecciona un género</MenuItem>
                {generoOptions.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <TextField label="CURP" name="curp" value={form.curp || ''} onChange={handleChange} fullWidth size="small" margin="dense" inputProps={{ maxLength: 18 }} helperText={errors.curp || '18 caracteres (alfanumérico)'} error={Boolean(errors.curp)} />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <TextField label="Teléfono" name="telefono" value={form.telefono || ''} onChange={handleChange} fullWidth size="small" margin="dense" inputProps={{ maxLength: 10 }} helperText={errors.telefono || '10 dígitos'} error={Boolean(errors.telefono)} />
            </Grid>

            <Grid item xs={12} md={8}>
              <TextField label="Dirección" name="direccion" value={form.direccion || ''} onChange={handleChange} fullWidth size="small" margin="dense" />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Select name="ubicacion" value={form.ubicacion} onChange={handleChange} fullWidth size="small" displayEmpty>
                <MenuItem value="Tecnologico">Tecnológico (Interno)</MenuItem>
                <MenuItem value="Centro de Idiomas">Centro de Idiomas (Externo)</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Select name="modalidad" value={form.modalidad} onChange={handleChange} fullWidth size="small" displayEmpty>
                <MenuItem value="">Selecciona una modalidad</MenuItem>
                {initialModalidades.map(m => <MenuItem key={m.id} value={m.nombre}>{m.nombre}</MenuItem>)}
              </Select>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Select name="nivel" value={form.nivel} onChange={handleChange} fullWidth size="small" displayEmpty>
                <MenuItem value="">Selecciona un nivel</MenuItem>
                {nivelesDisponibles.map(n => <MenuItem key={n.id} value={n.nombre}>{n.nombre}</MenuItem>)}
              </Select>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Select name="carrera" value={form.carrera || ''} onChange={handleChange} fullWidth size="small" displayEmpty required={form.ubicacion === 'Tecnologico'}>
                <MenuItem value="">{form.ubicacion === 'Tecnologico' ? 'Selecciona una carrera *' : 'Selecciona carrera (si aplica)'}</MenuItem>
                {carrerasOptions.map(c => <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>)}
                {form.ubicacion === 'Centro de Idiomas' && <MenuItem value="No Aplica">No Aplica</MenuItem>}
              </Select>
            </Grid>

            <Grid item xs={12}>
              <div className="button-list" style={{ justifyContent: 'flex-end', paddingTop: 8 }}>
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
