import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import '../../styles/listaEstudiante.css';

export default function VerGrupoModal({ open, onClose, grupo, profesores, alumnos }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  if (!grupo) return null;
  const profesor = (profesores || []).find(p => p.numero_empleado === grupo.profesorId) || { nombre: 'No asignado' };
  const alumnoIds = Array.isArray(grupo.alumnoIds) ? grupo.alumnoIds : [];
  const alumnosInGroup = (alumnos || []).filter(a => alumnoIds.includes(a.numero_control));
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          // Limitar la altura del modal para evitar scroll de la página
          maxHeight: fullScreen ? '100vh' : '80vh',
        }
      }}
      aria-labelledby="ver-grupo-title"
    >
      <DialogTitle id="ver-grupo-title" sx={{ m: 0, p: 2, backgroundColor: 'var(--color-primary)', color: '#fff' }}>
        Detalles del Grupo
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <span style={{ fontSize: 20, lineHeight: 1, color: '#fff' }}>×</span>
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ overflowY: 'auto', px: 2, py: 2 }}>
        <div className="detail-container">
          <h3>{grupo.nombre}</h3>
          <p><strong>Nivel:</strong> {grupo.nivel}</p>
          <p><strong>Modalidad:</strong> {grupo.modalidad}</p>
          <p><strong>Ubicación:</strong> {grupo.ubicacion}</p>
          <p><strong>Profesor:</strong> {profesor.nombre}</p>
          <p><strong># Alumnos:</strong> {alumnoIds.length}</p>

          <div style={{ marginTop: 12 }}>
            <h4 style={{ marginBottom: 8 }}>Alumnos del grupo</h4>
            {alumnosInGroup.length === 0 ? (
              <p>No hay alumnos asignados a este grupo.</p>
            ) : (
              // La tabla usa el scroll del DialogContent (scroll interno) para evitar que la página principal haga scroll
              <div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid #ddd' }}>#</th>
                      <th style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid #ddd' }}>Número</th>
                      <th style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid #ddd' }}>Nombre</th>
                      <th style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid #ddd' }}>Correo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alumnosInGroup.map((al, idx) => (
                      <tr key={al.numero_control || idx}>
                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #f0f0f0' }}>{idx + 1}</td>
                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #f0f0f0' }}>{al.numero_control}</td>
                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #f0f0f0' }}>{al.nombre}</td>
                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #f0f0f0' }}>{al.correo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
