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
import { initialModalidades } from '../../data/modalidad';
import { initialNiveles } from '../../data/niveles';

export default function ModificarProfesorModal({ open, onClose, profesor, actualizarProfesor }) {
  const [form, setForm] = useState(null);
  const [nivelesDisponibles, setNivelesDisponibles] = useState([]);

  useEffect(() => {
    if (profesor) setForm({ ...profesor });
  }, [profesor]);

  useEffect(() => {
    if (!form) return;
    const tecNivelIdsPattern = /^N[0-6]$/;
    if (form.ubicacion === 'Tecnologico') setNivelesDisponibles(initialNiveles.filter(n => tecNivelIdsPattern.test(n.id)));
    else setNivelesDisponibles(initialNiveles);
  }, [form?.ubicacion]);

  if (!form) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    actualizarProfesor(form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { width: '95vw', maxWidth: 1000, maxHeight: '90vh' } }}>
      <DialogTitle sx={{ m: 0, p: 2, backgroundColor: 'var(--color-primary)', color: '#fff' }}>
        Modificar Profesor
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <span style={{ fontSize: 20, lineHeight: 1, color: '#fff' }}>×</span>
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ overflowY: 'auto', maxHeight: '78vh', px: 3, py: 2 }}>
        <form onSubmit={handleSubmit} className="form-container" style={{ maxWidth: '100%', margin: 0, width: '100%' }}>
          <Grid container spacing={3} sx={{ width: '100%' }}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField label="Número empleado" name="numero_empleado" value={form.numero_empleado} fullWidth size="small" InputProps={{ readOnly: true }} disabled margin="dense" />
            </Grid>
            <Grid item xs={12} sm={6} md={8}>
              <TextField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} fullWidth size="small" required margin="dense" />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <TextField label="Correo" name="correo" type="email" value={form.correo} onChange={handleChange} fullWidth size="small" required margin="dense" />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <TextField label="CURP" name="curp" value={form.curp || ''} onChange={handleChange} fullWidth size="small" margin="dense" />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <TextField label="Teléfono" name="telefono" value={form.telefono || ''} onChange={handleChange} fullWidth size="small" margin="dense" />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
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
