require('dotenv').config();
const { pool } = require('../config/db');

function limpiarTexto(txt = '') {
  return String(txt)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z\s]/g, '')
    .toUpperCase()
    .trim();
}

function primeraVocalInterna(s = '') {
  const t = limpiarTexto(s);
  for (let i = 1; i < t.length; i += 1) {
    if ('AEIOU'.includes(t[i])) return t[i];
  }
  return 'X';
}

function primeraConsonanteInterna(s = '') {
  const t = limpiarTexto(s);
  for (let i = 1; i < t.length; i += 1) {
    if ('BCDFGHJKLMNPQRSTVWXYZ'.includes(t[i])) return t[i];
  }
  return 'X';
}

function inicialNombre(nombre = '') {
  const tokens = limpiarTexto(nombre)
    .split(/\s+/)
    .filter(Boolean);

  const ignorar = new Set(['JOSE', 'MARIA', 'MA', 'J', 'M']);
  const elegido = tokens.find((t) => !ignorar.has(t)) || tokens[0] || 'X';
  return elegido[0] || 'X';
}

function fechaYYMMDD(seed) {
  const y = 80 + (seed % 20); // 1980-1999
  const m = 1 + ((seed * 7) % 12);
  const d = 1 + ((seed * 11) % 28);
  const yy = String(y).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  const dd = String(d).padStart(2, '0');
  return `${yy}${mm}${dd}`;
}

function sexoCURP(genero = '', seed = 0) {
  const g = limpiarTexto(genero);
  if (g.startsWith('F')) return 'M'; // CURP usa M para mujer
  if (g.startsWith('M')) return 'H';
  return seed % 2 === 0 ? 'H' : 'M';
}

function alnumFromSeed(seed, len) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let out = '';
  let n = Math.abs(seed) + 17;
  for (let i = 0; i < len; i += 1) {
    n = (n * 37 + 23) % 1000003;
    out += chars[n % chars.length];
  }
  return out;
}

function construirCURP({ nombre, apellidoPaterno, apellidoMaterno, genero, seed }) {
  const ap = limpiarTexto(apellidoPaterno);
  const am = limpiarTexto(apellidoMaterno);

  const p1 = (ap[0] || 'X') + primeraVocalInterna(ap) + (am[0] || 'X') + inicialNombre(nombre);
  const p2 = fechaYYMMDD(seed);
  const p3 = sexoCURP(genero, seed);
  const p4 = 'MC'; // Michoacan
  const p5 = primeraConsonanteInterna(ap) + primeraConsonanteInterna(am) + primeraConsonanteInterna(nombre);
  const p6 = alnumFromSeed(seed, 2);
  const p7 = String((seed * 3) % 10);

  return `${p1}${p2}${p3}${p4}${p5}${p6}${p7}`.slice(0, 18);
}

function construirRFC(curp, seed) {
  const suf = alnumFromSeed(seed + 91, 3);
  return `${curp.slice(0, 10)}${suf}`.slice(0, 13);
}

function construirTelefono(seed) {
  const base = 1000000 + ((seed * 97) % 9000000);
  return `351${String(base).padStart(7, '0')}`.slice(0, 10);
}

function construirDireccion(indice) {
  const numero = (indice % 12) + 1;
  return `Privada San Miguel ${numero}, Col. Centro, Zamora, Mich.`;
}

async function normalizar() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(`
      SELECT
        'DIRECTIVO' AS tipoRol,
        d.id_Directivo AS id_rol,
        e.id_empleado,
        e.RFC,
        dp.id_dp,
        dp.apellidoPaterno,
        dp.apellidoMaterno,
        dp.nombre,
        dp.genero,
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
        dp.apellidoPaterno,
        dp.apellidoMaterno,
        dp.nombre,
        dp.genero,
        dp.CURP,
        dp.telefono,
        dp.direccion
      FROM Coordinador c
      JOIN Empleado e ON c.id_empleado = e.id_empleado
      JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
      ORDER BY tipoRol, id_rol
    `);

    let actualizados = 0;

    for (let i = 0; i < rows.length; i += 1) {
      const r = rows[i];
      const seed = Number(r.id_empleado) + Number(r.id_rol) * 13;
      const curp = construirCURP({
        nombre: r.nombre,
        apellidoPaterno: r.apellidoPaterno,
        apellidoMaterno: r.apellidoMaterno,
        genero: r.genero,
        seed
      });
      const rfc = construirRFC(curp, seed);
      const telefono = construirTelefono(seed);
      const direccion = construirDireccion(i);

      await connection.query(
        `UPDATE DatosPersonales
         SET CURP = ?, telefono = ?, direccion = ?
         WHERE id_dp = ?`,
        [curp, telefono, direccion, r.id_dp]
      );

      await connection.query(
        `UPDATE Empleado
         SET RFC = ?
         WHERE id_empleado = ?`,
        [rfc, r.id_empleado]
      );

      actualizados += 1;
    }

    await connection.commit();

    console.log(`Registros revisados: ${rows.length}`);
    console.log(`Registros actualizados: ${actualizados}`);
    console.log('Normalizacion completada con telefono 351, CURP y domicilio legible.');
  } catch (error) {
    await connection.rollback();
    console.error('Error al normalizar datos:', error.message);
    process.exitCode = 1;
  } finally {
    connection.release();
    await pool.end();
  }
}

normalizar();
