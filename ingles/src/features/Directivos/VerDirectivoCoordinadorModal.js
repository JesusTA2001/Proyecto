import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';

export default function VerDirectivoCoordinadorModal({ open, onClose, registro }) {
  if (!registro) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, backgroundColor: 'var(--color-primary)', color: '#fff' }}>
        {registro.nombreCompleto || registro.nombre}
        <IconButton aria-label='close' onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <span style={{ fontSize: 20, lineHeight: 1, color: '#fff' }}>×</span>
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <div className='detail-container'>
          <div className='detail-grid'>
            <p><strong>Tipo:</strong> {registro.tipoRol}</p>
            <p><strong>Número de Empleado:</strong> {registro.numero_empleado}</p>
            <p><strong>Correo Electrónico:</strong> {registro.email}</p>
            <p><strong>Teléfono:</strong> {registro.telefono}</p>
            <p><strong>CURP:</strong> {registro.CURP}</p>
            <p><strong>RFC:</strong> {registro.RFC}</p>
            <p><strong>Dirección:</strong> {registro.direccion}</p>
            <p><strong>Estado:</strong> <span className={registro.estado === 'Activo' ? 'estado-activo' : 'estado-inactivo'}>{registro.estado}</span></p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
