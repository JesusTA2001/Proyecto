import React, { useState, useEffect, useMemo } from 'react';
import '../../styles/perfil-usuario.css';
// Importamos los estilos del nuevo portal para reusar las clases de colores
import '../../styles/PortalCalificaciones.css';
// Material UI
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, Snackbar, Alert } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

// Función para cargar calificaciones desde localStorage
const loadGrades = () => {
  try {
    const data = localStorage.getItem('allGrades');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

// Función para cargar asistencias (faltas)
const loadAsistencias = () => {
  try {
    const data = localStorage.getItem('allAsistencias');
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
};

function AsignarCalificaciones({ profesor, alumnos = [], grupos = [] }) {
  const [group, setGroup] = useState('');
  // tipo de evaluación y fecha eliminados: manejo por la tabla
  const [studentsInGroup, setStudentsInGroup] = useState([]);
  
  // MODIFICADO: Carga las calificaciones desde localStorage
  const [grades, setGrades] = useState(loadGrades);
  // Cargamos asistencias para calcular faltas
  const [allAsistencias] = useState(() => loadAsistencias());

  // Estado para parciales por alumno: { [studentId]: { p1: number, p2: number, p3: number } }
  const [partialGrades, setPartialGrades] = useState({});
  // Toast simple
  const [toast, setToast] = useState({ open: false, message: '', type: 'success' });

  // MODIFICADO: Guarda en localStorage cada vez que las calificaciones cambian
  useEffect(() => {
    localStorage.setItem('allGrades', JSON.stringify(grades));
  }, [grades]);


  const groupOptions = React.useMemo(() => {
    return grupos.map(g => ({ id: g.id, name: g.nombre }));
  }, [grupos]);

  // La lista se actualiza inmediatamente cuando cambia la selección de grupo
  useEffect(() => {
    if (!group) {
      setStudentsInGroup([]);
      return;
    }
    const g = grupos.find(x => x.nombre === group || x.id === group);
    if (g && Array.isArray(g.alumnoIds)) {
      const list = g.alumnoIds.map(id => alumnos.find(a => a.numero_control === id)).filter(Boolean);
      setStudentsInGroup(list);
    } else {
      setStudentsInGroup([]);
    }
  }, [group, grupos, alumnos]);

  // Cuando se selecciona un grupo o cambian las calificaciones guardadas,
  // pre-populamos los campos parciales con las últimas calificaciones existentes
  useEffect(() => {
    if (!group) {
      setPartialGrades({});
      return;
    }
    const g = grupos.find(x => x.nombre === group || x.id === group);
    if (!g) {
      setPartialGrades({});
      return;
    }

    const next = {};
    (g.alumnoIds || []).forEach(studentId => {
      const student = alumnos.find(a => a.numero_control === studentId);
      if (!student) return;

      // Buscar la última entrada por parcial para este estudiante dentro del grupo
      const p1Entry = grades.filter(gr => gr.student_id === studentId && (gr.group_name === g.nombre || gr.group_name === g.id) && String(gr.exam_type).toLowerCase() === 'parcial 1')
        .sort((a,b) => new Date(b.date) - new Date(a.date))[0];
      const p2Entry = grades.filter(gr => gr.student_id === studentId && (gr.group_name === g.nombre || gr.group_name === g.id) && String(gr.exam_type).toLowerCase() === 'parcial 2')
        .sort((a,b) => new Date(b.date) - new Date(a.date))[0];
      const p3Entry = grades.filter(gr => gr.student_id === studentId && (gr.group_name === g.nombre || gr.group_name === g.id) && String(gr.exam_type).toLowerCase() === 'parcial 3')
        .sort((a,b) => new Date(b.date) - new Date(a.date))[0];

      next[studentId] = {
        p1: p1Entry ? (Number(p1Entry.raw_grade_100) || 0) : '',
        p2: p2Entry ? (Number(p2Entry.raw_grade_100) || 0) : '',
        p3: p3Entry ? (Number(p3Entry.raw_grade_100) || 0) : ''
      };
    });

    setPartialGrades(prev => ({ ...next }));
  }, [group, grades, grupos, alumnos]);

  // handleSelectStudent removed: la lista de estudiantes ya no es interactiva aquí

  // Antes había un botón "Buscar Grupo" que aplicaba la selección;
  // ahora la selección de grupo actualiza la tabla inmediatamente (onChange del select).

  // Exportar a CSV (Excel puede abrir CSV)
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
  const g = grupos.find(x => x.nombre === group || x.id === group);
    const groupName = g ? g.nombre.replace(/\s+/g, '_') : 'grupo';
    link.setAttribute('download', `calificaciones_${groupName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Guardar múltiples calificaciones desde partialGrades (escala 0-100)
  const handleSaveAll = () => {
    if (!group) return showToast('Selecciona un grupo primero', 'error');
    const g = grupos.find(x => x.nombre === group || x.id === group);
    if (!g) return showToast('Grupo no encontrado', 'error');

    const entries = Object.entries(partialGrades);
    if (entries.length === 0) return showToast('No hay parciales ingresados', 'error');

    // Creamos una entrada por cada parcial presente (Parcial 1, Parcial 2, Parcial 3)
    const newGrades = [];
    entries.forEach(([studentId, parts]) => {
      const student = alumnos.find(a => a.numero_control === studentId) || { nombre: 'N/A' };
      const parcialMap = [
        { key: 'p1', label: 'Parcial 1' },
        { key: 'p2', label: 'Parcial 2' },
        { key: 'p3', label: 'Parcial 3' }
      ];

      parcialMap.forEach((pInfo) => {
        const raw = parts[pInfo.key];
        if (raw === undefined || raw === '') return; // no guardar si no hay valor
        const pval = Number(raw);
        if (Number.isNaN(pval)) return;
        if (pval < 0 || pval > 100) throw new Error('Las parciales deben estar entre 0 y 100');

        const normalized = Number((pval / 10).toFixed(2)); // escala 0-10

        newGrades.push({
          __id: `g-${Date.now()}-${studentId}-${pInfo.key}`,
          student_id: studentId,
          student_name: student.nombre,
          group_name: g.nombre,
          exam_type: pInfo.label,
          grade: normalized,
          raw_grade_100: Number(pval.toFixed(1)),
          date: new Date().toISOString().slice(0,10),
          comments: '',
          teacher_id: profesor?.numero_empleado || 'N/A',
          teacher_name: profesor?.nombre || 'N/A'
        });
      });
    });

    // Append to existing grades
    setGrades(s => [...newGrades, ...s]);
    // Reset partials
    setPartialGrades({});
    showToast('Calificaciones guardadas correctamente', 'success');
  };

  // Guardar inmediatamente una parcial individual (no sobrescribe otras parciales)
  const savePartialImmediate = ({ studentId, parcialKey, rawValue }) => {
    if (!group) return showToast('Selecciona un grupo primero', 'error');
    const g = grupos.find(x => x.nombre === group || x.id === group);
    if (!g) return showToast('Grupo no encontrado', 'error');
    if (rawValue === '' || rawValue === undefined) return; // nothing to save
    const pval = Number(rawValue);
    if (Number.isNaN(pval)) return;
    if (pval < 0 || pval > 100) return showToast('Valor de parcial fuera de rango 0-100', 'error');

    const normalized = Number((pval / 10).toFixed(2)); // escala 0-10
    const labelMap = { p1: 'Parcial 1', p2: 'Parcial 2', p3: 'Parcial 3' };
    const entry = {
      __id: `g-${Date.now()}-${studentId}-${parcialKey}`,
      student_id: studentId,
      student_name: (alumnos.find(a => a.numero_control === studentId)?.nombre) || 'N/A',
      group_name: g.nombre,
      exam_type: labelMap[parcialKey] || parcialKey,
      grade: normalized,
      raw_grade_100: Number(pval.toFixed(1)),
      date: new Date().toISOString().slice(0,10),
      comments: '',
      teacher_id: profesor?.numero_empleado || 'N/A',
      teacher_name: profesor?.nombre || 'N/A'
    };

    // Append — no se sobrescribe nada previo, solo agregamos un registro histórico
    setGrades(s => [entry, ...s]);
    showToast(`Parcial guardado: ${entry.exam_type} (${entry.student_id})`, 'success');
  };

  const showToast = (message, type = 'success') => {
    setToast({ open: true, message, type });
  };

  // Las utilidades de etiqueta/clase y eliminación se eliminaron porque no se usan aquí.

  // Calcular faltas por alumno en el grupo seleccionado
  const faltasByStudent = useMemo(() => {
    if (!group) return {};
    const g = grupos.find(x => x.nombre === group || x.id === group);
    if (!g) return {};
    const asistencias = allAsistencias[g.id] || {};
    const res = {};
    Object.keys(asistencias).forEach(date => {
      const day = asistencias[date];
      Object.keys(day).forEach(studentId => {
        if (!res[studentId]) res[studentId] = 0;
        if (day[studentId] === 'ausente') res[studentId] += 1;
      });
    });
    return res;
  }, [group, grupos, allAsistencias]);

  // Validación por alumno: cada parcial debe ser >= 70
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
  // confirmForceOpen removed: no forced-save flow anymore

  return (
    <div className="portal-container"> {/* Usamos la clase base del nuevo CSS */}
      {/* Header con datos del profesor, periodo (vacío), nivel, modalidad y grupo */}
      <div className="card-white p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Seleccionar Grupo y Evaluación</h2>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 420px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <p className="text-sm text-gray-600">Periodo</p>
                <p className="text-base font-semibold">&nbsp;</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Profesor</p>
                <p className="text-base font-semibold">{profesor?.nombre || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nivel</p>
                <p className="text-base font-semibold">{(() => {
                  const g = grupos.find(x => x.nombre === group || x.id === group);
                  return g?.nivel || '';
                })()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Modalidad</p>
                <p className="text-base font-semibold">{(() => {
                  const g = grupos.find(x => x.nombre === group || x.id === group);
                  return g?.modalidad || '';
                })()}</p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <p className="text-sm text-gray-600">Grupo</p>
                <p className="text-base font-semibold">{group || 'Ninguno'}</p>
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
                        // permitir solo números; limitar máximo a 100
                        let n = Number(val);
                        if (Number.isNaN(n)) n = '';
                        if (n !== '' && n > 100) n = 100;
                        if (n !== '') n = Math.round(n);
                        setPartialGrades(prev => ({ ...prev, [params.id]: { ...(prev[params.id] || {}), p1: n } }));
                        // guardar inmediatamente esta parcial
                        if (n !== '' && n !== undefined) savePartialImmediate({ studentId: params.id, parcialKey: 'p1', rawValue: n });
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
                        // guardar inmediatamente esta parcial
                        if (n !== '' && n !== undefined) savePartialImmediate({ studentId: params.id, parcialKey: 'p2', rawValue: n });
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
                        // guardar inmediatamente esta parcial
                        if (n !== '' && n !== undefined) savePartialImmediate({ studentId: params.id, parcialKey: 'p3', rawValue: n });
                      }}
                    />
                  )
                },
                { field: 'promedio', headerName: 'Promedio', width: 120, align: 'center', headerAlign: 'center' },
                { field: 'aprobado', headerName: 'Estado', width: 140, align: 'center', headerAlign: 'center' },
              ]}
              disableRowSelectionOnClick
              components={{ Toolbar: GridToolbar }}
              pageSizeOptions={[10, 25, 50]}
              density="comfortable"
            />
          </Box>

          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}> 
            <div>
              <Button variant="contained" color="primary" onClick={handleSaveAll} disabled={!allValid}>Guardar Calificaciones</Button>
              {!allValid && invalidStudents.length > 0 && (
                <div style={{ marginTop: 8, color: '#b91c1c' }}>
                  {invalidStudents.length} estudiante(s) con parciales menores a 70. <Button size="small" onClick={() => setInvalidModalOpen(true)}>Ver detalles</Button>
                </div>
              )}
            </div>
            <div>
              {/* Botón Exportar a la derecha, color verde institucional */}
              <button className="createbutton" onClick={exportToCSV} style={{ height: 38 }}>Exportar Excel</button>
            </div>
          </div>

          {/* Toast simple */}
          {toast.open && (
            <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 2000 }}>
              <div style={{ padding: '10px 16px', borderRadius: 8, color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', background: toast.type === 'error' ? '#ef4444' : toast.type === 'info' ? '#2563eb' : '#10b981' }}>
                {toast.message}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AsignarCalificaciones;