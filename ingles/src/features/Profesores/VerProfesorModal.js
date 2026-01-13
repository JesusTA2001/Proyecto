import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import '../../styles/listaEstudiante.css';

export default function VerProfesorModal({ open, onClose, profesor }) {
  if (!profesor) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, backgroundColor: 'var(--color-primary)', color: '#fff' }}>
        {profesor.nombreCompleto || profesor.nombre}
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <span style={{ fontSize: 20, lineHeight: 1, color: '#fff' }}>×</span>
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <div className="detail-container">
          <div className="detail-grid">
            <p><strong>Número de Empleado:</strong> {profesor.numero_empleado}</p>
            <p><strong>Correo Electrónico:</strong> {profesor.email}</p>
            <p><strong>Teléfono:</strong> {profesor.telefono}</p>
            <p><strong>CURP:</strong> {profesor.CURP}</p>
            <p><strong>Dirección:</strong> {profesor.direccion}</p>
            <p><strong>Ubicación:</strong> {profesor.ubicacion}</p>
            <p><strong>Grado de Estudio:</strong> {profesor.gradoEstudio}</p>
            <p><strong>Estado:</strong> <span className={profesor.estado === 'Activo' ? 'estado-activo' : 'estado-inactivo'}>{profesor.estado}</span></p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
