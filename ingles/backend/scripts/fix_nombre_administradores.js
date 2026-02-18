/**
 * Script para limpiar el campo DatosPersonales.nombre de administradores.
 * 
 * PROBLEMA: Algunos registros tienen en dp.nombre el nombre completo
 * ej: "jesus torres alvarez" cuando debería ser solo "jesus".
 * Eso causa que el frontend muestre "torres alvarez jesus torres alvarez"
 * al concatenar apellidoPaterno + apellidoMaterno + nombre.
 * 
 * SOLUCIÓN: Si dp.nombre contiene dp.apellidoPaterno, extraemos solo
 * la parte que está ANTES del apellidoPaterno.
 */

const { pool } = require('../config/db');

async function fixNombreAdministradores() {
  try {
    console.log('=== FIX: Nombres de Administradores ===\n');

    // 1. Ver registros afectados
    const [afectados] = await pool.query(`
      SELECT dp.id_dp, dp.nombre, dp.apellidoPaterno, dp.apellidoMaterno
      FROM DatosPersonales dp
      JOIN Empleado e ON dp.id_dp = e.id_dp
      JOIN Administrador a ON e.id_empleado = a.id_empleado
      WHERE dp.nombre LIKE CONCAT('% ', dp.apellidoPaterno, '%')
         OR dp.nombre LIKE CONCAT('% ', dp.apellidoMaterno, '%')
    `);

    if (afectados.length === 0) {
      console.log('✅ No se encontraron registros con apellidos duplicados en el campo nombre.');
      console.log('La BD ya está limpia.');
      await pool.end();
      return;
    }

    console.log(`⚠️  Se encontraron ${afectados.length} registros con apellidos dentro del campo nombre:\n`);
    afectados.forEach(r => {
      console.log(`  id_dp=${r.id_dp} | nombre="${r.nombre}" | apellidoPaterno="${r.apellidoPaterno}" | apellidoMaterno="${r.apellidoMaterno}"`);
    });

    // 2. Corregir: extraer solo lo que está ANTES del apellidoPaterno en el campo nombre
    let corregidos = 0;
    for (const r of afectados) {
      const nombreOriginal = r.nombre || '';
      const apellidoP = r.apellidoPaterno || '';
      const apellidoM = r.apellidoMaterno || '';

      // Buscar dónde empieza el apellidoPaterno dentro del nombre (case-insensitive)
      const idx = nombreOriginal.toLowerCase().indexOf(apellidoP.toLowerCase());

      let nombreLimpio;
      if (idx > 0) {
        // Tomar solo la parte antes del apellidoPaterno
        nombreLimpio = nombreOriginal.substring(0, idx).trim();
      } else if (idx === 0) {
        // El nombre empieza con el apellidoPaterno, buscar después del apellidoMaterno
        const idxM = nombreOriginal.toLowerCase().indexOf(apellidoM.toLowerCase());
        if (idxM > 0) {
          nombreLimpio = nombreOriginal.substring(idxM + apellidoM.length).trim();
        } else {
          console.log(`  ⚠️  No se pudo determinar el nombre para id_dp=${r.id_dp}, se omite.`);
          continue;
        }
      } else {
        // apellidoMaterno aparece pero no el paterno
        const idxM = nombreOriginal.toLowerCase().indexOf(apellidoM.toLowerCase());
        if (idxM > 0) {
          nombreLimpio = nombreOriginal.substring(0, idxM).trim();
        } else {
          console.log(`  ⚠️  Patrón no reconocido para id_dp=${r.id_dp}, se omite.`);
          continue;
        }
      }

      if (!nombreLimpio || nombreLimpio === nombreOriginal) {
        console.log(`  ⚠️  Sin cambios necesarios para id_dp=${r.id_dp}.`);
        continue;
      }

      console.log(`\n  id_dp=${r.id_dp}:`);
      console.log(`    Antes : "${nombreOriginal}"`);
      console.log(`    Después: "${nombreLimpio}"`);

      await pool.query(
        `UPDATE DatosPersonales SET nombre = ? WHERE id_dp = ?`,
        [nombreLimpio, r.id_dp]
      );
      corregidos++;
    }

    console.log(`\n✅ ${corregidos} registro(s) corregido(s) exitosamente.`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

fixNombreAdministradores();
