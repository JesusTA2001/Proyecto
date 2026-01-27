const { pool } = require('../config/db');

// Obtener calificaciones de un estudiante
exports.getCalificacionesEstudiante = async (req, res) => {
  try {
    const { nControl } = req.params;

    const [calificaciones] = await pool.query(`
      SELECT 
        c.id_Calificaciones,
        c.nControl,
        c.parcial1,
        c.parcial2,
        c.parcial3,
        c.final,
        c.id_nivel,
        c.id_Periodo,
        c.id_Grupo,
        n.nivel as nivel_nombre,
        p.descripcion as periodo_nombre,
        g.grupo as grupo_nombre,
        CONCAT(dp.apellidoPaterno, ' ', dp.apellidoMaterno, ' ', dp.nombre) as profesor_nombre
      FROM Calificaciones c
      LEFT JOIN Nivel n ON c.id_nivel = n.id_Nivel
      LEFT JOIN Periodo p ON c.id_Periodo = p.id_Periodo
      LEFT JOIN Grupo g ON c.id_Grupo = g.id_Grupo
      LEFT JOIN Profesor prof ON g.id_Profesor = prof.id_Profesor
      LEFT JOIN Empleado emp ON prof.id_empleado = emp.id_empleado
      LEFT JOIN DatosPersonales dp ON emp.id_dp = dp.id_dp
      WHERE c.nControl = ?
      ORDER BY c.id_Periodo DESC, c.id_Grupo
    `, [nControl]);

    res.json({ success: true, calificaciones });
  } catch (error) {
    console.error('Error al obtener calificaciones del estudiante:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener calificaciones', 
      error: error.message 
    });
  }
};

// Obtener calificaciones de un grupo
exports.getCalificacionesGrupo = async (req, res) => {
  try {
    const { id_Grupo } = req.params;

    const [calificaciones] = await pool.query(`
      SELECT 
        c.id_Calificaciones,
        c.nControl,
        c.parcial1,
        c.parcial2,
        c.parcial3,
        c.final,
        c.id_nivel,
        c.id_Periodo,
        c.id_Grupo,
        CONCAT(dp.apellidoPaterno, ' ', dp.apellidoMaterno, ' ', dp.nombre) as estudiante_nombre,
        n.nivel as nivel_nombre,
        p.descripcion as periodo_nombre
      FROM Calificaciones c
      JOIN Estudiante e ON c.nControl = e.nControl
      JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
      LEFT JOIN Nivel n ON c.id_nivel = n.id_Nivel
      LEFT JOIN Periodo p ON c.id_Periodo = p.id_Periodo
      WHERE c.id_Grupo = ?
      ORDER BY dp.apellidoPaterno, dp.apellidoMaterno, dp.nombre
    `, [id_Grupo]);

    res.json({ success: true, calificaciones });
  } catch (error) {
    console.error('Error al obtener calificaciones del grupo:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener calificaciones', 
      error: error.message 
    });
  }
};

