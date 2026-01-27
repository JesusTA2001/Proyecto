import React, { useState, useEffect, useMemo } from 'react';
import '../../styles/perfil-usuario.css';
import '../../styles/PortalCalificaciones.css';
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, Snackbar, Alert } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

function AsignarCalificaciones({ profesor, alumnos = [], grupos = [], periodos = [], niveles = [] }) {
  const [group, setGroup] = useState('');
  const [studentsInGroup, setStudentsInGroup] = useState([]);
  const [calificaciones, setCalificaciones] = useState([]); // Calificaciones desde BD
  const [partialGrades, setPartialGrades] = useState({});
  const [toast, setToast] = useState({ open: false, message: '', type: 'success' });
  const [isLoading, setIsLoading] = useState(false);
  const [faltasByStudent, setFaltasByStudent] = useState({});

  const groupOptions = React.useMemo(() => {
    return grupos.map(g => ({ id: g.id, name: g.nombre, periodo: g.id_Periodo, nivel: g.id_Nivel }));
  }, [grupos]);

  // Cuando cambia el grupo seleccionado
  useEffect(() => {
    if (!group) {
      setStudentsInGroup([]);
      setPartialGrades({});
      return;
    }
    const g = grupos.find(x => x.nombre === group || x.id === parseInt(group));
    if (g && Array.isArray(g.alumnoIds)) {
      const list = g.alumnoIds.map(id => alumnos.find(a => a.numero_control === id)).filter(Boolean);
      setStudentsInGroup(list);
      cargarCalificacionesGrupo(g.id);
    } else {
      setStudentsInGroup([]);
      setPartialGrades({});
    }
  }, [group, grupos, alumnos]);

  // Cargar calificaciones del grupo desde la API
  const cargarCalificacionesGrupo = async (id_Grupo) => {
    try {
      setIsLoading(true);
      const response = await api.get(`/calificaciones/grupo/${id_Grupo}`);
      
      if (response.data.success) {
        setCalificaciones(response.data.calificaciones);
        
        // Mapear calificaciones a partialGrades
        const grades = {};
        response.data.calificaciones.forEach(cal => {
          grades[cal.nControl] = {
            p1: cal.parcial1 !== null ? cal.parcial1 : '',
            p2: cal.parcial2 !== null ? cal.parcial2 : '',
            p3: cal.parcial3 !== null ? cal.parcial3 : ''
          };
        });
        setPartialGrades(grades);
      }
    } catch (error) {
      console.error('Error al cargar calificaciones:', error);
      if (error.response?.status !== 404) {
        showToast('Error al cargar calificaciones', 'error');
      }
      setPartialGrades({});
    } finally {
      setIsLoading(false);
    }
  };

  // Exportar a CSV
  const exportToCSV = () => {
    if (!group) return alert('Primero selecciona un grupo para exportar');
    const rows = studentsInGroup.map((s, idx) => {
      const p = partialGrades[s.numero_control] || {};
      const p1 = Number(p.p1) || 0;
      const p2 = Number(p.p2) || 0;
      const p3 = Number(p.p3) || 0;
      const promedio = ((p1 + p2 + p3) / 3).toFixed(1);
      const faltas = faltasByStudent[s.numero_control] || 0;
      return {
        No: String(idx + 1).padStart(2, '0'),
        Control: s.numero_control,
        Nombre: s.nombre,
        Faltas: faltas,
        Parcial1: p1,
        Parcial2: p2,
        Parcial3: p3,
        Promedio: promedio,
      };
    });

    const csvHeader = Object.keys(rows[0] || {}).join(',') + '\r\n';
    const csvBody = rows.map(r => Object.values(r).join(',')).join('\r\n');
    const csv = csvHeader + csvBody;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const g = grupos.find(x => x.nombre === group || x.id === parseInt(group));
    const groupName = g ? g.nombre.replace(/\s+/g, '_') : 'grupo';
    link.setAttribute('download', `calificaciones_${groupName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Guardar todas las calificaciones
  const handleSaveAll = async () => {
    if (!group) return showToast('Selecciona un grupo primero', 'error');
    const g = grupos.find(x => x.nombre === group || x.id === parseInt(group));
    if (!g) return showToast('Grupo no encontrado', 'error');

    const entries = Object.entries(partialGrades);
    if (entries.length === 0) return showToast('No hay calificaciones para guardar', 'error');

    try {
      const calificacionesArray = entries.map(([nControl, parts]) => ({
        nControl: parseInt(nControl),
        parcial1: parts.p1 !== '' ? parseInt(parts.p1) : null,
        parcial2: parts.p2 !== '' ? parseInt(parts.p2) : null,
        parcial3: parts.p3 !== '' ? parseInt(parts.p3) : null,
        id_nivel: g.id_Nivel,
        id_Periodo: g.id_Periodo,
        id_Grupo: g.id
      }));

      const response = await api.post('/calificaciones/guardar', {
        calificaciones: calificacionesArray
      });

      if (response.data.success) {
        showToast('Calificaciones guardadas correctamente', 'success');
        cargarCalificacionesGrupo(g.id); // Recargar
      }
    } catch (error) {
      console.error('Error al guardar calificaciones:', error);
      showToast('Error al guardar calificaciones', 'error');
    }
  };

  // Guardar parcial individual inmediatamente
  const savePartialImmediate = async ({ studentId, parcialKey, rawValue }) => {
    if (!group) return;
    const g = grupos.find(x => x.nombre === group || x.id === parseInt(group));
    if (!g) return;
    if (rawValue === '' || rawValue === undefined) return;
    
    const pval = Number(rawValue);
    if (Number.isNaN(pval)) return;
    if (pval < 0 || pval > 100) return showToast('Valor fuera de rango 0-100', 'error');

    console.log('📝 Guardando parcial:', { 
      studentId, 
      parcialKey, 
      valor: pval, 
      id_Grupo: g.id,
      id_Nivel: g.id_Nivel,
      id_Periodo: g.id_Periodo,
      grupoCompleto: g
    });

    try {
      const payload = {
        nControl: parseInt(studentId),
        parcial: parcialKey, // 'parcial1', 'parcial2', 'parcial3'
        valor: parseInt(pval),
        id_nivel: g.id_Nivel,
        id_Periodo: g.id_Periodo,
        id_Grupo: g.id
      };

      console.log('📤 Enviando payload:', payload);

      const response = await api.post('/calificaciones/guardar-individual', payload);

      if (response.data.success) {
        console.log('✅ Parcial guardado exitosamente:', parcialKey);
        // Recargar calificaciones para asegurar sincronización
        await cargarCalificacionesGrupo(g.id);
      }
    } catch (error) {
      console.error('❌ Error al guardar parcial:', error);
      console.error('❌ Error response:', error.response?.data);
      showToast(`Error al guardar parcial: ${error.response?.data?.message || error.message}`, 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ open: true, message, type });
  };

  // Validación por alumno
  const validationByStudent = useMemo(() => {
    const map = {};
    studentsInGroup.forEach(s => {
      const id = s.numero_control;
      const parts = partialGrades[id] || {};
      const p1 = Number(parts.p1) || 0;
      const p2 = Number(parts.p2) || 0;
      const p3 = Number(parts.p3) || 0;
      map[id] = { valid: p1 >= 70 && p2 >= 70 && p3 >= 70, p1, p2, p3 };
    });
    return map;
  }, [studentsInGroup, partialGrades]);

  const allValid = studentsInGroup.length > 0 && studentsInGroup.every(s => validationByStudent[s.numero_control]?.valid);
  const invalidStudents = studentsInGroup.filter(s => !validationByStudent[s.numero_control]?.valid);

  const [invalidModalOpen, setInvalidModalOpen] = useState(false);

  // Obtener datos del grupo seleccionado
  const selectedGroupData = useMemo(() => {
    if (!group) return null;
    const g = grupos.find(x => x.nombre === group || x.id === parseInt(group));
    if (!g) return null;
    
    const periodo = periodos.find(p => p.id === g.id_Periodo);
    const nivel = niveles.find(n => n.id === g.id_Nivel);
    
    return {
      nombre: g.nombre,
      periodo: periodo?.nombre || 'N/A',
      nivel: nivel?.nombre || g.nivel || 'N/A'
    };
  }, [group, grupos, periodos, niveles]);

  const navigate = useNavigate();

  return (
    <div className="portal-container">
      {/* Header con datos del profesor, periodo, nivel y grupo */}
      <div className="card-white p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Seleccionar Grupo y Evaluación</h2>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 420px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <p className="text-sm text-gray-600">Profesor</p>
                <p className="text-base font-semibold">{profesor?.nombre || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Periodo</p>
                <p className="text-base font-semibold">{selectedGroupData?.periodo || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nivel</p>
                <p className="text-base font-semibold">{selectedGroupData?.nivel || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Grupo</p>
                <p className="text-base font-semibold">{selectedGroupData?.nombre || 'Ninguno'}</p>
              </div>
            </div>
          </div>

          {/* Modal con detalles de estudiantes inválidos */}
          <Dialog open={invalidModalOpen} onClose={() => setInvalidModalOpen(false)} fullWidth maxWidth="sm">
            <DialogTitle>Estudiantes con parciales menores a 70</DialogTitle>
            <DialogContent>
              <List>
                {invalidStudents.map(s => (
                  <ListItem key={s.numero_control}>
                    <ListItemText primary={s.nombre} secondary={`Control: ${s.numero_control}`} />
                  </ListItem>
                ))}
              </List>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setInvalidModalOpen(false)}>Cerrar</Button>
            </DialogActions>
          </Dialog>

          {/* Confirmación para forzar guardado */}
          {/* Confirmación para forzar guardado eliminado: ahora se guarda por parcial al editar */}

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div>
              <label className="form-label">Grupo</label>
              <select value={group} onChange={e => setGroup(e.target.value)} className="form-select">
                <option value="">Seleccionar grupo...</option>
                {groupOptions.map(g => (
                  <option key={g.id} value={g.name}>{g.name}</option>
                ))}
              </select>
            </div>
            {/* Se eliminó el botón Buscar Grupo: la selección actualiza la tabla automáticamente. */}
          </div>

          {/* Tipo de evaluación y fecha eliminados (se manejan desde la tabla) */}
        </div>
      </div>

      {/* Se eliminó la lista de estudiantes y el panel de información; la evaluación se hace en la tabla abajo */}

      <div className="card-white p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Calificaciones por Estudiante</h2>
        <div style={{ width: '100%' }}>
          <Box sx={{ height: 520, width: '100%' }}>
            <DataGrid
              rows={studentsInGroup.map((s, idx) => ({
                id: s.numero_control,
                no: String(idx + 1).padStart(2, '0'),
                control: s.numero_control,
                nombre: s.nombre,
                faltas: faltasByStudent[s.numero_control] || 0,
                p1: partialGrades[s.numero_control]?.p1 ?? '',
                p2: partialGrades[s.numero_control]?.p2 ?? '',
                p3: partialGrades[s.numero_control]?.p3 ?? '',
                promedio: (() => {
                  const p1 = Number(partialGrades[s.numero_control]?.p1) || 0;
                  const p2 = Number(partialGrades[s.numero_control]?.p2) || 0;
                  const p3 = Number(partialGrades[s.numero_control]?.p3) || 0;
                  const avg = (p1 + p2 + p3) / 3;
                  return Number(avg.toFixed(1));
                })(),
                aprobado: (() => {
                  const p1 = Number(partialGrades[s.numero_control]?.p1) || 0;
                  const p2 = Number(partialGrades[s.numero_control]?.p2) || 0;
                  const p3 = Number(partialGrades[s.numero_control]?.p3) || 0;
                  const avg = (p1 + p2 + p3) / 3;
                  return avg >= 70 ? 'APROBADO' : 'REPROBADO';
                })()
              }))}
              columns={[
                { field: 'no', headerName: 'No.', width: 80 },
                { field: 'control', headerName: 'No. Control', width: 140 },
                { field: 'nombre', headerName: 'Estudiante', flex: 1, minWidth: 220 },
                { field: 'faltas', headerName: 'Faltas', width: 100, align: 'center', headerAlign: 'center' },
                {
                  field: 'p1', headerName: 'Parcial 1', width: 140, renderCell: (params) => (
                    <TextField
                      type="number"
                      inputProps={{ min: 0, max: 100 }}
                      size="small"
                      value={params.row.p1}
                      error={(() => {
                        const v = partialGrades[params.id]?.p1;
                        return v !== undefined && v !== '' && Number(v) < 70;
                      })()}
                      helperText={(() => {
                        const v = partialGrades[params.id]?.p1;
                        if (v === undefined || v === '') return '';
                        if (Number(v) > 100) return 'Máximo 100';
                        if (Number(v) < 70) return 'Mínimo 70 para aprobar';
                        return '';
                      })()}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (val === '') {
                          setPartialGrades(prev => ({ ...prev, [params.id]: { ...(prev[params.id] || {}), p1: '' } }));
                          return;
                        }
                        let n = Number(val);
                        if (Number.isNaN(n)) n = '';
                        if (n !== '' && n > 100) n = 100;
                        if (n !== '') n = Math.round(n);
                        setPartialGrades(prev => ({ ...prev, [params.id]: { ...(prev[params.id] || {}), p1: n } }));
                      }}
                      onBlur={(e) => {
                        const n = partialGrades[params.id]?.p1;
                        if (n !== '' && n !== undefined) {
                          savePartialImmediate({ studentId: params.id, parcialKey: 'parcial1', rawValue: n });
                        }
                      }}
                    />
                  )
                },
                {
                  field: 'p2', headerName: 'Parcial 2', width: 140, renderCell: (params) => (
                    <TextField
                      type="number"
                      inputProps={{ min: 0, max: 100 }}
                      size="small"
                      value={params.row.p2}
                      error={(() => {
                        const v = partialGrades[params.id]?.p2;
                        return v !== undefined && v !== '' && Number(v) < 70;
                      })()}
                      helperText={(() => {
                        const v = partialGrades[params.id]?.p2;
                        if (v === undefined || v === '') return '';
                        if (Number(v) > 100) return 'Máximo 100';
                        if (Number(v) < 70) return 'Mínimo 70 para aprobar';
                        return '';
                      })()}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (val === '') {
                          setPartialGrades(prev => ({ ...prev, [params.id]: { ...(prev[params.id] || {}), p2: '' } }));
                          return;
                        }
                        let n = Number(val);
                        if (Number.isNaN(n)) n = '';
                        if (n !== '' && n > 100) n = 100;
                        if (n !== '') n = Math.round(n);
                        setPartialGrades(prev => ({ ...prev, [params.id]: { ...(prev[params.id] || {}), p2: n } }));
                      }}
                      onBlur={(e) => {
                        const n = partialGrades[params.id]?.p2;
                        if (n !== '' && n !== undefined) {
                          savePartialImmediate({ studentId: params.id, parcialKey: 'parcial2', rawValue: n });
                        }
                      }}
                    />
                  )
                },
                {
                  field: 'p3', headerName: 'Parcial 3', width: 140, renderCell: (params) => (
                    <TextField
                      type="number"
                      inputProps={{ min: 0, max: 100 }}
                      size="small"
                      value={params.row.p3}
                      error={(() => {
                        const v = partialGrades[params.id]?.p3;
                        return v !== undefined && v !== '' && Number(v) < 70;
                      })()}
                      helperText={(() => {
                        const v = partialGrades[params.id]?.p3;
                        if (v === undefined || v === '') return '';
                        if (Number(v) > 100) return 'Máximo 100';
                        if (Number(v) < 70) return 'Mínimo 70 para aprobar';
                        return '';
                      })()}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (val === '') {
                          setPartialGrades(prev => ({ ...prev, [params.id]: { ...(prev[params.id] || {}), p3: '' } }));
                          return;
                        }
                        let n = Number(val);
                        if (Number.isNaN(n)) n = '';
                        if (n !== '' && n > 100) n = 100;
                        if (n !== '') n = Math.round(n);
                        setPartialGrades(prev => ({ ...prev, [params.id]: { ...(prev[params.id] || {}), p3: n } }));
                      }}
                      onBlur={(e) => {
                        const n = partialGrades[params.id]?.p3;
                        if (n !== '' && n !== undefined) {
                          savePartialImmediate({ studentId: params.id, parcialKey: 'parcial3', rawValue: n });
                        }
                      }}
                    />
                  )
                },
                { field: 'promedio', headerName: 'Promedio', width: 120, align: 'center', headerAlign: 'center', 
                  renderCell: (params) => {
                    const prom = params.row.promedio;
                    const color = prom >= 70 ? '#16a34a' : '#dc2626';
                    return <span style={{ fontWeight: 'bold', color }}>{prom}</span>;
                  }
                },
                { field: 'aprobado', headerName: 'Estado', width: 140, align: 'center', headerAlign: 'center',
                  renderCell: (params) => {
                    const estado = params.row.aprobado;
                    const isAprobado = estado === 'APROBADO';
                    return (
                      <span style={{ 
                        fontWeight: 'bold', 
                        color: isAprobado ? '#16a34a' : '#dc2626',
                        backgroundColor: isAprobado ? '#dcfce7' : '#fee2e2',
                        padding: '4px 8px',
                        borderRadius: '4px'
                      }}>
                        {estado}
                      </span>
                    );
                  }
                },
              ]}
              disableRowSelectionOnClick
              components={{ Toolbar: GridToolbar }}
              pageSizeOptions={[10, 25, 50]}
              density="comfortable"
            />
          </Box>

          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}> 
            <div>
              {!allValid && invalidStudents.length > 0 && (
                <div style={{ marginTop: 8, color: '#b91c1c' }}>
                  {invalidStudents.length} estudiante(s) con parciales menores a 70. <Button size="small" onClick={() => setInvalidModalOpen(true)}>Ver detalles</Button>
                </div>
              )}
            </div>
            <div>
              {/* Botón Exportar a la derecha, color verde institucional */}
              <button className="createbutton" onClick={exportToCSV} style={{ height: 38, marginRight: 8 }}>Exportar Excel</button>
            </div>
          </div>

          {/* Toast usando Snackbar de Material-UI */}
          <Snackbar
            open={toast.open}
            autoHideDuration={1000}
            onClose={() => setToast(prev => ({ ...prev, open: false }))}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert 
              onClose={() => setToast(prev => ({ ...prev, open: false }))} 
              severity={toast.type === 'error' ? 'error' : toast.type === 'info' ? 'info' : 'success'} 
              sx={{ width: '100%' }}
            >
              {toast.message}
            </Alert>
          </Snackbar>
        </div>
      </div>
    </div>
  );
}

export default AsignarCalificaciones;