// src/data/grupos.js
// Lista inicial de grupos. Puedes dejarla vacía o añadir grupos de ejemplo.
// Los alumnoIds deben coincidir con los numero_control de tu archivo alumnos.js
// Los profesorId deben coincidir con los numero_empleado de tu archivo profesores.js

// src/data/grupos.js
export const initialGrupos = [
  // --- 5 Grupos de Ejemplo Tecnológico ---
  {
    id: 'GRP-TEC-N1-MAT-A',
    nombre: 'Tec - Nivel 1 - Matutino A',
    nivel: 'Nivel 1',
    modalidad: 'Matutino',
    ubicacion: 'Tecnologico',
    profesorId: 'EMP001', // Juan Carlos Pérez
    // --- NUEVOS CAMPOS DE HORARIO ---
    dia: 'Lunes-Miercoles', // O 'Lunes', 'Martes', etc.
    horaInicio: '09:00',
    horaFin: '11:00',
    // ---------------------------------
    alumnoIds: ['T0901', 'T0902', 'T0903', 'T0904', 'T0905', 'T0906']
  },
  {
    id: 'GRP-TEC-N2-VES-A',
    nombre: 'Tec - Nivel 2 - Vespertino A',
    nivel: 'Nivel 2',
    modalidad: 'Vespertino',
    ubicacion: 'Tecnologico',
    profesorId: 'EMP017', // Luis Fernando Castañeda
    // --- NUEVOS CAMPOS DE HORARIO ---
    dia: 'Martes-Jueves',
    horaInicio: '16:00',
    horaFin: '18:00',
    // ---------------------------------
    alumnoIds: ['T0002', 'T0003', 'T0004', 'T0005', 'T0006', 'T0007']
  },
  {
    id: 'GRP-TEC-N3-SAB-A',
    nombre: 'Tec - Nivel 3 - Sabatino A',
    nivel: 'Nivel 3',
    modalidad: 'Sabatino',
    ubicacion: 'Tecnologico',
    profesorId: 'EMP001', // Juan Carlos Pérez (Mismo prof, diferente horario)
    // --- NUEVOS CAMPOS DE HORARIO ---
    dia: 'Sabado',
    horaInicio: '08:00',
    horaFin: '13:00',
    // ---------------------------------
    alumnoIds: ['T0001', 'T0011', 'T0111', 'T0221', 'T0331']
  },
  // ... (Añade campos de horario a tus otros 7 grupos)
  {
    id: 'GRP-NODO-D1-PRE-A',
    nombre: 'NODO - Diplomado 1 - Presencial A',
    nivel: 'Diplomado 1',
    modalidad: 'Presencial',
    ubicacion: 'Centro de Idiomas',
    profesorId: 'EMP002',
    // --- NUEVOS CAMPOS DE HORARIO ---
    dia: 'Viernes',
    horaInicio: '16:00',
    horaFin: '20:00',
    // ---------------------------------
    alumnoIds: ['C0001', 'C0011', 'C0022', 'C0031', 'C0025']
  },
];
