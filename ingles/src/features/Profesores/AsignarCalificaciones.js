import React, { useState, useEffect } from 'react';
import '../../styles/perfil-usuario.css';

function AsignarCalificaciones({ profesores = [], alumnos = [], grupos = [] }) {
  const [group, setGroup] = useState('');
  const [examType, setExamType] = useState('');
  const [examDate, setExamDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [studentsInGroup, setStudentsInGroup] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [grade, setGrade] = useState('');
  const [comments, setComments] = useState('');
  const [grades, setGrades] = useState([]);

  // Build group options from grupos if available, otherwise derive from alumnos
  const groupOptions = React.useMemo(() => {
    if (Array.isArray(grupos) && grupos.length) return grupos.map(g => ({ id: g.id, name: g.nombre }));
    // derive from alumnos by nivel+modalidad
    const map = {};
    (Array.isArray(alumnos) ? alumnos : []).forEach(a => {
      if (!a) return;
      const name = `${a.nivel || 'Nivel Desconocido'} - ${a.modalidad || 'Modalidad'}`;
      if (!map[name]) map[name] = name;
    });
    return Object.keys(map).map((k, i) => ({ id: `derived-${i}`, name: k }));
  }, [grupos, alumnos]);

  useEffect(() => {
    if (!group) {
      setStudentsInGroup([]);
      setSelectedStudent(null);
      return;
    }
    // If grupos provided, find by name and map alumnoIds to alumnos
    const g = (Array.isArray(grupos) ? grupos.find(x => x.nombre === group || x.id === group) : null);
    if (g && Array.isArray(g.alumnoIds)) {
      const list = g.alumnoIds.map(id => (alumnos || []).find(a => a.numero_control === id)).filter(Boolean);
      setStudentsInGroup(list);
    } else {
      // derive: filter alumnos whose nivel+modalidad matches
      const list = (alumnos || []).filter(a => `${a.nivel || 'Nivel Desconocido'} - ${a.modalidad || 'Modalidad'}` === group);
      setStudentsInGroup(list);
    }
    setSelectedStudent(null);
  }, [group, grupos, alumnos]);

  const handleSelectStudent = (s) => {
    setSelectedStudent(s);
  };

  const getGradeClass = (g) => {
    const val = Number(g);
    if (val >= 9) return 'grade-excellent';
    if (val >= 8) return 'grade-good';
    if (val >= 7) return 'grade-regular';
    return 'grade-poor';
  };

  const getGradeLabel = (g) => {
    const val = Number(g);
    if (val >= 9) return 'Excelente';
    if (val >= 8) return 'Muy Bueno';
    if (val >= 7) return 'Bueno';
    return 'Necesita Mejorar';
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!selectedStudent) return alert('Selecciona un estudiante');
    if (!group || !examType || !examDate) return alert('Completa grupo, tipo de evaluación y fecha');
    const parsed = parseFloat(grade);
    if (Number.isNaN(parsed) || parsed < 0 || parsed > 10) return alert('La calificación debe ser un número entre 0 y 10');
    const newGrade = {
      __id: `g-${Date.now()}`,
      student_id: selectedStudent.numero_control,
      student_name: `${selectedStudent.nombre || selectedStudent.nombre_completo || selectedStudent.nombreCompleto || selectedStudent.nombre_alumno || selectedStudent.nombre}`,
      group: group,
      exam_type: examType,
      grade: parsed,
      date: examDate,
      comments: comments || ''
    };
    setGrades(s => [newGrade, ...s]);
    // reset input
    setGrade('');
    setComments('');
    alert('Calificación guardada (local)');
  };

  return (
    <div className="min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Seleccionar Grupo y Evaluación</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Grupo</label>
            <select value={group} onChange={e => setGroup(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
              <option value="">Seleccionar grupo...</option>
              {groupOptions.map(g => (
                <option key={g.id} value={g.name}>{g.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Evaluación</label>
            <select value={examType} onChange={e => setExamType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
              <option value="">Seleccionar evaluación...</option>
              <option>Examen Parcial</option>
              <option>Examen Final</option>
              <option>Tarea</option>
              <option>Proyecto</option>
              <option>Participación</option>
              <option>Quiz</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
            <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Lista de Estudiantes</h2>
          <div style={{ maxHeight: 420, overflowY: 'auto' }}>
            {studentsInGroup.length === 0 ? (
              <div className="text-center text-gray-500 py-8">Selecciona un grupo para ver los estudiantes</div>
            ) : (
              studentsInGroup.map(s => (
                <div key={s.numero_control} onClick={() => handleSelectStudent(s)} style={{ display: 'flex', justifyContent: 'space-between', padding: 10, borderRadius: 8, marginBottom: 8, cursor: 'pointer', background: (selectedStudent && selectedStudent.numero_control === s.numero_control) ? '#f3e8ff' : '#f8fafc' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{s.nombre || s.nombre_completo || s.nombreAlumno || s.nombre_alumno}</div>
                        <div style={{ fontSize: 12, color: '#6b7280' }}>ID: {s.numero_control}</div>
                  </div>
                      <div style={{ alignSelf: 'center' }}>{'>'}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Asignar Calificación</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estudiante Seleccionado</label>
              <div className="px-3 py-2 bg-gray-100 rounded-lg text-gray-600">{selectedStudent ? (selectedStudent.nombre || selectedStudent.nombre_completo || selectedStudent.nombreAlumno || selectedStudent.numero_control) : 'Ningún estudiante seleccionado'}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Calificación (0-10)</label>
              <input type="number" value={grade} onChange={e => setGrade(e.target.value)} min="0" max="10" step="0.1" className="grade-input w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none" placeholder="Ingresa la calificación" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Comentarios (Opcional)</label>
              <textarea rows={3} value={comments} onChange={e => setComments(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" placeholder="Comentarios sobre el desempeño del estudiante..."></textarea>
            </div>

            <div>
              <button type="submit" className="w-full" style={{ background: '#7A1F5C', color: '#fff', padding: '10px 12px', borderRadius: 8, fontWeight: 600 }}>Guardar Calificación</button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Calificaciones Registradas</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #eef2f7' }}>
                <th style={{ textAlign: 'left', padding: '12px' }}>Estudiante</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Grupo</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Evaluación</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Calificación</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Fecha</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {grades.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: '#6b7280' }}>No hay calificaciones registradas aún</td></tr>
              ) : (
                grades.map(g => (
                  <tr key={g.__id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: 12 }}>
                      <div style={{ fontWeight: 700 }}>{g.student_name}</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>ID: {g.student_id}</div>
                    </td>
                    <td style={{ padding: 12 }}>{g.group}</td>
                    <td style={{ padding: 12 }}>{g.exam_type}</td>
                    <td style={{ padding: 12 }}><span style={{ padding: '6px 8px', borderRadius: 999 }} className={getGradeClass(g.grade)}>{g.grade} — {getGradeLabel(g.grade)}</span></td>
                    <td style={{ padding: 12 }}>{new Date(g.date).toLocaleDateString('es-ES')}</td>
                    <td style={{ padding: 12 }}><button onClick={() => setGrades(gs => gs.filter(x => x.__id !== g.__id))} style={{ color: '#dc2626', fontWeight: 600 }}>Eliminar</button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AsignarCalificaciones;
