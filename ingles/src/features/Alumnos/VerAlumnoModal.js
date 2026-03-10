import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import '../../styles/listaEstudiante.css';
import { carrerasMap } from '../../data/mapping';
import { initialNiveles } from '../../data/niveles';
import api from '../../api/axios';

export default function VerAlumnoModal({ open, onClose, alumno }) {
  const [historial, setHistorial] = useState([]);
  
  useEffect(() => {
    if (open && alumno?.numero_control) {
      // Obtener historial de grupos del alumno
      api.get(`/alumnos/${alumno.numero_control}/historial-grupos`)
        .then(response => {
          if (response.data.success) {
            setHistorial(response.data.historial || []);
          }
        })
        .catch(error => {
          console.error('Error al obtener historial:', error);
          setHistorial([]);
        });
    }
  }, [open, alumno]);
  
  if (!alumno) return null;

  const ubicacionLabel = alumno.ubicacion === 'Tecnologico' ? 'Tecnológico (Interno)' : 'Centro de Idiomas (Externo)';

  const tecNivelIdsPattern = /^N[0-6]$/;
  const nivelesPosibles = initialNiveles.filter(nivel => {
    if (alumno.ubicacion === 'Tecnologico') return tecNivelIdsPattern.test(nivel.id);
    return true;
  });

  // Función para determinar el estado de un nivel
  const getNivelStatus = (nivelNombre, index) => {
    // Normalizar el nombre del nivel del alumno para comparación (quitar espacios)
    const alumnoNivelNormalizado = alumno.nivel ? alumno.nivel.replace(/\s+/g, '').toLowerCase() : '';
    
    // Encontrar el índice del nivel actual del alumno (comparación flexible sin espacios)
    const nivelActualIndex = nivelesPosibles.findIndex(n => {
      const nombreNormalizado = n.nombre.replace(/\s+/g, '').toLowerCase();
      return nombreNormalizado === alumnoNivelNormalizado;
    });
    
    console.log('🔍 Debug getNivelStatus:', { 
      nivelNombre, 
      index, 
      alumnoNivel: alumno.nivel,
      alumnoNivelNormalizado,
      nivelActualIndex,
      nivelesPosibles: nivelesPosibles.map(n => n.nombre)
    });
    
    // Si el estudiante tiene un nivel asignado
    if (nivelActualIndex !== -1) {
      // Nivel actual en curso (naranja) - comparar sin espacios
      const nivelNombreNormalizado = nivelNombre.replace(/\s+/g, '').toLowerCase();
      const esNivelActual = nivelNombreNormalizado === alumnoNivelNormalizado;
      if (esNivelActual) {
        console.log('🟠 Nivel en curso:', nivelNombre);
        return 'in-progress-level';
      }
      
      // Niveles anteriores al actual = aprobados (verde)
      if (index < nivelActualIndex) {
        // Verificar si hay reprobación en el historial
        const registrosNivel = historial.filter(h => 
          h.nivel && h.nivel.replace(/\s+/g, '').toLowerCase() === nivelNombreNormalizado
        );
        const reprobó = registrosNivel.some(h => h.final !== null && h.final < 70);
        
        // Si reprobó este nivel y lo está recursando, marcar como reprobado
        if (reprobó && index === nivelActualIndex - 1) {
          console.log('🔴 Nivel reprobado:', nivelNombre);
          return 'failed-level';
        }
        
        console.log('🟢 Nivel completado:', nivelNombre);
        return 'completed-level';
      }
      
      // Niveles posteriores al actual = pendientes (gris)
      if (index > nivelActualIndex) {
        console.log('⚪ Nivel pendiente:', nivelNombre);
        return '';
      }
    } else {
      console.log('⚠️ No se encontró índice del nivel actual del alumno');
    }
    
    // Si no tiene nivel asignado, revisar solo el historial
    const registrosNivel = historial.filter(h => h.nivel === nivelNombre);
    
    if (registrosNivel.length === 0) {
      return ''; // Sin estado (gris por defecto)
    }
    
    // Verificar si aprobó el nivel
    const aprobo = registrosNivel.some(h => h.final !== null && h.final >= 70);
    if (aprobo) {
      return 'completed-level';
    }
    
    // Si tiene registros pero no aprobó, es reprobado
    const reprobó = registrosNivel.some(h => h.final !== null && h.final < 70);
    if (reprobó) {
      return 'failed-level';
    }
    
    return '';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, backgroundColor: 'var(--color-primary)', color: '#fff' }}>
        {alumno.nombreCompleto || `${alumno.nombre} ${alumno.apellidoPaterno || ''} ${alumno.apellidoMaterno || ''}`.trim()}
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <span style={{ fontSize: 20, lineHeight: 1, color: '#fff' }}>×</span>
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 0.5, pb: 2 }}>
        <div className="detail-container" style={{ paddingTop: 0 }}>
          <h3 className="detail-section-title" style={{ marginTop: '8px', marginBottom: '12px', fontSize: '1.3rem' }}>Datos Personales</h3>
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

          <h3 className="detail-section-title" style={{ marginTop: '12px', marginBottom: '12px', fontSize: '1.3rem' }}>Nivel Actual</h3>
          <div className="detail-grid history-section">
            <p><strong>Nivel:</strong> {alumno.nivel || 'No asignado'}</p>
          </div>

          <h3 className="detail-section-title" style={{ marginTop: '12px', marginBottom: '12px', fontSize: '1.3rem' }}>Plan de Estudios</h3>
          <div className='levels-path-container'>
            <ul className="levels-path-list">
              {nivelesPosibles.map((nivel, index) => {
                const statusClass = getNivelStatus(nivel.nombre, index);
                return (
                  <li key={nivel.id} className={statusClass}>
                    {nivel.nombre}
                  </li>
                );
              })}
            </ul>
            <div style={{ marginTop: '12px', fontSize: '0.8rem', color: '#6b7280' }}>
              <span style={{ display: 'inline-block', marginRight: '15px' }}>
                <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#22c55e', borderRadius: '50%', marginRight: '5px' }}></span>
                Aprobado
              </span>
              <span style={{ display: 'inline-block', marginRight: '15px' }}>
                <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#f97316', borderRadius: '50%', marginRight: '5px' }}></span>
                En curso
              </span>
              <span style={{ display: 'inline-block', marginRight: '15px' }}>
                <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '50%', marginRight: '5px' }}></span>
                Reprobado
              </span>
              <span style={{ display: 'inline-block' }}>
                <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#e9ecef', borderRadius: '50%', marginRight: '5px' }}></span>
                Pendiente
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
