require('dotenv').config();
const { pool } = require('../config/db');

function curpGenerica(prefijo, idRol) {
  const body = String(idRol).padStart(16, '0');
  return `${prefijo}${body}`.slice(0, 18).toUpperCase();
}

function rfcGenerico(prefijo, idRol) {
  const body = String(idRol).padStart(10, '0');
  return `${prefijo}${body}`.slice(0, 13).toUpperCase();
}

function telefonoGenerico(idEmpleado) {
  const body = String(idEmpleado).padStart(8, '0');
  return `55${body}`.slice(0, 10);
}

async function completarLote() {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [registros] = await connection.query(`
      SELECT
        'DIRECTIVO' AS tipoRol,
        d.id_Directivo AS id_rol,
        e.id_empleado,
        e.RFC,
        dp.id_dp,
        dp.CURP,
        dp.telefono,
        dp.direccion
      FROM Directivo d
      JOIN Empleado e ON d.id_empleado = e.id_empleado
      JOIN DatosPersonales dp ON e.id_dp = dp.id_dp

      UNION ALL

      SELECT
        'COORDINADOR' AS tipoRol,
        c.id_Coordinador AS id_rol,
        e.id_empleado,
        e.RFC,
        dp.id_dp,
        dp.CURP,
        dp.telefono,
        dp.direccion
      FROM Coordinador c
      JOIN Empleado e ON c.id_empleado = e.id_empleado
      JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
      ORDER BY tipoRol, id_rol
    `);

    let actualizados = 0;

    for (const r of registros) {
      const prefCurp = r.tipoRol === 'DIRECTIVO' ? 'DI' : 'CO';
      const prefRfc = r.tipoRol === 'DIRECTIVO' ? 'DIR' : 'COR';

      const nuevaCURP = r.CURP && String(r.CURP).trim() ? r.CURP : curpGenerica(prefCurp, r.id_rol);
      const nuevoTelefono = r.telefono && String(r.telefono).trim() ? r.telefono : telefonoGenerico(r.id_empleado);
      const nuevaDireccion = r.direccion && String(r.direccion).trim() ? r.direccion : 'SIN DIRECCION CAPTURADA';
      const nuevoRFC = r.RFC && String(r.RFC).trim() ? r.RFC : rfcGenerico(prefRfc, r.id_rol);

      const cambioDP =
        nuevaCURP !== (r.CURP || '') ||
        nuevoTelefono !== (r.telefono || '') ||
        nuevaDireccion !== (r.direccion || '');

      const cambioEmp = nuevoRFC !== (r.RFC || '');

      if (cambioDP) {
        await connection.query(
          `UPDATE DatosPersonales
           SET CURP = ?, telefono = ?, direccion = ?
           WHERE id_dp = ?`,
          [nuevaCURP, nuevoTelefono, nuevaDireccion, r.id_dp]
        );
      }

      if (cambioEmp) {
        await connection.query(
          `UPDATE Empleado
           SET RFC = ?
           WHERE id_empleado = ?`,
          [nuevoRFC, r.id_empleado]
        );
      }

      if (cambioDP || cambioEmp) {
        actualizados += 1;
      }
    }

    await connection.commit();

    console.log(`Registros revisados: ${registros.length}`);
    console.log(`Registros actualizados: ${actualizados}`);
    console.log('Lote completado. No se modifico la tabla Usuarios.');
  } catch (error) {
    await connection.rollback();
    console.error('Error al completar lote:', error.message);
    process.exitCode = 1;
  } finally {
    connection.release();
    await pool.end();
  }
}

completarLote();
