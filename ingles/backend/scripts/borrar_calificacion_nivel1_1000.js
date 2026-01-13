const { pool } = require('../config/db');

async function borrarCalificacionNivel1() {
    const connection = await pool.getConnection();
    
    try {
        console.log('=== Borrando calificación de Nivel1 del estudiante 1000 ===\n');

        // Ver calificaciones actuales
        const [califs] = await connection.query(`
            SELECT c.*, n.nivel as nivel_nombre 
            FROM Calificaciones c
            LEFT JOIN Nivel n ON c.id_nivel = n.id_Nivel
            WHERE c.nControl = 1000
            ORDER BY c.id_Calificaciones
        `);
        
        console.log('Calificaciones actuales:');
        console.table(califs);

        // Primero borrar de EstudianteCalificaciones (tabla intermedia)
        const [result1] = await connection.query(
            'DELETE FROM EstudianteCalificaciones WHERE id_Calificaciones = 75 AND nControl = 1000'
        );
        console.log(`\n✅ Se eliminaron ${result1.affectedRows} registros de EstudianteCalificaciones`);

        // Luego borrar la calificación de Nivel1 (id_Calificaciones = 75)
        const [result2] = await connection.query(
            'DELETE FROM Calificaciones WHERE id_Calificaciones = 75 AND nControl = 1000'
        );

        console.log(`✅ Se borró ${result2.affectedRows} calificación de Nivel1`);

        // Ver resultado final
        const [califsFinal] = await connection.query(`
            SELECT c.*, n.nivel as nivel_nombre 
            FROM Calificaciones c
            LEFT JOIN Nivel n ON c.id_nivel = n.id_Nivel
            WHERE c.nControl = 1000
            ORDER BY c.id_Calificaciones
        `);
        
        console.log('\n=== CALIFICACIONES FINALES ===');
        console.table(califsFinal);

        console.log('\n✅ El estudiante 1000 ahora solo tiene la calificación de Intro (reprobado con final=63)');
        
        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        connection.release();
        process.exit(1);
    }
}

borrarCalificacionNivel1();
