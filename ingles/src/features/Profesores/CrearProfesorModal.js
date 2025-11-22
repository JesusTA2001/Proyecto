import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import '../../styles/listaEstudiante.css';
import CrearProfesor from './CrearProfesor';

export default function CrearProfesorModal({ open, onClose, agregarProfesor }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { width: '95vw', maxWidth: 1000, maxHeight: '90vh' } }}>
      <DialogTitle sx={{ m: 0, p: 2, backgroundColor: 'var(--color-primary)', color: '#fff' }}>
        Nuevo Profesor
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <span style={{ fontSize: 20, lineHeight: 1, color: '#fff' }}>×</span>
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ overflowY: 'auto', maxHeight: '78vh', px: 3, py: 2 }}>
        <div style={{ width: '100%' }}>
          <CrearProfesor agregarProfesor={(p) => { agregarProfesor(p); onClose(); }} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
