import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import '../../styles/listaEstudiante.css';
import { carrerasMap } from '../../data/mapping';
import { initialNiveles } from '../../data/niveles';

export default function VerAlumnoModal({ open, onClose, alumno }) {
  if (!alumno) return null;

  const ubicacionLabel = alumno.ubicacion === 'Tecnologico' ? 'Tecnológico (Interno)' : 'Centro de Idiomas (Externo)';

  const tecNivelIdsPattern = /^N[0-6]$/;
  const nivelesPosibles = initialNiveles.filter(nivel => {
    if (alumno.ubicacion === 'Tecnologico') return tecNivelIdsPattern.test(nivel.id);
    return true;
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, backgroundColor: 'var(--color-primary)', color: '#fff' }}>
        {alumno.nombre}
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <span style={{ fontSize: 20, lineHeight: 1, color: '#fff' }}>×</span>
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <div className="detail-container">
          <h3 className="detail-section-title">Datos Personales</h3>
          <div className="detail-grid">
            <p><strong>Número de Control:</strong> {alumno.numero_control}</p>
            <p><strong>Correo:</strong> {alumno.correo}</p>
            {(alumno.carrera && alumno.carrera !== 'No Aplica') && (
              <p><strong>Carrera:</strong> {carrerasMap[alumno.carrera] || alumno.carrera}</p>
            )}
            <p><strong>Teléfono:</strong> {alumno.telefono || 'No especificado'}</p>
            <p><strong>CURP:</strong> {alumno.curp || 'No especificado'}</p>
            <p><strong>Dirección:</strong> {alumno.direccion || 'No especificada'}</p>
            <p><strong>Género:</strong> {alumno.genero}</p>
            <p><strong>Ubicación:</strong> <span className={`ubicacion-${alumno.ubicacion === 'Tecnologico' ? 'tec' : 'nodo'}`}>{ubicacionLabel}</span></p>
            <p><strong>Estado:</strong> <span className={alumno.estado === 'Activo' ? 'estado-activo' : 'estado-inactivo'}>{alumno.estado}</span></p>
          </div>

          <h3 className="detail-section-title">Nivel Actual</h3>
          <div className="detail-grid history-section">
            <p><strong>Nivel:</strong> {alumno.nivel || 'No asignado'}</p>
            <p><strong>Modalidad:</strong> {alumno.modalidad || 'No asignada'}</p>
          </div>

          <h3 className="detail-section-title">Plan de Estudios</h3>
          <div className='levels-path-container'>
            <ul className="levels-path-list">
              {nivelesPosibles.map((nivel) => (
                <li key={nivel.id} className={nivel.nombre === alumno.nivel ? 'current-level' : ''}>{nivel.nombre}</li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
