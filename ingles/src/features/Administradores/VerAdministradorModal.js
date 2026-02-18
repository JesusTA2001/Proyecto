import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import '../../styles/listaEstudiante.css';

export default function VerAdministradorModal({ open, onClose, admin }) {
  if (!admin) return null;
  console.log('VerAdministradorModal admin:', admin);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, backgroundColor: 'var(--color-primary)', color: '#fff' }}>
        {admin.nombreCompleto || admin.nombre}
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <span style={{ fontSize: 20, lineHeight: 1, color: '#fff' }}>×</span>
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <div className="detail-container">
          <div className="detail-grid">
            <p><strong>Número de Empleado:</strong> {admin.numero_empleado}</p>
            <p><strong>Correo Electrónico:</strong> {admin.email}</p>
            <p><strong>Teléfono:</strong> {admin.telefono}</p>
            <p><strong>CURP:</strong> {admin.CURP}</p>
            <p><strong>Dirección:</strong> {admin.direccion}</p>
            <p><strong>Estado:</strong> <span className={admin.estado === 'Activo' ? 'estado-activo' : 'estado-inactivo'}>{admin.estado}</span></p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
