import React, { useEffect, useState } from 'react';
import { Alert, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import api from '../../api/axios';

export default function RestablecerContrasenaModal({
  open,
  onClose,
  tipoUsuario,
  idRelacion,
  nombreCompleto
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setLoading(false);
      setError('');
    }
  }, [open, tipoUsuario, idRelacion]);

  const handleRestablecer = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.put('/auth/restablecer-contrasena', {
        tipoUsuario,
        idRelacion
      });

      window.alert(response.data?.message || 'Contraseña restablecida exitosamente');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { overflow: 'hidden' } }}
    >
      <DialogTitle sx={{ backgroundColor: '#8A2F83', color: '#ffffff', fontWeight: 700 }}>
        Restablecer contraseña
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: '#ffffff', pt: 3 }}>
        <Typography sx={{ mb: 2 }}>
          ¿Estás seguro que quieres restablecer la contraseña de <strong>{nombreCompleto || 'este usuario'}</strong>?
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          La contraseña quedará configurada automáticamente en <strong>123456</strong>.
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
      </DialogContent>
      <DialogActions sx={{ backgroundColor: '#ffffff', px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleRestablecer}
          variant="contained"
          sx={{ backgroundColor: '#00903D', '&:hover': { backgroundColor: '#007a33' } }}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
