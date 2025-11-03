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
  const getGrupoEnHorario = (dia, hora) => {
    const horaNum = horaANumero(hora);
    for (const grupo of gruposAsignados) {
      const diaMatch = grupo.dia.toLowerCase().includes(dia.toLowerCase().substring(0,3));
      if (diaMatch) {
        const inicioNum = horaANumero(grupo.horaInicio);
        const finNum = horaANumero(grupo.horaFin);
        if (horaNum >= inicioNum && horaNum < finNum) return grupo;
      }
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
      <DialogContent dividers>
        <div className="schedule-grid-wrapper">
          <table className="schedule-table">
            <thead>
              <tr>
                <th className="time-header">Hora</th>
                {dias.map(d=> <th key={d}>{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {horas.map(hora=> (
                <tr key={hora}>
                  <td className="time-cell">{hora}</td>
                  {dias.map(dia=> {
                    const grupo = getGrupoEnHorario(dia, hora);
                    if (grupo) return (<td key={`${dia}-${hora}`} className="schedule-cell occupied"><strong>{grupo.nombre}</strong><span>{grupo.nivel}</span></td>);
                    return <td key={`${dia}-${hora}`} className="schedule-cell empty"></td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
