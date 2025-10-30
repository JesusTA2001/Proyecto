import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import '../../styles/listaEstudiante.css';
import CrearAdministrador from './CrearAdmin';

export default function CrearAdministradorModal({ open, onClose, agregarAdministrador }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, backgroundColor: 'var(--color-primary)', color: '#fff' }}>
        Nuevo Administrador
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <span style={{ fontSize: 20, lineHeight: 1, color: '#fff' }}>×</span>
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {/* Pasamos agregarAdministrador y cerramos el modal desde el componente si es necesario */}
        <CrearAdministrador agregarAdministrador={(a) => { agregarAdministrador(a); onClose(); }} />
      </DialogContent>
    </Dialog>
  );
}
