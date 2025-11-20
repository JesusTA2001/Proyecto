import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import '../../styles/listaEstudiante.css';

function CrearProfesor({ agregarProfesor }) {
  const navigate = useNavigate();
  const [profesor, setProfesor] = useState({
    nombre: '', correo: '', curp: '', telefono: '', direccion: '', estado: 'Activo', gradoEstudio: '', ubicacion: 'Tecnologico'
  });
  const [errors, setErrors] = useState({ curp: '', telefono: '' });

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
    setProfesor({ ...profesor, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validaciones
    if (profesor.curp && profesor.curp.length !== 18) {
      setErrors(prev => ({ ...prev, curp: 'CURP debe tener 18 caracteres' }));
      return;
    }
    if (profesor.telefono && profesor.telefono.length !== 10) {
      setErrors(prev => ({ ...prev, telefono: 'Teléfono debe tener 10 dígitos' }));
      return;
    }
    // Asegurar grado y ubicacion
    if (!profesor.gradoEstudio || !profesor.ubicacion) {
      alert('Por favor completa Grado de Estudio y Ubicación.');
      return;
    }
    agregarProfesor(profesor);
    navigate('/lista-profesores');
  };

  return (
    <form onSubmit={handleSubmit} className="form-container" style={{ maxWidth: '100%', margin: 0, width: '100%' }}>
      <Grid container spacing={3} sx={{ width: '100%' }}>
        <Grid item xs={12} md={8}>
          <TextField label="Nombre completo" name="nombre" value={profesor.nombre} onChange={handleChange} fullWidth required size="small" margin="dense" />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField label="Correo" name="correo" type="email" value={profesor.correo} onChange={handleChange} fullWidth required size="small" margin="dense" />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField label="CURP" name="curp" value={profesor.curp} onChange={handleChange} fullWidth size="small" margin="dense" inputProps={{ maxLength: 18 }} helperText={errors.curp || '18 caracteres (alfanumérico)'} error={Boolean(errors.curp)} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField label="Teléfono" name="telefono" value={profesor.telefono} onChange={handleChange} fullWidth size="small" margin="dense" inputProps={{ maxLength: 10 }} helperText={errors.telefono || '10 dígitos'} error={Boolean(errors.telefono)} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField label="Dirección" name="direccion" value={profesor.direccion} onChange={handleChange} fullWidth size="small" margin="dense" />
        </Grid>

        <Grid item xs={12} md={6}>
          <Select name="gradoEstudio" value={profesor.gradoEstudio} onChange={handleChange} fullWidth size="small" displayEmpty>
            <MenuItem value="">Selecciona grado de estudio</MenuItem>
            <MenuItem value="Licenciatura">Licenciatura</MenuItem>
            <MenuItem value="Maestria">Maestría</MenuItem>
            <MenuItem value="Doctorado">Doctorado</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} md={6}>
          <Select name="ubicacion" value={profesor.ubicacion} onChange={handleChange} fullWidth size="small" displayEmpty>
            <MenuItem value="Tecnologico">Tecnológico (Interno)</MenuItem>
            <MenuItem value="Centro de Idiomas">Centro de Idiomas (Externo)</MenuItem>
          </Select>
        </Grid>

        <Grid item xs={12}>
          <div className="button-list" style={{ justifyContent: 'flex-end' }}>
            <button className='createbutton' type='submit'>Crear Profesor</button>
          </div>
        </Grid>
      </Grid>
    </form>
  );
}

export default CrearProfesor;
