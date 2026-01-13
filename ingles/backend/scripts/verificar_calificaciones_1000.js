const { pool } = require('../config/db');

async function verificarCalificaciones() {
    const connection = await pool.getConnection();
    
    try {
        console.log('=== Verificando calificaciones del estudiante 1000 ===\n');

        // Ver calificaciones con el id_nivel guardado
        const [califs] = await connection.query(`
            SELECT c.id_Calificaciones, c.nControl, c.parcial1, c.parcial2, c.parcial3, c.final,
                   c.id_nivel, n.nivel as nivel_nombre,
                   c.id_Periodo, p.descripcion as periodo_nombre,
                   c.id_Grupo, g.grupo as grupo_nombre, g.id_Nivel as grupo_id_nivel, ng.nivel as grupo_nivel_nombre
            FROM Calificaciones c
            LEFT JOIN Nivel n ON c.id_nivel = n.id_Nivel
            LEFT JOIN Periodo p ON c.id_Periodo = p.id_Periodo
            LEFT JOIN Grupo g ON c.id_Grupo = g.id_Grupo
            LEFT JOIN Nivel ng ON g.id_Nivel = ng.id_Nivel
            WHERE c.nControl = 1000
            ORDER BY c.id_Periodo DESC, c.id_Calificaciones
        `);
        
        console.log('Calificaciones en base de datos:');
        console.table(califs);

        // Ver nivel actual del estudiante
        const [estudiante] = await connection.query(`
            SELECT e.nControl, e.id_Nivel, n.nivel as nivel_nombre
            FROM Estudiante e
            LEFT JOIN Nivel n ON e.id_Nivel = n.id_Nivel
            WHERE e.nControl = 1000
        `);
        
        console.log('\nNivel actual del estudiante:');
        console.table(estudiante);

        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        connection.release();
        process.exit(1);
    }
}

verificarCalificaciones();
