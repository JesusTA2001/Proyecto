import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import '../../styles/listaEstudiante.css';
import CrearGrupo from './CrearGrupo';

export default function CrearGrupoModal({ open, onClose, agregarGrupo, niveles, periodos, profesores, alumnos, onPeriodoCreado }) {
  return (
  <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth disableScrollLock PaperProps={{ sx: { width: '95vw', maxWidth: 1125, maxHeight: '120vh' } }}>
      <DialogTitle sx={{ m: 0, p: 2, backgroundColor: 'var(--color-primary)', color: '#fff' }}>
        Nuevo Grupo
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <span style={{ fontSize: 20, lineHeight: 1, color: '#fff' }}>×</span>
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ overflowY: 'auto', maxHeight: '100vh', px: 3, py: 2 }}>
        <div style={{ width: '100%', maxWidth: 1125, margin: '0 auto', background: '#fff', borderRadius: 12, padding: 16 }}>
          <CrearGrupo niveles={niveles} periodos={periodos} profesores={profesores} alumnos={alumnos} agregarGrupo={(g) => { agregarGrupo(g); onClose(); }} onPeriodoCreado={onPeriodoCreado} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
