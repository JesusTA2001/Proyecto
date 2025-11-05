import React, { useState, useEffect } from 'react';
import '../../styles/perfil-usuario.css';
// Importamos los estilos del nuevo portal para reusar las clases de colores
import '../../styles/PortalCalificaciones.css';

// Función para cargar calificaciones desde localStorage
const loadGrades = () => {
  try {
    const data = localStorage.getItem('allGrades');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

function AsignarCalificaciones({ profesor, alumnos = [], grupos = [] }) {
  const [group, setGroup] = useState('');
  const [examType, setExamType] = useState('');
  const [examDate, setExamDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [studentsInGroup, setStudentsInGroup] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [grade, setGrade] = useState('');
  const [comments, setComments] = useState('');
  
  // MODIFICADO: Carga las calificaciones desde localStorage
  const [grades, setGrades] = useState(loadGrades);

  // MODIFICADO: Guarda en localStorage cada vez que las calificaciones cambian
  useEffect(() => {
    localStorage.setItem('allGrades', JSON.stringify(grades));
  }, [grades]);


  const groupOptions = React.useMemo(() => {
    return grupos.map(g => ({ id: g.id, name: g.nombre }));
  }, [grupos]);

  useEffect(() => {
    if (!group) {
      setStudentsInGroup([]);
      setSelectedStudent(null);
      return;
    }
    const g = grupos.find(x => x.nombre === group || x.id === group);
    if (g && Array.isArray(g.alumnoIds)) {
      const list = g.alumnoIds.map(id => alumnos.find(a => a.numero_control === id)).filter(Boolean);
      setStudentsInGroup(list);
    } else {
      setStudentsInGroup([]);
    }
    setSelectedStudent(null);
  }, [group, grupos, alumnos]);

  const handleSelectStudent = (s) => {
    setSelectedStudent(s);
  };

  // Funciones de estilo (copiadas del diseño de Canva)
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
      student_name: `${selectedStudent.nombre}`,
      group_name: grupos.find(g => g.nombre === group || g.id === group)?.nombre || 'N/A', // Nombre del grupo
      exam_type: examType,
      grade: parsed,
      date: examDate,
      comments: comments || '',
      // MODIFICADO: Guardamos quién puso la calificación
      teacher_id: profesor?.numero_empleado || 'N/A',
      teacher_name: profesor?.nombre || 'N/A'
    };
    
    setGrades(s => [newGrade, ...s]);
    
    setGrade('');
    setComments('');
    alert('Calificación guardada');
  };

  // MODIFICADO: Función para eliminar
  const handleDeleteGrade = (gradeId) => {
    if (window.confirm('¿Seguro que deseas eliminar esta calificación?')) {
      setGrades(gs => gs.filter(x => x.__id !== gradeId));
    }
  };

  return (
    <div className="portal-container"> {/* Usamos la clase base del nuevo CSS */}
      <div className="card-white p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Seleccionar Grupo y Evaluación</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="form-label">Grupo</label>
            <select value={group} onChange={e => setGroup(e.target.value)} className="form-select">
              <option value="">Seleccionar grupo...</option>
              {groupOptions.map(g => (
                <option key={g.id} value={g.name}>{g.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Tipo de Evaluación</label>
            <select value={examType} onChange={e => setExamType(e.target.value)} className="form-select">
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
            <label className="form-label">Fecha</label>
            <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)} className="form-select" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-white p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Lista de Estudiantes</h2>
          <div style={{ maxHeight: 420, overflowY: 'auto' }}>
            {studentsInGroup.length === 0 ? (
              <div className="text-center text-gray-500 py-8">Selecciona un grupo para ver los estudiantes</div>
            ) : (
              studentsInGroup.map(s => (
                <div 
                  key={s.numero_control} 
                  onClick={() => handleSelectStudent(s)} 
                  className={`student-list-item ${selectedStudent?.numero_control === s.numero_control ? 'active' : ''}`}
                >
                  <div>
                    <div className="font-semibold">{s.nombre}</div>
                    <div className="text-sm text-gray-600">ID: {s.numero_control}</div>
                  </div>
                  <div>{'>'}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card-white p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Asignar Calificación</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="form-label">Estudiante Seleccionado</label>
              <div className="form-select-disabled">
                {selectedStudent ? selectedStudent.nombre : 'Ningún estudiante seleccionado'}
              </div>
            </div>

            <div>
              <label className="form-label">Calificación (0-10)</label>
              <input type="number" value={grade} onChange={e => setGrade(e.target.value)} min="0" max="10" step="0.1" className="form-select" placeholder="Ingresa la calificación" />
            </div>

            <div>
              <label className="form-label">Comentarios (Opcional)</label>
              <textarea rows={3} value={comments} onChange={e => setComments(e.target.value)} className="form-select" placeholder="Comentarios..."></textarea>
            </div>

            <div>
              <button type="submit" className="button-primary w-full">
                Guardar Calificación
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card-white p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Calificaciones Registradas (Últimas 50)</h2>
        <div className="overflow-x-auto">
          <table className="table-fixed-layout">
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Grupo</th>
                <th>Evaluación</th>
                <th>Calificación</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {grades.length === 0 ? (
                <tr><td colSpan={6} className="text-center p-8 text-gray-500">No hay calificaciones registradas aún</td></tr>
              ) : (
                grades.slice(0, 50).map(g => (
                  <tr key={g.__id}>
                    <td>
                      <div className="font-semibold">{g.student_name}</div>
                      <div className="text-sm text-gray-600">ID: {g.student_id}</div>
                    </td>
                    <td>{g.group_name}</td>
                    <td>{g.exam_type}</td>
                    <td>
                      <span className={`grade-badge ${getGradeClass(g.grade)}`}>
                        {g.grade.toFixed(1)} — {getGradeLabel(g.grade)}
                      </span>
                    </td>
                    <td>{new Date(g.date).toLocaleDateString('es-ES')}</td>
                    <td>
                      <button onClick={() => handleDeleteGrade(g.__id)} className="button-delete">
                        Eliminar
                      </button>
                    </td>
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