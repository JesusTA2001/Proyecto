import React, { useEffect, useState } from 'react';
import { Paper, Typography, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';

export default function HistorialGrupoDetalle() {
  const { id } = useParams();
  const [grupo, setGrupo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetalle = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/grupos/historial?id_Grupo=${id}`);
        if (res.data && res.data.success) {
          const g = (res.data.grupos || [])[0] || null;
          setGrupo(g);
        } else {
          setError('Respuesta inesperada del servidor.');
        }
      } catch (e) {
        console.error('Error cargando detalle historial:', e);
        setError('Error al cargar detalle. Revisa la consola.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetalle();
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div style={{ color: '#b91c1c' }}>{error}</div>;
  if (!grupo) return <div>No se encontró el grupo en historial.</div>;

  return (
    <Paper style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Detalle Historial - {grupo.grupo}</Typography>
        <div>
          <Button variant="contained" color="success" onClick={() => alert('Exportar Excel no implementado')}>Exportar Excel</Button>
        </div>
      </div>

      <p><strong>Periodo:</strong> {grupo.periodo_nombre || grupo.id_Periodo}</p>
      <p><strong>Nivel:</strong> {grupo.nivel_nombre || grupo.id_Nivel}</p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ddd', padding: 8 }}>No. Control</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: 8 }}>Estudiante</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: 8 }}>Parcial1</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: 8 }}>Parcial2</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: 8 }}>Parcial3</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: 8 }}>Final</th>
            </tr>
          </thead>
          <tbody>
            {(grupo.alumnos || []).map((a, idx) => (
              <tr key={a.nControl || idx}>
                <td style={{ padding: 8, borderBottom: '1px solid #f1f1f1' }}>{a.nControl}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f1f1f1' }}>{a.nombre_completo || a.nombre}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f1f1f1' }}>{a.calificaciones?.parcial1 ?? '-'}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f1f1f1' }}>{a.calificaciones?.parcial2 ?? '-'}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f1f1f1' }}>{a.calificaciones?.parcial3 ?? '-'}</td>
                <td style={{ padding: 8, borderBottom: '1px solid #f1f1f1' }}>{a.calificaciones?.final ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Paper>
  );
}
