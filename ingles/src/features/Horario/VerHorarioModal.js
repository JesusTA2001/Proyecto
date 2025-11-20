import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import '../../styles/listaEstudiante.css';

const horaANumero = (horaStr) => {
  if (!horaStr) return 0;
  const [hora, minuto] = horaStr.split(':').map(Number);
  return hora + (minuto / 60);
};

export default function VerHorarioModal({ open, onClose, profesor, grupos }) {
  if (!profesor) return null;
  const gruposAsignados = (grupos || []).filter(g => g.profesorId === profesor.numero_empleado);
  const dias = ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'];
  const generarHoras = (start=7,end=21)=>{ const horas=[]; for(let i=start;i<=end;i++) horas.push(`${String(i).padStart(2,'0')}:00`); return horas; };
  const horas = generarHoras(7,21);

  // Preprocesar grupos por día para determinar índice de inicio y span (en horas enteras)
  const startHour = 7;
  const gruposPorDia = {};
  for (const dia of dias) {
    const lista = gruposAsignados.filter(g => {
      if (!g.dia) return false;
      const diaMatch = g.dia.toLowerCase().includes(dia.toLowerCase().substring(0,3));
      return diaMatch;
    }).map(g => {
      const inicioNum = horaANumero(g.horaInicio);
      const finNum = horaANumero(g.horaFin);
      const startIndex = Math.max(0, Math.floor(inicioNum) - startHour);
      const span = Math.max(1, Math.ceil(finNum) - Math.floor(inicioNum));
      return { grupo: g, startIndex, span, inicioNum, finNum };
    });
    gruposPorDia[dia] = lista;
  }

  // función para obtener el grupo que ocupa una hora específica (si existe)
  const getGrupoEnHorario = (dia, hora) => {
    const horaNum = horaANumero(hora);
    for (const grupo of gruposAsignados) {
      if (!grupo.dia) continue;
      const diaMatch = grupo.dia.toLowerCase().includes(dia.toLowerCase().substring(0,3));
      if (!diaMatch) continue;
      const inicioNum = horaANumero(grupo.horaInicio);
      const finNum = horaANumero(grupo.horaFin);
      if (horaNum >= inicioNum && horaNum < finNum) return grupo;
    }
    return null;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ m:0,p:2, backgroundColor: 'var(--color-primary)', color:'#fff' }}>
        Horario de {profesor.nombre}
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right:8, top:8 }}>
          <span style={{ fontSize:20, lineHeight:1, color:'#fff' }}>×</span>
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ px: 0 }}>
        <div className="schedule-grid-wrapper" style={{ overflowX: 'auto' }}>
          <table className="schedule-table" style={{ borderCollapse: 'collapse', width: '100%', minWidth: 800, border: '1px solid #000' }}>
            <thead>
              <tr>
                <th className="time-header">Hora</th>
                {dias.map(d=> <th key={d}>{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {horas.map((hora)=> (
                <tr key={hora}>
                  <td className="time-cell" style={{ border: '1px solid #000' }}>{hora}</td>
                  {dias.map(dia=> {
                    const grupo = getGrupoEnHorario(dia, hora);
                    if (grupo) {
                      return (
                        <td key={`${dia}-${hora}`} className="schedule-cell occupied" style={{ verticalAlign: 'top', padding: '6px', border: '1px solid #000' }}>
                          <strong style={{ display: 'block' }}>{grupo.nombre}</strong>
                          <small style={{ display: 'block', color: '#666' }}>{grupo.nivel} • {grupo.salon || grupo.aula || ''}</small>
                        </td>
                      );
                    }
                    return <td key={`${dia}-${hora}`} className="schedule-cell empty" style={{ border: '1px solid #000', height: 48 }}></td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {gruposAsignados.length === 0 && (
          <div style={{ padding:16, color: '#555' }}>No hay grupos asignados a este profesor.</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
