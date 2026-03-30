import React, { useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import html2canvas from 'html2canvas';
import '../../styles/listaEstudiante.css';

const horaANumero = (horaStr) => {
  if (!horaStr) return 0;
  const [hora, minuto] = horaStr.split(':').map(Number);
  return hora + (minuto / 60);
};

export default function VerHorarioModal({ open, onClose, profesor, grupos }) {
  const tableContainerRef = useRef(null);
  if (!profesor) return null;
  const gruposAsignados = (grupos || []).filter(g => g.profesorId === profesor.numero_empleado);
  const dias = ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'];
  const generarHoras = (start=7,end=21)=>{ const horas=[]; for(let i=start;i<=end;i++) horas.push(`${String(i).padStart(2,'0')}:00`); return horas; };
  const horas = generarHoras(7,21);

  // función para obtener el grupo que ocupa una hora específica (si existe)
  const getGrupoEnHorario = (dia, hora) => {
    const horaNum = horaANumero(hora);
    for (const grupo of gruposAsignados) {
      if (!grupo.dia) continue;
      const diaMatch = grupo.dia.toLowerCase().includes(dia.toLowerCase().substring(0,3));
      if (!diaMatch) continue;
      
      // Parsear el rango de horas "08:00-10:00"
      let inicioNum = 0;
      let finNum = 0;
      
      if (grupo.hora && grupo.hora.includes('-')) {
        // Formato nuevo: "08:00-10:00"
        const [inicio, fin] = grupo.hora.split('-');
        inicioNum = horaANumero(inicio.trim());
        finNum = horaANumero(fin.trim());
      } else {
        // Fallback para formato antiguo
        inicioNum = horaANumero(grupo.horaInicio);
        finNum = horaANumero(grupo.horaFin);
      }
      
      if (horaNum >= inicioNum && horaNum < finNum) return grupo;
    }
    return null;
  };

  const handleDownloadPDF = () => {
    const content = tableContainerRef.current;
    if (!content) return;

    const popup = window.open('', '_blank', 'width=1200,height=800');
    if (!popup) {
      alert('No se pudo abrir la ventana para generar PDF. Verifica bloqueador de ventanas.');
      return;
    }

    const nombre = profesor.nombreCompleto || `${profesor.nombre || ''} ${profesor.apellidoPaterno || ''} ${profesor.apellidoMaterno || ''}`.trim() || 'Profesor';

    popup.document.write(`
      <html>
        <head>
          <title>Horario de ${nombre}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { margin: 0 0 16px 0; color: #8A2F83; font-size: 20px; }
            table { border-collapse: collapse; width: 100%; min-width: 800px; }
            th, td { border: 1px solid #000; padding: 6px; text-align: left; }
            th { background: #8A2F83; color: #fff; }
            small { color: #555; }
          </style>
        </head>
        <body>
          <h1>Horario de ${nombre}</h1>
          ${content.innerHTML}
        </body>
      </html>
    `);

    popup.document.close();
    popup.focus();
    setTimeout(() => popup.print(), 300);
  };

  const handleDownloadPNG = async () => {
    const content = tableContainerRef.current;
    if (!content) return;

    try {
      const canvas = await html2canvas(content, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true
      });

      const image = canvas.toDataURL('image/png');
      const nombre = (profesor.nombreCompleto || `${profesor.nombre || ''} ${profesor.apellidoPaterno || ''} ${profesor.apellidoMaterno || ''}`.trim() || 'profesor')
        .toLowerCase()
        .replace(/\s+/g, '_');

      const link = document.createElement('a');
      link.href = image;
      link.download = `horario_${nombre}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert('No fue posible generar la imagen PNG del horario.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ m:0,p:2, backgroundColor: 'var(--color-primary)', color:'#fff' }}>
        Horario de {profesor.nombreCompleto || `${profesor.nombre} ${profesor.apellidoPaterno || ''} ${profesor.apellidoMaterno || ''}`.trim()}
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right:8, top:8 }}>
          <span style={{ fontSize:20, lineHeight:1, color:'#fff' }}>×</span>
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ px: 0 }}>
        <div ref={tableContainerRef} className="schedule-grid-wrapper" style={{ overflowX: 'auto' }}>
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
      <DialogActions>
        <Button onClick={handleDownloadPNG} variant="outlined">Descargar PNG</Button>
        <Button onClick={handleDownloadPDF} variant="outlined">Descargar PDF</Button>
        <Button onClick={onClose} variant="contained" sx={{ backgroundColor: 'var(--color-primary)' }}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
