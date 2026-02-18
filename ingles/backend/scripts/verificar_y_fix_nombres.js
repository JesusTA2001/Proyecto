/**
 * Verificar estado actual de la BD y corregir TODOS los casos
 * donde dp.nombre contenga los apellidos (al inicio o en cualquier posición)
 */
const { pool } = require('../config/db');

async function verificarYFix() {
  try {
    console.log('=== ESTADO ACTUAL DE ADMINISTRADORES EN BD ===\n');

    // Ver todos los admins tal como están en BD
    const [todos] = await pool.query(`
      SELECT dp.id_dp, dp.apellidoPaterno, dp.apellidoMaterno, dp.nombre
      FROM DatosPersonales dp
      JOIN Empleado e ON dp.id_dp = e.id_dp
      JOIN Administrador a ON e.id_empleado = a.id_empleado
      ORDER BY dp.apellidoPaterno
    `);

    console.log('Registros actuales:');
    todos.forEach(r => {
      console.log(`  id_dp=${r.id_dp} | apellidoP="${r.apellidoPaterno}" | apellidoM="${r.apellidoMaterno}" | nombre="${r.nombre}"`);
    });

    console.log('\n=== DETECTANDO Y CORRIGIENDO DUPLICADOS ===\n');

    let corregidos = 0;
    for (const r of todos) {
      const nombre = (r.nombre || '').trim();
      const apellidoP = (r.apellidoPaterno || '').trim().toLowerCase();
      const apellidoM = (r.apellidoMaterno || '').trim().toLowerCase();
      const nombreLower = nombre.toLowerCase();

      // Si el nombre contiene cualquier apellido, está mal
      const contieneApellidoP = apellidoP && nombreLower.includes(apellidoP);
      const contieneApellidoM = apellidoM && nombreLower.includes(apellidoM);

      if (!contieneApellidoP && !contieneApellidoM) continue;

      // Estrategia: el nombre correcto es la(s) palabra(s) que NO son apellidos
      // Dividir en tokens y quedarse con los que no son ningún apellido
      const tokens = nombre.split(/\s+/);
      const tokensFiltrados = tokens.filter(token => {
        const t = token.toLowerCase();
        return t !== apellidoP && t !== apellidoM;
      });

      const nombreLimpio = tokensFiltrados.join(' ').trim();

      if (!nombreLimpio || nombreLimpio === nombre) {
        console.log(`  ⚠️  No se pudo limpiar id_dp=${r.id_dp} nombre="${nombre}"`);
        continue;
      }

      console.log(`  id_dp=${r.id_dp}: "${nombre}" → "${nombreLimpio}"`);
      await pool.query(`UPDATE DatosPersonales SET nombre = ? WHERE id_dp = ?`, [nombreLimpio, r.id_dp]);
      corregidos++;
    }

    if (corregidos === 0) {
      console.log('✅ No había duplicados adicionales que corregir.');
    } else {
      console.log(`\n✅ ${corregidos} registro(s) adicional(es) corregido(s).`);
    }

    console.log('\n=== ESTADO FINAL ===\n');
    const [final] = await pool.query(`
      SELECT dp.id_dp, dp.apellidoPaterno, dp.apellidoMaterno, dp.nombre,
             CONCAT(dp.apellidoPaterno, ' ', dp.apellidoMaterno, ' ', dp.nombre) AS nombreCompleto
      FROM DatosPersonales dp
      JOIN Empleado e ON dp.id_dp = e.id_dp
      JOIN Administrador a ON e.id_empleado = a.id_empleado
      ORDER BY dp.apellidoPaterno
    `);

    final.forEach(r => {
      console.log(`  "${r.nombreCompleto}"`);
    });

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

verificarYFix();
