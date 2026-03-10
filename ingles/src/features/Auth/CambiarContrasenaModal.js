import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import api from '../../api/axios';

function CambiarContrasenaModal({ open, onClose, usuario }) {
  const [passwords, setPasswords] = useState({
    nueva: '',
    verificar: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNueva, setShowNueva] = useState(false);
  const [showVerificar, setShowVerificar] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwords.nueva || !passwords.verificar) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (passwords.nueva.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres');
      return;
    }

    if (passwords.nueva !== passwords.verificar) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.put('/auth/cambiar-contrasena', {
        usuario: usuario.usuario,
        nuevaContrasena: passwords.nueva
      });

      if (response.data.success) {
        alert('Contraseña cambiada exitosamente');
        setPasswords({ nueva: '', verificar: '' });
        onClose();
      } else {
        setError(response.data.message || 'Error al cambiar la contraseña');
      }
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      setError(error.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPasswords({ nueva: '', verificar: '' });
    setError('');
    onClose();
  };

  const getNombreCompleto = () => {
    if (!usuario) return 'Usuario';
    const { nombre, apellidoPaterno, apellidoMaterno } = usuario;
    return `${apellidoPaterno || ''} ${apellidoMaterno || ''} ${nombre || ''}`.trim() || usuario.usuario;
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ backgroundColor: 'var(--color-primary)', color: '#fff', fontWeight: 'bold' }}>
        Cambiar Contraseña - {getNombreCompleto()}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ paddingTop: '20px' }}>
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
              Nombre de Usuario
            </label>
            <TextField
              value={usuario?.usuario || ''}
              fullWidth
              size="small"
              disabled
              sx={{ 
                '& .MuiInputBase-input.Mui-disabled': {
                  color: '#6b7280',
                  WebkitTextFillColor: '#6b7280'
                }
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem', color: '#374151' }}>
              Nueva Contraseña *
            </label>
            <TextField
              type={showNueva ? 'text' : 'password'}
              name="nueva"
              value={passwords.nueva}
              onChange={handleChange}
              fullWidth
              size="small"
              placeholder="Ingresa tu nueva contraseña"
              inputProps={{
                style: { WebkitTextSecurity: showNueva ? 'none' : 'disc' }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNueva(!showNueva)}
                      edge="end"
                      size="small"
                    >
                      {showNueva ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                '& input::-ms-reveal': { display: 'none' },
                '& input::-ms-clear': { display: 'none' },
                '& input::-webkit-credentials-auto-fill-button': { display: 'none' },
                '& input::-webkit-contacts-auto-fill-button': { display: 'none' }
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem', color: '#374151' }}>
              Verificar Contraseña *
            </label>
            <TextField
              type={showVerificar ? 'text' : 'password'}
              name="verificar"
              value={passwords.verificar}
              onChange={handleChange}
              fullWidth
              size="small"
              placeholder="Confirma tu nueva contraseña"
              inputProps={{
                style: { WebkitTextSecurity: showVerificar ? 'none' : 'disc' }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowVerificar(!showVerificar)}
                      edge="end"
                      size="small"
                    >
                      {showVerificar ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                '& input::-ms-reveal': { display: 'none' },
                '& input::-ms-clear': { display: 'none' },
                '& input::-webkit-credentials-auto-fill-button': { display: 'none' },
                '& input::-webkit-contacts-auto-fill-button': { display: 'none' }
              }}
            />
            {passwords.nueva && passwords.verificar && (
              passwords.nueva === passwords.verificar ? (
                <div style={{ 
                  marginTop: '8px', 
                  color: '#059669', 
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: '500'
                }}>
                  ✓ Las contraseñas coinciden
                </div>
              ) : (
                <div style={{ 
                  marginTop: '8px', 
                  color: '#dc2626', 
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  ✗ Las contraseñas no coinciden
                </div>
              )
            )}
          </div>
        </DialogContent>

        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            sx={{ 
              backgroundColor: '#00903D',
              '&:hover': { backgroundColor: '#007a33' }
            }}
          >
            {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CambiarContrasenaModal;
