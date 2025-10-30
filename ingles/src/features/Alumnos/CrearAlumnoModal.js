import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CrearAlumnoStepper from './CrearAlumnoStepper';

export default function CrearAlumnoModal({ open, onClose, agregarAlumno }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, backgroundColor: '#7A287A', color: '#fff' }}>
        Nuevo Alumno
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          {/* Uso de carácter "×" en vez de dependencia a @mui/icons-material para evitar fallo si la librería no está instalada */}
          <span style={{ fontSize: 20, lineHeight: 1 }}>×</span>
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <CrearAlumnoStepper agregarAlumno={(al) => { agregarAlumno(al); onClose(); }} />
      </DialogContent>
    </Dialog>
  );
}
