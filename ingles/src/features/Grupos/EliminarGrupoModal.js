import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import '../../styles/listaEstudiante.css';

export default function EliminarGrupoModal({ open, onClose, grupo, eliminarGrupo }) {
  if (!grupo) return null;
  const handleDelete = () => {
    eliminarGrupo(grupo.id);
    onClose();
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, backgroundColor: 'var(--color-primary)', color: '#fff' }}>
        Eliminar Grupo
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <span style={{ fontSize: 20, lineHeight: 1, color: '#fff' }}>×</span>
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <p>¿Estás seguro que deseas eliminar el grupo <strong>{grupo.nombre}</strong>?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button color="error" variant="contained" onClick={handleDelete}>Eliminar</Button>
      </DialogActions>
    </Dialog>
  );
}