// Guardar/Actualizar calificaciones (individual o masivo)
exports.guardarCalificaciones = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { calificaciones } = req.body;
    // calificaciones es un array: [{ nControl, parcial1, parcial2, parcial3, id_nivel, id_Periodo, id_Grupo }, ...]

    if (!Array.isArray(calificaciones) || calificaciones.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Se requiere un array de calificaciones' 
      });
    }

    await connection.beginTransaction();

    const resultados = [];

    for (const cal of calificaciones) {
      const { nControl, parcial1, parcial2, parcial3, id_nivel, id_Periodo, id_Grupo } = cal;

      // Validar campos requeridos
      if (!nControl || !id_Grupo) {
        await connection.rollback();
        return res.status(400).json({ 
          success: false, 
          message: 'Faltan campos requeridos: nControl, id_Grupo' 
        });
      }

      // Calcular final (promedio de parciales)
      const parciales = [parcial1, parcial2, parcial3].filter(p => p !== null && p !== undefined);
      const final = parciales.length > 0 
        ? Math.round(parciales.reduce((a, b) => a + b, 0) / parciales.length) 
        : null;

      // Verificar si ya existe un registro
      const [existe] = await connection.query(
        'SELECT id_Calificaciones FROM Calificaciones WHERE nControl = ? AND id_Grupo = ? AND id_Periodo = ?',
        [nControl, id_Grupo, id_Periodo || null]
      );

      if (existe.length > 0) {
        // Actualizar
        const [result] = await connection.query(
          `UPDATE Calificaciones 
           SET parcial1 = ?, parcial2 = ?, parcial3 = ?, final = ?, id_nivel = ?
           WHERE id_Calificaciones = ?`,
          [parcial1, parcial2, parcial3, final, id_nivel, existe[0].id_Calificaciones]
        );
        
        resultados.push({ 
          nControl, 
          accion: 'actualizado', 
          id_Calificaciones: existe[0].id_Calificaciones 
        });
      } else {
        // Insertar
        const [result] = await connection.query(
          `INSERT INTO Calificaciones (nControl, parcial1, parcial2, parcial3, final, id_nivel, id_Periodo, id_Grupo) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [nControl, parcial1, parcial2, parcial3, final, id_nivel, id_Periodo, id_Grupo]
        );

        // Insertar en tabla intermedia
        await connection.query(
          'INSERT INTO EstudianteCalificaciones (nControl, id_Calificaciones) VALUES (?, ?)',
          [nControl, result.insertId]
        );

        resultados.push({ 
          nControl, 
          accion: 'creado', 
          id_Calificaciones: result.insertId 
        });
      }

      // Si tiene las 3 calificaciones y calificación final >= 70, validar fecha antes de avanzar
      if (parcial1 !== null && parcial2 !== null && parcial3 !== null && final >= 70) {
        // Obtener fecha_fin del período
        const [periodoData] = await connection.query(
          'SELECT fecha_fin FROM Periodo WHERE id_Periodo = ?',
          [id_Periodo]
        );

        if (periodoData.length > 0 && periodoData[0].fecha_fin) {
          const hoy = new Date();
          hoy.setHours(0, 0, 0, 0); // Normalizar a inicio del día
          const fechaFin = new Date(periodoData[0].fecha_fin);
          fechaFin.setHours(0, 0, 0, 0); // Normalizar a inicio del día

          if (hoy < fechaFin) {
            // Período aún activo → BLOQUEAR avance temporal
            console.log(`ℹ️ ${nControl}: Aprobado pero período activo. Bloqueando hasta ${periodoData[0].fecha_fin}`);
            await connection.query(
              'UPDATE EstudianteGrupo SET estado = ? WHERE nControl = ? AND id_Grupo = ?',
              ['aprobado_bloqueado', nControl, id_Grupo]
            );
            // No actualizar id_Nivel, esperar a que venza el período
          } else {
            // Período terminado → PERMITIR avance
            console.log(`✅ ${nControl}: Período finalizado. Promoviendo al siguiente nivel`);
            await connection.query(
              'UPDATE EstudianteGrupo SET estado = ? WHERE nControl = ? AND id_Grupo = ?',
              ['concluido', nControl, id_Grupo]
            );

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
        } else {
          // Si no hay fecha_fin, permitir avance (retrocompatibilidad)
          console.log(`⚠️ ${nControl}: Sin fecha_fin en período. Permitiendo avance`);
          await connection.query(
            'UPDATE EstudianteGrupo SET estado = ? WHERE nControl = ? AND id_Grupo = ?',
            ['concluido', nControl, id_Grupo]
          );

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
      } else if (parcial1 !== null && parcial2 !== null && parcial3 !== null && final < 70) {
        // Reprobó: cambiar estado a 'concluido' (reprobado)
        console.log(`❌ ${nControl}: Reprobado (final: ${final}). Debe recursar el nivel`);
        await connection.query(
          'UPDATE EstudianteGrupo SET estado = ? WHERE nControl = ? AND id_Grupo = ?',
          ['concluido', nControl, id_Grupo]
        );
        // NO se actualiza el id_Nivel, debe recursar el mismo nivel
      }
    }

    await connection.commit();

    res.json({ 
      success: true, 
      message: 'Calificaciones guardadas exitosamente',
      resultados
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error al guardar calificaciones:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al guardar calificaciones', 
      error: error.message 
    });
  } finally {
    connection.release();
  }
};

// Guardar calificación individual (para guardado automático al editar)
exports.guardarCalificacionIndividual = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { nControl, parcial, valor, id_nivel, id_Periodo, id_Grupo } = req.body;
    // parcial puede ser: 'parcial1', 'parcial2', 'parcial3'

    console.log('📝 [API] Guardando calificación individual:', {
      nControl,
      parcial,
      valor,
      id_Grupo,
      id_Periodo
    });

    if (!nControl || !parcial || !id_Grupo) {
      console.log('❌ [API] Faltan campos requeridos');
      return res.status(400).json({ 
        success: false, 
        message: 'Faltan campos requeridos: nControl, parcial, id_Grupo' 
      });
    }

    if (!['parcial1', 'parcial2', 'parcial3'].includes(parcial)) {
      console.log('❌ [API] Parcial inválido:', parcial);
      return res.status(400).json({ 
        success: false, 
        message: 'Parcial inválido. Debe ser: parcial1, parcial2 o parcial3' 
      });
    }

    await connection.beginTransaction();

    // Verificar si ya existe un registro
    const [existe] = await connection.query(
      'SELECT id_Calificaciones, parcial1, parcial2, parcial3 FROM Calificaciones WHERE nControl = ? AND id_Grupo = ? AND id_Periodo = ?',
      [nControl, id_Grupo, id_Periodo || null]
    );

    let id_Calificaciones;

    if (existe.length > 0) {
      // Actualizar solo el parcial específico
      const calActual = existe[0];
      const p1 = parcial === 'parcial1' ? valor : calActual.parcial1;
      const p2 = parcial === 'parcial2' ? valor : calActual.parcial2;
      const p3 = parcial === 'parcial3' ? valor : calActual.parcial3;

      console.log(`📊 [API] Actualizando registro existente ${calActual.id_Calificaciones}`);
      console.log(`   Antes: P1=${calActual.parcial1}, P2=${calActual.parcial2}, P3=${calActual.parcial3}`);
      console.log(`   Después: P1=${p1}, P2=${p2}, P3=${p3}`);

      // Recalcular final
      const parciales = [p1, p2, p3].filter(p => p !== null && p !== undefined);
      const final = parciales.length > 0 
        ? Math.round(parciales.reduce((a, b) => a + b, 0) / parciales.length) 
        : null;

      console.log(`   Final calculado: ${final}`);

      // Actualizar solo el parcial y final (no modificar id_nivel si no viene)
      if (id_nivel !== undefined && id_nivel !== null) {
        await connection.query(
          `UPDATE Calificaciones 
           SET ${parcial} = ?, final = ?, id_nivel = ?
           WHERE id_Calificaciones = ?`,
          [valor, final, id_nivel, calActual.id_Calificaciones]
        );
      } else {
        await connection.query(
          `UPDATE Calificaciones 
           SET ${parcial} = ?, final = ?
           WHERE id_Calificaciones = ?`,
          [valor, final, calActual.id_Calificaciones]
        );
      }

      console.log(`✅ [API] Actualización ejecutada correctamente`);

      id_Calificaciones = calActual.id_Calificaciones;

      // Si tiene las 3 calificaciones, aplicar lógica de aprobación/reprobación con validación de fecha
      if (p1 !== null && p2 !== null && p3 !== null && final !== null) {
        if (final >= 70) {
          // Aprobó: validar fecha_fin antes de avanzar de nivel
          const [periodoData] = await connection.query(
            'SELECT fecha_fin FROM Periodo WHERE id_Periodo = ?',
            [id_Periodo]
          );

          if (periodoData.length > 0 && periodoData[0].fecha_fin) {
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            const fechaFin = new Date(periodoData[0].fecha_fin);
            fechaFin.setHours(0, 0, 0, 0);

            if (hoy < fechaFin) {
              // Período aún activo → Mantener estado 'actual' (no avanzar de nivel todavía)
              console.log(`ℹ️ ${nControl}: Aprobado pero período activo. Manteniendo 'actual' hasta ${periodoData[0].fecha_fin}`);
              // No se cambia el estado, se mantiene como 'actual'
              // No se avanza de nivel hasta que termine el período
            } else {
              // Período terminado → PERMITIR avance
              console.log(`✅ ${nControl}: Período finalizado. Promoviendo al siguiente nivel`);
              await connection.query(
                'UPDATE EstudianteGrupo SET estado = ? WHERE nControl = ? AND id_Grupo = ?',
                ['concluido', nControl, id_Grupo]
              );

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
          } else {
            // Sin fecha_fin, permitir avance
            console.log(`⚠️ ${nControl}: Sin fecha_fin. Permitiendo avance`);
            await connection.query(
              'UPDATE EstudianteGrupo SET estado = ? WHERE nControl = ? AND id_Grupo = ?',
              ['concluido', nControl, id_Grupo]
            );

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
        } else {
          // Reprobó: cambiar estado a 'concluido' (mantiene historial)
          console.log(`❌ ${nControl}: Reprobado (final: ${final}). Debe recursar el nivel`);
          await connection.query(
            'UPDATE EstudianteGrupo SET estado = ? WHERE nControl = ? AND id_Grupo = ?',
            ['concluido', nControl, id_Grupo]
          );
          // NO se actualiza el id_Nivel, debe recursar el mismo nivel
        }
      }
    } else {
      // Crear nuevo registro
      const final = valor !== null && valor !== undefined ? valor : null;

      const [result] = await connection.query(
        `INSERT INTO Calificaciones (nControl, ${parcial}, final, id_nivel, id_Periodo, id_Grupo) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [nControl, valor, final, id_nivel, id_Periodo, id_Grupo]
      );

      id_Calificaciones = result.insertId;

      // Insertar en tabla intermedia
      await connection.query(
        'INSERT INTO EstudianteCalificaciones (nControl, id_Calificaciones) VALUES (?, ?)',
        [nControl, id_Calificaciones]
      );
    }

    await connection.commit();

    res.json({ 
      success: true, 
      message: `${parcial} guardado exitosamente`,
      id_Calificaciones
    });
  } catch (error) {
    await connection.rollback();
    console.error('❌ [API] Error al guardar calificación individual:', error);
    console.error('❌ [API] Stack trace:', error.stack);
    console.error('❌ [API] SQL Error Code:', error.code);
    console.error('❌ [API] SQL State:', error.sqlState);
    res.status(500).json({ 
      success: false, 
      message: 'Error al guardar calificación', 
      error: error.message,
      sqlCode: error.code,
      sqlState: error.sqlState
    });
  } finally {
    connection.release();
  }
};

// Eliminar calificación
exports.eliminarCalificacion = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { id } = req.params;

    await connection.beginTransaction();

    // Eliminar de tabla intermedia primero
    await connection.query(
      'DELETE FROM EstudianteCalificaciones WHERE id_Calificaciones = ?',
      [id]
    );

    // Eliminar calificación
    await connection.query(
      'DELETE FROM Calificaciones WHERE id_Calificaciones = ?',
      [id]
    );

    await connection.commit();

    res.json({ 
      success: true, 
      message: 'Calificación eliminada exitosamente' 
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error al eliminar calificación:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar calificación', 
      error: error.message 
    });
  } finally {
    connection.release();
  }
};
