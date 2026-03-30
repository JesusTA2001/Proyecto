import React, { useState } from 'react';
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
import { generoOptions } from '../../data/mapping';

const steps = ['Tipo y Datos Personales', 'Revisar'];

export default function CrearDirectivoCoordinadorStepper({ agregarDirectivoCoordinador }) {
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({ curp: '', telefono: '' });

  const [form, setForm] = useState({
    tipoRol: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    nombre: '',
    correo: '',
    genero: '',
    curp: '',
    rfc: '',
    telefono: '',
    direccion: '',
    estado: 'Activo'
  });

  const handleChange = (field) => (e) => {
    let value = e.target.value;

    if (field === 'telefono') {
      value = String(value).replace(/\D/g, '').slice(0, 10);
      setErrors((prev) => ({ ...prev, telefono: value && value.length !== 10 ? 'Debe tener 10 dígitos' : '' }));
    }

    if (field === 'curp') {
      value = String(value).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 18);
      setErrors((prev) => ({ ...prev, curp: value && value.length !== 18 ? 'CURP debe tener 18 caracteres' : '' }));
    }

    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!form.tipoRol) {
        alert('Selecciona si será DIRECTIVO o COORDINADOR.');
        return;
      }
      if (!form.apellidoPaterno || !form.apellidoMaterno || !form.nombre || !form.correo) {
        alert('Completa apellidos, nombre y correo.');
        return;
      }
      if (!form.curp || form.curp.length !== 18) {
        alert('La CURP es obligatoria y debe tener 18 caracteres.');
        setErrors((prev) => ({ ...prev, curp: 'CURP debe tener 18 caracteres' }));
        return;
      }
      if (form.telefono && form.telefono.length !== 10) {
        setErrors((prev) => ({ ...prev, telefono: 'Teléfono debe tener 10 dígitos' }));
        return;
      }
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await agregarDirectivoCoordinador(form);
  };

  return (
    <div className='form-container'>
      <Stack spacing={2} sx={{ width: '100%', maxWidth: '900px', mx: 'auto' }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Select
                  fullWidth
                  value={form.tipoRol}
                  onChange={handleChange('tipoRol')}
                  size='small'
                  displayEmpty
                  required
                  sx={{ mt: 0.5 }}
                >
                  <MenuItem value=''>Selecciona tipo de usuario</MenuItem>
                  <MenuItem value='DIRECTIVO'>Directivo</MenuItem>
                  <MenuItem value='COORDINADOR'>Coordinador</MenuItem>
                </Select>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth size='small' label='Apellido Paterno' value={form.apellidoPaterno} onChange={handleChange('apellidoPaterno')} margin='dense' required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size='small' label='Apellido Materno' value={form.apellidoMaterno} onChange={handleChange('apellidoMaterno')} margin='dense' required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size='small' label='Nombre(s)' value={form.nombre} onChange={handleChange('nombre')} margin='dense' required />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth size='small' label='Email' type='email' value={form.correo} onChange={handleChange('correo')} margin='dense' required />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Select fullWidth value={form.genero} onChange={handleChange('genero')} displayEmpty size='small' sx={{ mt: 0.5 }} required>
                  <MenuItem value=''>Selecciona un género</MenuItem>
                  {generoOptions.map((o) => (
                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                  ))}
                </Select>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size='small'
                  label='CURP'
                  value={form.curp}
                  onChange={handleChange('curp')}
                  margin='dense'
                  inputProps={{ maxLength: 18 }}
                  helperText={errors.curp || '18 caracteres (alfanumérico) - obligatorio'}
                  error={Boolean(errors.curp)}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth size='small' label='RFC' value={form.rfc} onChange={handleChange('rfc')} margin='dense' inputProps={{ maxLength: 13 }} helperText='13 caracteres (alfanumérico)' />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size='small'
                  label='Número de Teléfono'
                  value={form.telefono}
                  onChange={handleChange('telefono')}
                  margin='dense'
                  inputProps={{ maxLength: 10 }}
                  helperText={errors.telefono || '10 dígitos'}
                  error={Boolean(errors.telefono)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField fullWidth size='small' label='Dirección' value={form.direccion} onChange={handleChange('direccion')} margin='dense' />
              </Grid>
            </Grid>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <h3>Revisa los datos antes de crear</h3>
            <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}>
              <p><strong>Tipo:</strong> {form.tipoRol}</p>
              <p><strong>Apellido Paterno:</strong> {form.apellidoPaterno}</p>
              <p><strong>Apellido Materno:</strong> {form.apellidoMaterno}</p>
              <p><strong>Nombre(s):</strong> {form.nombre}</p>
              <p><strong>Email:</strong> {form.correo}</p>
              <p><strong>Género:</strong> {form.genero}</p>
              <p><strong>CURP:</strong> {form.curp}</p>
              <p><strong>RFC:</strong> {form.rfc || 'No proporcionado'}</p>
              <p><strong>Teléfono:</strong> {form.telefono || 'No proporcionado'}</p>
              <p><strong>Dirección:</strong> {form.direccion || 'No proporcionado'}</p>
              <p><strong>Usuario generado:</strong> {form.curp ? form.curp.substring(0, 10).toUpperCase() : ''}</p>
              <p><strong>Contraseña inicial:</strong> 123456</p>
            </Box>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {activeStep > 0 && <Button variant='outlined' onClick={handleBack}>Atrás</Button>}
          {activeStep < steps.length - 1 && <Button variant='contained' onClick={handleNext}>Siguiente</Button>}
          {activeStep === steps.length - 1 && <Button variant='contained' color='primary' onClick={handleSubmit}>Crear</Button>}
        </Box>
      </Stack>
    </div>
  );
}
