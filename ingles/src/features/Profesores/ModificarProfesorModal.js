import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import api from '../../api/axios';
import '../../styles/listaEstudiante.css';
import { generoOptions, gradoEstudioOptions } from '../../data/mapping';
import GestionEstudios from './GestionEstudios';

export default function ModificarProfesorModal({ open, onClose, profesor, actualizarProfesor }) {
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({ curp: '', telefono: '' });
  const [estudios, setEstudios] = useState([]);
  const [estudiosOriginales, setEstudiosOriginales] = useState([]);
  const [catalogoEstudios, setCatalogoEstudios] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (profesor) setForm({ ...profesor });
    if (open && profesor) {
      cargarDatos();
    }
  }, [profesor, open]);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const idProfesor = profesor.id_Profesor || profesor.id_profesor || profesor.id;
      const [catalogoRes, estudiosRes] = await Promise.all([
        api.get('/estudios/catalogo'),
        api.get(`/estudios/profesor/${idProfesor}`)
      ]);
      setCatalogoEstudios(catalogoRes.data);
      setEstudios(estudiosRes.data);
      setEstudiosOriginales(JSON.parse(JSON.stringify(estudiosRes.data)));
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setCargando(false);
    }
  };

  if (!form) return null;

  const handleChange = (e) => {
    const { name } = e.target;
    let value = e.target.value;
    if (name === 'telefono') {
      value = String(value).replace(/\D/g, '').slice(0, 10);
      setErrors(prev => ({ ...prev, telefono: value && value.length !== 10 ? 'Debe tener 10 dígitos' : '' }));
    }
    if (name === 'CURP') {
      value = String(value).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 18);
      setErrors(prev => ({ ...prev, curp: value && value.length !== 18 ? 'CURP debe tener 18 caracteres' : '' }));
    }
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validaciones de formato
    if (form.CURP && form.CURP.length !== 18) {
      setErrors(prev => ({ ...prev, curp: 'CURP debe tener 18 caracteres' }));
      return;
    }
    if (form.telefono && form.telefono.length !== 10) {
      setErrors(prev => ({ ...prev, telefono: 'Teléfono debe tener 10 dígitos' }));
      return;
    }

    try {
      // Actualizar datos básicos del profesor
      await actualizarProfesor(form);

      // Detectar cambios en estudios
      const idProfesor = form.id_Profesor || form.id_profesor || form.id;
      
      // 1. Crear estudios nuevos
      const nuevos = estudios.filter(e => e._nuevo);
      for (const estudio of nuevos) {
        const { _nuevo, id_prep, nivelEstudio, created_at, id_Profesor, ...estudioData } = estudio;
        await api.post(`/estudios/profesor/${idProfesor}`, estudioData);
      }

      // 2. Detectar estudios eliminados
      const eliminados = estudiosOriginales.filter(
        original => !estudios.some(actual => actual.id_prep === original.id_prep)
      );
      for (const estudio of eliminados) {
        await api.delete(`/estudios/${estudio.id_prep}`);
      }

      // 3. Actualizar estudios modificados
      const modificados = estudios.filter(e => {
        if (e._nuevo) return false;
        const original = estudiosOriginales.find(o => o.id_prep === e.id_prep);
        if (!original) return false;
        // Comparar solo los campos editables
        return original.id_Estudio !== e.id_Estudio ||
               original.titulo !== e.titulo ||
               original.institucion !== e.institucion ||
               original.año_obtencion !== e.año_obtencion;
      });
      for (const estudio of modificados) {
        const { id_prep, nivelEstudio, created_at, id_Profesor, ...estudioData } = estudio;
        await api.put(`/estudios/${id_prep}`, estudioData);
      }

      onClose();
    } catch (error) {
      console.error('Error al actualizar profesor y estudios:', error);
      alert('Error al actualizar los datos');
    }
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
            <Grid item xs={12} sm={6}>
              <TextField label="Número empleado" name="numero_empleado" value={form.numero_empleado} fullWidth size="small" InputProps={{ readOnly: true }} disabled margin="dense" />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField label="Apellido Paterno" name="apellidoPaterno" value={form.apellidoPaterno || ''} onChange={handleChange} fullWidth size="small" required margin="dense" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Apellido Materno" name="apellidoMaterno" value={form.apellidoMaterno || ''} onChange={handleChange} fullWidth size="small" required margin="dense" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Nombre(s)" name="nombre" value={form.nombre} onChange={handleChange} fullWidth size="small" required margin="dense" />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField label="Email" name="email" type="email" value={form.email || ''} onChange={handleChange} fullWidth size="small" required margin="dense" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select name="genero" value={form.genero || ''} onChange={handleChange} fullWidth size="small" displayEmpty required>
                <MenuItem value="">Selecciona un género</MenuItem>
                {generoOptions.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="CURP" name="CURP" value={form.CURP || ''} onChange={handleChange} fullWidth size="small" margin="dense" inputProps={{ maxLength: 18 }} helperText={errors.curp || '18 caracteres (alfanumérico)'} error={Boolean(errors.curp)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Número de Teléfono" name="telefono" value={form.telefono || ''} onChange={handleChange} fullWidth size="small" margin="dense" inputProps={{ maxLength: 10 }} helperText={errors.telefono || '10 dígitos'} error={Boolean(errors.telefono)} />
            </Grid>

            <Grid item xs={12}>
              <TextField label="Dirección" name="direccion" value={form.direccion || ''} onChange={handleChange} fullWidth size="small" margin="dense" />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Select name="ubicacion" value={form.ubicacion || ''} onChange={handleChange} fullWidth size="small" displayEmpty>
                <MenuItem value="">Seleccionar Campus</MenuItem>
                <MenuItem value="Tecnologico">Tecnológico (Interno)</MenuItem>
                <MenuItem value="Centro de Idiomas">Centro de Idiomas (Externo)</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
                {cargando ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <GestionEstudios
                    estudios={estudios}
                    catalogoEstudios={catalogoEstudios}
                    onEstudiosChange={setEstudios}
                    readOnly={false}
                  />
                )}
              </Box>
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
