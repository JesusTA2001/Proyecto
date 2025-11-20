import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import '../../styles/listaEstudiante.css';
import { carrerasOptions } from '../../data/mapping';
import { initialModalidades } from '../../data/modalidad';
import { initialNiveles } from '../../data/niveles';

const steps = ['Datos básicos', 'Academia', 'Revisar & Crear'];

export default function CrearAlumnoStepper({ agregarAlumno }) {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const [alumno, setAlumno] = useState({
    nombre: '',
    correo: '',
    genero: '',
    curp: '',
    telefono: '',
    direccion: '',
    modalidad: '',
    nivel: '',
    carrera: '',
    estado: 'Activo',
    ubicacion: 'Tecnologico',
  });

  const [errors, setErrors] = useState({ curp: '', telefono: '' });

  const [nivelesDisponibles, setNivelesDisponibles] = useState([]);

  useEffect(() => {
    // Filtrar niveles según ubicación (mismo comportamiento que el form original)
    const tecNivelIdsPattern = /^N[0-6]$/;
    if (alumno.ubicacion === 'Tecnologico') {
      setNivelesDisponibles(initialNiveles.filter(n => tecNivelIdsPattern.test(n.id)));
    } else {
      setNivelesDisponibles(initialNiveles);
    }
  }, [alumno.ubicacion]);

  const handleChange = (field) => (e) => {
    let value = e.target.value;
    // Sanitizaciones específicas
    if (field === 'telefono') {
      // solo dígitos y máximo 10
      value = String(value).replace(/\D/g, '').slice(0, 10);
      setErrors(prev => ({ ...prev, telefono: value && value.length !== 10 ? 'Debe tener 10 dígitos' : '' }));
    }
    if (field === 'curp') {
      // CURP: alfanumérico, mayúsculas, máximo 18
      value = String(value).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 18);
      setErrors(prev => ({ ...prev, curp: value && value.length !== 18 ? 'CURP debe tener 18 caracteres' : '' }));
    }
    setAlumno(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    // Validaciones simples por paso
    if (activeStep === 0) {
      if (!alumno.nombre || !alumno.correo) {
        alert('Por favor completa el nombre y correo.');
        return;
      }
      // Validaciones de formato
      if (alumno.curp && alumno.curp.length !== 18) {
        setErrors(prev => ({ ...prev, curp: 'CURP debe tener 18 caracteres' }));
        return;
      }
      if (alumno.telefono && alumno.telefono.length !== 10) {
        setErrors(prev => ({ ...prev, telefono: 'Teléfono debe tener 10 dígitos' }));
        return;
      }
    }
    if (activeStep === 1) {
      if (alumno.ubicacion === 'Tecnologico' && !alumno.carrera) {
        alert('Selecciona una carrera para alumnos del Tecnológico.');
        return;
      }
      if (!alumno.modalidad || !alumno.nivel) {
        alert('Selecciona modalidad y nivel.');
        return;
      }
    }
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => setActiveStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Asegurar valores finales (si Centro de Idiomas y no tiene carrera -> No Aplica)
    const finalAlumno = { ...alumno };
    if (finalAlumno.ubicacion === 'Centro de Idiomas' && !finalAlumno.carrera) finalAlumno.carrera = 'No Aplica';

    agregarAlumno(finalAlumno);
    navigate('/lista-estudiantes');
  };

  return (
    <div className="form-container">
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size="small" label="Nombre completo" value={alumno.nombre} onChange={handleChange('nombre')} margin="dense" required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size="small" label="Correo" value={alumno.correo} onChange={handleChange('correo')} margin="dense" required />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Teléfono"
                  value={alumno.telefono}
                  onChange={handleChange('telefono')}
                  margin="dense"
                  inputProps={{ maxLength: 10 }}
                  helperText={errors.telefono || '10 dígitos'}
                  error={Boolean(errors.telefono)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="CURP"
                  value={alumno.curp}
                  onChange={handleChange('curp')}
                  margin="dense"
                  inputProps={{ maxLength: 18 }}
                  helperText={errors.curp || '18 caracteres (alfanumérico)'}
                  error={Boolean(errors.curp)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField fullWidth size="small" label="Dirección" value={alumno.direccion} onChange={handleChange('direccion')} margin="dense" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Select
                  fullWidth
                  value={alumno.genero}
                  onChange={handleChange('genero')}
                  displayEmpty
                  size="small"
                  sx={{ mt: 0.5 }}
                >
                  <MenuItem value="">Selecciona un género</MenuItem>
                  <MenuItem value="Masculino">Masculino</MenuItem>
                  <MenuItem value="Femenino">Femenino</MenuItem>
                  <MenuItem value="Otro">Otro</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Select
                  fullWidth
                  value={alumno.ubicacion}
                  onChange={handleChange('ubicacion')}
                  size="small"
                  displayEmpty
                >
                  <MenuItem value="Tecnologico">Tecnológico</MenuItem>
                  <MenuItem value="Centro de Idiomas">Centro de Idiomas</MenuItem>
                </Select>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Select
                  fullWidth
                  value={alumno.modalidad}
                  onChange={handleChange('modalidad')}
                  size="small"
                  displayEmpty
                >
                  <MenuItem value="">Selecciona una modalidad</MenuItem>
                  {initialModalidades.map(m => <MenuItem key={m.id} value={m.nombre}>{m.nombre}</MenuItem>)}
                </Select>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Select
                  fullWidth
                  value={alumno.nivel}
                  onChange={handleChange('nivel')}
                  size="small"
                  displayEmpty
                >
                  <MenuItem value="">Selecciona un nivel</MenuItem>
                  {nivelesDisponibles.map(n => <MenuItem key={n.id} value={n.nombre}>{n.nombre}</MenuItem>)}
                </Select>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Select
                  fullWidth
                  value={alumno.carrera}
                  onChange={handleChange('carrera')}
                  size="small"
                  displayEmpty
                  required={alumno.ubicacion === 'Tecnologico'}
                >
                  <MenuItem value="">{alumno.ubicacion === 'Tecnologico' ? 'Selecciona una carrera *' : 'Selecciona carrera (si aplica)'}</MenuItem>
                  {carrerasOptions.map(c => <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>)}
                  {alumno.ubicacion === 'Centro de Idiomas' && <MenuItem value="No Aplica">No Aplica</MenuItem>}
                </Select>
              </Grid>
            </Grid>
          </Box>
        )}

        {activeStep === 2 && (
          <Box>
            <h3>Revisa los datos</h3>
            <p><strong>Nombre:</strong> {alumno.nombre}</p>
            <p><strong>Correo:</strong> {alumno.correo}</p>
            <p><strong>Teléfono:</strong> {alumno.telefono}</p>
            <p><strong>Ubicación:</strong> {alumno.ubicacion}</p>
            <p><strong>Modalidad:</strong> {alumno.modalidad}</p>
            <p><strong>Nivel:</strong> {alumno.nivel}</p>
            <p><strong>Carrera:</strong> {alumno.carrera || 'No Aplica'}</p>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {activeStep > 0 && <Button variant="outlined" onClick={handleBack}>Atrás</Button>}
          {activeStep < steps.length - 1 && <Button variant="contained" onClick={handleNext}>Siguiente</Button>}
          {activeStep === steps.length - 1 && <Button variant="contained" color="primary" onClick={handleSubmit}>Crear Alumno</Button>}
        </Box>
      </Stack>
    </div>
  );
}
