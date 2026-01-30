/**
 * LÓGICA DE NEGOCIO VALIDADA - PROMOCIÓN DE ESTUDIANTES
 * 
 * REQUISITO: Los estudiantes no deben avanzar de nivel hasta que:
 * 1. Tengan los 3 parciales calificados
 * 2. Su calificación final sea >= 70
 * 3. Haya pasado la fecha_fin del período actual
 */

// FLUJO ACTUAL (INCOMPLETO):
// 1. Profesor registra parcial1, parcial2, parcial3
// 2. Sistema calcula final = promedio de los 3
// 3. Si final >= 70 → INMEDIATAMENTE avanza al siguiente nivel ❌ PROBLEMA
// 4. Si final < 70 → Mantiene el mismo nivel (recursa)
// 5. Historial de calificaciones se preserva ✓ CORRECTO

// FLUJO REQUERIDO (CON BLOQUEO POR FECHA):
// 1. Profesor registra parcial1, parcial2, parcial3
// 2. Sistema calcula final = promedio de los 3
// 3. Si final >= 70:
//    a) Cambiar EstudianteGrupo estado a 'concluido' ✓
//    b) VERIFICAR fecha_fin del Periodo
//    c) Si hoy < fecha_fin → BLOQUEAR avance (status: 'aprobado_bloqueado')
//    d) Si hoy >= fecha_fin → Permitir avance de nivel ✓
// 4. Si final < 70 → Mantiene el mismo nivel (recursa)
// 5. Historial preservado ✓

// CAMBIOS NECESARIOS EN calificacionesController.js:

// 1. En guardarCalificaciones(), después de calcular final:

/*
// ANTES (actual - sin validación de fecha):
if (parcial1 !== null && parcial2 !== null && parcial3 !== null && final >= 70) {
  await connection.query(
    'UPDATE EstudianteGrupo SET estado = ? WHERE nControl = ? AND id_Grupo = ?',
    ['concluido', nControl, id_Grupo]
  );
  // INMEDIATAMENTE avanza (PROBLEMA)
  const siguienteNivel = id_nivel + 1;
  ...
}

// DESPUÉS (con validación de fecha):
if (parcial1 !== null && parcial2 !== null && parcial3 !== null && final >= 70) {
  // Obtener fecha_fin del período
  const [periodo] = await connection.query(
    'SELECT fecha_fin FROM Periodo WHERE id_Periodo = ?',
    [id_Periodo]
  );

  const hoy = new Date();
  const fechaFin = new Date(periodo[0].fecha_fin);

  if (hoy < fechaFin) {
    // Período aún activo → BLOQUEAR avance temporal
    await connection.query(
      'UPDATE EstudianteGrupo SET estado = ? WHERE nControl = ? AND id_Grupo = ?',
      ['aprobado_bloqueado', nControl, id_Grupo]
    );
    // No actualizar id_Nivel, esperar a que venza el período
  } else {
    // Período terminado → PERMITIR avance
    await connection.query(
      'UPDATE EstudianteGrupo SET estado = ? WHERE nControl = ? AND id_Grupo = ?',
      ['concluido', nControl, id_Grupo]
    );
    // Actualizar nivel del estudiante
    const siguienteNivel = id_nivel + 1;
    const [existeSiguiente] = await connection.query(
      'SELECT id_Nivel FROM Nivel WHERE id_Nivel = ?',
      [siguienteNivel]
    );
    if (existeSiguiente.length > 0) {
      await connection.query(
        'UPDATE Estudiante SET id_Nivel = ? WHERE nControl = ?',
        [siguienteNivel, nControl]
      );
    }
  }
}
*/

// 2. Crear un nuevo endpoint para "desbloquear" estudiantes después de la fecha:

/*
exports.desbloquearEstudiantesPostPeriodo = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { id_Periodo } = req.params;

    // Obtener fecha_fin del período
    const [periodo] = await connection.query(
      'SELECT fecha_fin FROM Periodo WHERE id_Periodo = ?',
      [id_Periodo]
    );

    if (!periodo.length || new Date() < new Date(periodo[0].fecha_fin)) {
      return res.status(400).json({
        success: false,
        message: 'El período aún no ha terminado'
      });
    }

    await connection.beginTransaction();

    // Buscar estudiantes aprobados pero bloqueados
    const [estudiantesAprobados] = await connection.query(`
      SELECT DISTINCT c.nControl, c.final, c.id_nivel, eg.id_Grupo
      FROM Calificaciones c
      JOIN EstudianteGrupo eg ON c.nControl = eg.nControl AND c.id_Grupo = eg.id_Grupo
      WHERE c.id_Periodo = ? AND c.final >= 70 AND eg.estado = 'aprobado_bloqueado'
    `, [id_Periodo]);

    let actualizados = 0;

    for (const estudiante of estudiantesAprobados) {
      // Actualizar estado a concluido
      await connection.query(
        'UPDATE EstudianteGrupo SET estado = ? WHERE nControl = ? AND id_Grupo = ?',
        ['concluido', estudiante.nControl, estudiante.id_Grupo]
      );

      // Avanzar al siguiente nivel
      const siguienteNivel = estudiante.id_nivel + 1;
      const [existeSiguiente] = await connection.query(
        'SELECT id_Nivel FROM Nivel WHERE id_Nivel = ?',
        [siguienteNivel]
      );

      if (existeSiguiente.length > 0) {
        await connection.query(
          'UPDATE Estudiante SET id_Nivel = ? WHERE nControl = ?',
          [siguienteNivel, estudiante.nControl]
        );
        actualizados++;
      }
    }

    await connection.commit();

    res.json({
      success: true,
      message: `${actualizados} estudiantes desbloqueados y promovidos`,
      actualizados
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error al desbloquear estudiantes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al desbloquear estudiantes',
      error: error.message
    });
  } finally {
    connection.release();
  }
};
*/

module.exports = {
  logicaValidada: true,
  proximosPasos: [
    '1. Confirmar que tabla Periodo tiene fecha_inicio y fecha_fin',
    '2. Modificar guardarCalificaciones() para validar fecha_fin',
    '3. Crear endpoint para desbloquear post-período',
    '4. Agregar estado "aprobado_bloqueado" a tabla EstudianteGrupo'
  ]
};
