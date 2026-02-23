import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import '../../styles/listaEstudiante.css';

export default function VerGrupoModal({ open, onClose, grupo, profesores, alumnos, periodos }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  if (!grupo) return null;
  const profesor = (profesores || []).find(p => p.numero_empleado === grupo.profesorId) || { nombre: 'No asignado' };
  const periodo = (periodos || []).find(p => p.id === grupo.id_Periodo) || { nombre: 'N/A' };
  
  // Usar directamente el array de alumnos del grupo que viene del backend
  const alumnosDelGrupo = grupo.alumnos || [];
  
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
          maxHeight: '95vh',
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <span style={{ fontWeight: 'bold', color: 'purple', textTransform: 'uppercase', fontSize: 18 }}>Grupo:</span>
              <span style={{ fontSize: 18 }}>{grupo.nombre}</span>
              <span style={{ fontWeight: 'bold', color: 'purple', textTransform: 'uppercase', marginLeft: 16 }}>Nivel:</span>
              <span>{grupo.nivel}</span>
              <span style={{ fontWeight: 'bold', color: 'purple', textTransform: 'uppercase', marginLeft: 16 }}>Periodo:</span>
              <span>{periodo.nombre}</span>
              <span style={{ fontWeight: 'bold', color: 'purple', textTransform: 'uppercase', marginLeft: 16 }}>Ubicación:</span>
              <span>{grupo.ubicacion}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 8 }}>
              <span style={{ fontWeight: 'bold', color: 'purple', textTransform: 'uppercase' }}>Profesor:</span>
              <span>{
                grupo.profesor_nombre
                  ? grupo.profesor_nombre
                  : (
                      profesor.nombre_completo
                        ? profesor.nombre_completo
                        : [profesor.nombre, profesor.apellido_paterno, profesor.apellido_materno]
                            .filter(Boolean)
                            .join(' ')
                    )
              }</span>
              <span style={{ fontWeight: 'bold', color: 'purple', textTransform: 'uppercase', marginLeft: 16 }}># Alumnos:</span>
              <span>{grupo.num_alumnos || 0}</span>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <h4 style={{ marginBottom: 8, textAlign: 'center', width: '100%', color: 'purple', textTransform: 'uppercase', letterSpacing: 1 }}>ALUMNOS DEL GRUPO</h4>
            {alumnosDelGrupo.length === 0 ? (
              <p>No hay alumnos asignados a este grupo.</p>
            ) : (
              // La tabla usa el scroll del DialogContent (scroll interno) para evitar que la página principal haga scroll
              <div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid #ddd' }}>#</th>
                      <th style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid #ddd' }}>Número de Control</th>
                      <th style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid #ddd' }}>Nombre Completo</th>
                      <th style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid #ddd' }}>Correo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alumnosDelGrupo.map((al, idx) => (
                      <tr key={al.nControl || idx}>
                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #f0f0f0' }}>{idx + 1}</td>
                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #f0f0f0' }}>{al.nControl}</td>
                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #f0f0f0' }}>{al.nombre_completo}</td>
                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #f0f0f0' }}>{al.email}</td>
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
