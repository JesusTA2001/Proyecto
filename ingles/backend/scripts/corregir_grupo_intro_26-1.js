const { pool } = require('../config/db');

async function corregirGrupoCalificacion() {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        console.log('=== Corrigiendo grupo "intro 26-1" y calificaciones ===\n');

        // 1. Corregir el nivel del grupo 29 de Nivel1 a Intro
        await connection.query(`
            UPDATE Grupo 
            SET id_Nivel = 0
            WHERE id_Grupo = 29
        `);
        console.log('✅ Grupo 29 actualizado a id_Nivel = 0 (Intro)');

        // 2. Corregir el nivel de la calificación 76
        await connection.query(`
            UPDATE Calificaciones 
            SET id_nivel = 0
            WHERE id_Calificaciones = 76
        `);
        console.log('✅ Calificación 76 actualizada a id_nivel = 0 (Intro)');

        // 3. Actualizar el nivel del estudiante 1000 a Nivel1 (porque aprobó Intro)
        await connection.query(`
            UPDATE Estudiante 
            SET id_Nivel = 1
            WHERE nControl = 1000
        `);
        console.log('✅ Estudiante 1000 actualizado a id_Nivel = 1 (Nivel1)');

        await connection.commit();

        // Ver resultado final
        const [califs] = await connection.query(`
            SELECT c.id_Calificaciones, c.parcial1, c.parcial2, c.parcial3, c.final,
                   n.nivel as nivel_cursado,
                   p.descripcion as periodo,
                   g.grupo as grupo_nombre
            FROM Calificaciones c
            LEFT JOIN Nivel n ON c.id_nivel = n.id_Nivel
            LEFT JOIN Periodo p ON c.id_Periodo = p.id_Periodo
            LEFT JOIN Grupo g ON c.id_Grupo = g.id_Grupo
            WHERE c.nControl = 1000
            ORDER BY c.id_Periodo DESC
        `);
        
        console.log('\n=== RESULTADO FINAL ===');
        console.log('\nHistorial de calificaciones del estudiante 1000:');
        console.table(califs);

        const [estudiante] = await connection.query(`
            SELECT e.nControl, n.nivel as nivel_actual
            FROM Estudiante e
            LEFT JOIN Nivel n ON e.id_Nivel = n.id_Nivel
            WHERE e.nControl = 1000
        `);
        
        console.log('\nNivel actual del estudiante:');
        console.table(estudiante);

        console.log('\n✅ CORRECCIÓN COMPLETADA');
        console.log('📝 Ahora el historial muestra:');
        console.log('   - 2026-1: Intro (grupo "intro 26-1") - 100/100/100/100 (APROBADO)');
        console.log('   - 2025-1: Intro (grupo "Grupo 1") - 40/69/81/63 (REPROBADO)');
        console.log('   - Nivel actual: Nivel1 (avanzó tras aprobar Intro)');

        connection.release();
        process.exit(0);
    } catch (error) {
        await connection.rollback();
        console.error('Error:', error);
        connection.release();
        process.exit(1);
    }
}

corregirGrupoCalificacion();
