import React, { useState } from 'react';
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
import { gradoEstudioOptions } from '../../data/mapping';

const steps = ['Datos Personales', 'Academia', 'Crear y Revisar'];

export default function CrearAdministradorStepper({ agregarAdministrador }) {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const [admin, setAdmin] = useState({
    apellidoPaterno: '',
    apellidoMaterno: '',
    nombre: '',
    correo: '',
    genero: '',
    curp: '',
    telefono: '',
    direccion: '',
    ubicacion: 'Tecnologico',
    gradoEstudio: '',
    estado: 'Activo',
  });

  const [errors, setErrors] = useState({ curp: '', telefono: '' });

  const handleChange = (field) => (e) => {
    let value = e.target.value;
    // Sanitizaciones específicas
    if (field === 'telefono') {
      value = String(value).replace(/\D/g, '').slice(0, 10);
      setErrors(prev => ({ ...prev, telefono: value && value.length !== 10 ? 'Debe tener 10 dígitos' : '' }));
    }
    if (field === 'curp') {
      value = String(value).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 18);
      setErrors(prev => ({ ...prev, curp: value && value.length !== 18 ? 'CURP debe tener 18 caracteres' : '' }));
    }
    setAdmin(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    // Validaciones por paso
    if (activeStep === 0) {
      if (!admin.apellidoPaterno || !admin.apellidoMaterno || !admin.nombre || !admin.correo) {
        alert('Por favor completa los apellidos, nombre y correo.');
        return;
      }
      // Validaciones de formato
      if (admin.curp && admin.curp.length !== 18) {
        setErrors(prev => ({ ...prev, curp: 'CURP debe tener 18 caracteres' }));
        return;
      }
      if (admin.telefono && admin.telefono.length !== 10) {
        setErrors(prev => ({ ...prev, telefono: 'Teléfono debe tener 10 dígitos' }));
        return;
      }
    }
    if (activeStep === 1) {
      if (!admin.gradoEstudio) {
        alert('Por favor completa el Nivel de estudio.');
        return;
      }
    }
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => setActiveStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = (e) => {
    e.preventDefault();
    agregarAdministrador(admin);
    navigate('/lista-administradores');
  };

  return (
    <div className="form-container">
      <Stack spacing={2} sx={{ width: '100%', maxWidth: '900px', mx: 'auto' }}>
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
                <TextField fullWidth size="small" label="Apellido Paterno" value={admin.apellidoPaterno} onChange={handleChange('apellidoPaterno')} margin="dense" required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size="small" label="Apellido Materno" value={admin.apellidoMaterno} onChange={handleChange('apellidoMaterno')} margin="dense" required />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size="small" label="Nombre(s)" value={admin.nombre} onChange={handleChange('nombre')} margin="dense" required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size="small" label="Email" type="email" value={admin.correo} onChange={handleChange('correo')} margin="dense" required />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Select
                  fullWidth
                  value={admin.genero}
                  onChange={handleChange('genero')}
                  displayEmpty
                  size="small"
                  sx={{ mt: 0.5 }}
                  required
                >
                  <MenuItem value="">Selecciona un género</MenuItem>
                  <MenuItem value="Masculino">Masculino</MenuItem>
                  <MenuItem value="Femenino">Femenino</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="CURP"
                  value={admin.curp}
                  onChange={handleChange('curp')}
                  margin="dense"
                  inputProps={{ maxLength: 18 }}
                  helperText={errors.curp || '18 caracteres (alfanumérico)'}
                  error={Boolean(errors.curp)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Número de Teléfono"
                  value={admin.telefono}
                  onChange={handleChange('telefono')}
                  margin="dense"
                  inputProps={{ maxLength: 10 }}
                  helperText={errors.telefono || '10 dígitos'}
                  error={Boolean(errors.telefono)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size="small" label="Dirección" value={admin.direccion} onChange={handleChange('direccion')} margin="dense" />
              </Grid>
            </Grid>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Select
                  fullWidth
                  value={admin.gradoEstudio}
                  onChange={handleChange('gradoEstudio')}
                  size="small"
                  displayEmpty
                  required
                  sx={{ mt: 0.5 }}
                >
                  <MenuItem value="">Selecciona nivel de estudio</MenuItem>
                  {gradoEstudioOptions.map(g => <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>)}
                </Select>
              </Grid>
            </Grid>
          </Box>
        )}

        {activeStep === 2 && (
          <Box>
            <h3>Revisa los datos antes de crear</h3>
            <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}>
              <h4 style={{ marginTop: 0, marginBottom: 12 }}>Datos Personales</h4>
              <p><strong>Apellido Paterno:</strong> {admin.apellidoPaterno}</p>
              <p><strong>Apellido Materno:</strong> {admin.apellidoMaterno}</p>
              <p><strong>Nombre(s):</strong> {admin.nombre}</p>
              <p><strong>Email:</strong> {admin.correo}</p>
              <p><strong>Género:</strong> {admin.genero}</p>
              <p><strong>CURP:</strong> {admin.curp || 'No proporcionado'}</p>
              <p><strong>Teléfono:</strong> {admin.telefono || 'No proporcionado'}</p>
              <p><strong>Dirección:</strong> {admin.direccion || 'No proporcionado'}</p>
              
              <h4 style={{ marginBottom: 12 }}>Academia</h4>
              <p><strong>Nivel de estudio:</strong> {admin.gradoEstudio}</p>
            </Box>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {activeStep > 0 && <Button variant="outlined" onClick={handleBack}>Atrás</Button>}
          {activeStep < steps.length - 1 && <Button variant="contained" onClick={handleNext}>Siguiente</Button>}
          {activeStep === steps.length - 1 && <Button variant="contained" color="primary" onClick={handleSubmit}>Crear Administrador</Button>}
        </Box>
      </Stack>
    </div>
  );
}
