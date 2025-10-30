import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import '../../styles/listaEstudiante.css';

export default function EliminarAlumnoModal({ open, onClose, alumno, eliminarAlumno }) {
  if (!alumno) return null;

  const handleDelete = () => {
    eliminarAlumno(alumno.numero_control);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, backgroundColor: 'var(--color-primary)', color: '#fff' }}>
        Confirmar eliminación
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <span style={{ fontSize: 20, lineHeight: 1, color: '#fff' }}>×</span>
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <div style={{ padding: 10, textAlign: 'center' }}>
          <p>¿Estás seguro que deseas eliminar al siguiente alumno?</p>
          <div style={{ margin: '10px 0', border: '1px solid #ccc', padding: '12px', borderRadius: 8 }}>
            <p><strong>Número de Control:</strong> {alumno.numero_control}</p>
            <p><strong>Nombre:</strong> {alumno.nombre}</p>
            <p><strong>Correo:</strong> {alumno.correo}</p>
          </div>
          <div className="button-list">
            <button className='deletebutton' onClick={handleDelete}>Sí, Eliminar Alumno</button>
            <button className='createbutton' onClick={onClose}>Cancelar</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
