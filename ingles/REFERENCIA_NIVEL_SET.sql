-- =======================================================
-- REFERENCIA: Estructura final de tabla Nivel con SET
-- =======================================================

-- Estructura de la tabla
CREATE TABLE Nivel (
    id_Nivel INT PRIMARY KEY,
    nivel VARCHAR(50),
    campus SET('Tecnologico','Centro de Idiomas')
);

-- =======================================================
-- DATOS ACTUALES EN LA BASE DE DATOS
-- =======================================================

-- Niveles compartidos (Ambos campus)
-- IDs 0-6: Intro, Nivel1-6
-- campus = 'Tecnologico,Centro de Idiomas'

-- Niveles exclusivos Centro de Idiomas
-- IDs 7-18: Kids 1-4, Teens 1-4, Conversación 1-2, Diplomado 1-2
-- campus = 'Centro de Idiomas'

-- =======================================================
-- CONSULTAS ÚTILES
-- =======================================================

-- Ver todos los niveles
SELECT id_Nivel, nivel, campus FROM Nivel ORDER BY id_Nivel;

-- Niveles que incluyen Tecnológico (devuelve 7)
SELECT id_Nivel, nivel, campus 
FROM Nivel 
WHERE FIND_IN_SET('Tecnologico', campus) > 0
ORDER BY id_Nivel;

-- Niveles que incluyen Centro de Idiomas (devuelve 19)
SELECT id_Nivel, nivel, campus 
FROM Nivel 
WHERE FIND_IN_SET('Centro de Idiomas', campus) > 0
ORDER BY id_Nivel;

-- Niveles en ambos campus (devuelve 7)
SELECT id_Nivel, nivel, campus 
FROM Nivel 
WHERE campus LIKE '%,%'
ORDER BY id_Nivel;

-- Niveles solo en un campus (devuelve 12)
SELECT id_Nivel, nivel, campus 
FROM Nivel 
WHERE campus NOT LIKE '%,%'
ORDER BY id_Nivel;

-- Contar niveles por tipo de asignación
SELECT 
    CASE 
        WHEN campus LIKE '%,%' THEN 'Ambos campus'
        ELSE 'Un solo campus'
    END AS tipo_asignacion,
    COUNT(*) AS cantidad
FROM Nivel
GROUP BY tipo_asignacion;

-- =======================================================
-- MIGRACIÓN (ya ejecutada)
-- =======================================================

-- Cambiar de ENUM a SET
-- ALTER TABLE Nivel 
-- MODIFY campus SET('Tecnologico','Centro de Idiomas');

-- Actualizar niveles 0-6 para ambos campus
-- UPDATE Nivel SET campus = 'Tecnologico,Centro de Idiomas' WHERE id_Nivel BETWEEN 0 AND 6;

-- =======================================================
-- RESUMEN FINAL
-- =======================================================
-- Total niveles: 19
-- Ambos campus: 7 (IDs 0-6)
-- Solo Centro de Idiomas: 12 (IDs 7-18)
-- =======================================================
