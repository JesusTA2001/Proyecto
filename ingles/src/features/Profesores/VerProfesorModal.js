import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import api from '../../api/axios';
import '../../styles/listaEstudiante.css';
import GestionEstudios from './GestionEstudios';

export default function VerProfesorModal({ open, onClose, profesor }) {
  const [estudios, setEstudios] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (open && profesor) {
      cargarEstudios();
    }
  }, [open, profesor]);

  const cargarEstudios = async () => {
    try {
      setCargando(true);
      const idProfesor = profesor.id_Profesor || profesor.id_profesor || profesor.id;
      const response = await api.get(`/estudios/profesor/${idProfesor}`);
      setEstudios(response.data);
    } catch (error) {
      console.error('Error al cargar estudios:', error);
      setEstudios([]);
    } finally {
      setCargando(false);
    }
  };

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
            <p><strong>Estado:</strong> <span className={profesor.estado === 'Activo' ? 'estado-activo' : 'estado-inactivo'}>{profesor.estado}</span></p>
          </div>

          <Box sx={{ mt: 3 }}>
            {cargando ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <GestionEstudios
                estudios={estudios}
                readOnly={true}
              />
            )}
          </Box>
        </div>
      </DialogContent>
    </Dialog>
  );
}
