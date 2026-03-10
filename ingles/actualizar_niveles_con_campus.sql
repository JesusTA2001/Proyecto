-- =======================================================
-- Script para actualizar tabla Nivel con campo campus
-- y agregar todos los niveles del sistema
-- =======================================================

USE proyectoIngles;

-- Agregar columna campus a la tabla Nivel si no existe
ALTER TABLE Nivel 
ADD COLUMN campus ENUM('Tecnologico','Centro de Idiomas') DEFAULT 'Tecnologico';

-- =======================================================
-- NIVELES DEL TECNOLÓGICO (Intro + Nivel 1-6)
-- =======================================================

-- Actualizar niveles existentes del Tecnológico
UPDATE Nivel SET campus = 'Tecnologico' WHERE id_Nivel = 0; -- Intro
UPDATE Nivel SET campus = 'Tecnologico' WHERE id_Nivel = 1; -- Nivel1
UPDATE Nivel SET campus = 'Tecnologico' WHERE id_Nivel = 2; -- Nivel2
UPDATE Nivel SET campus = 'Tecnologico' WHERE id_Nivel = 3; -- Nivel3
UPDATE Nivel SET campus = 'Tecnologico' WHERE id_Nivel = 4; -- Nivel4
UPDATE Nivel SET campus = 'Tecnologico' WHERE id_Nivel = 5; -- Nivel5
UPDATE Nivel SET campus = 'Tecnologico' WHERE id_Nivel = 6; -- Nivel6

-- =======================================================
-- NIVELES DEL CENTRO DE IDIOMAS
-- =======================================================

-- Kids (7-10) - Solo hasta Kids 4
INSERT INTO Nivel (id_Nivel, nivel, campus) VALUES (7, 'Kids 1', 'Centro de Idiomas') 
ON DUPLICATE KEY UPDATE nivel='Kids 1', campus='Centro de Idiomas';

INSERT INTO Nivel (id_Nivel, nivel, campus) VALUES (8, 'Kids 2', 'Centro de Idiomas') 
ON DUPLICATE KEY UPDATE nivel='Kids 2', campus='Centro de Idiomas';

INSERT INTO Nivel (id_Nivel, nivel, campus) VALUES (9, 'Kids 3', 'Centro de Idiomas') 
ON DUPLICATE KEY UPDATE nivel='Kids 3', campus='Centro de Idiomas';

INSERT INTO Nivel (id_Nivel, nivel, campus) VALUES (10, 'Kids 4', 'Centro de Idiomas') 
ON DUPLICATE KEY UPDATE nivel='Kids 4', campus='Centro de Idiomas';

-- Teens (11-14) - Solo hasta Teens 4
INSERT INTO Nivel (id_Nivel, nivel, campus) VALUES (11, 'Teens 1', 'Centro de Idiomas') 
ON DUPLICATE KEY UPDATE nivel='Teens 1', campus='Centro de Idiomas';

INSERT INTO Nivel (id_Nivel, nivel, campus) VALUES (12, 'Teens 2', 'Centro de Idiomas') 
ON DUPLICATE KEY UPDATE nivel='Teens 2', campus='Centro de Idiomas';

INSERT INTO Nivel (id_Nivel, nivel, campus) VALUES (13, 'Teens 3', 'Centro de Idiomas') 
ON DUPLICATE KEY UPDATE nivel='Teens 3', campus='Centro de Idiomas';

INSERT INTO Nivel (id_Nivel, nivel, campus) VALUES (14, 'Teens 4', 'Centro de Idiomas') 
ON DUPLICATE KEY UPDATE nivel='Teens 4', campus='Centro de Idiomas';

-- Conversación (15-16)
INSERT INTO Nivel (id_Nivel, nivel, campus) VALUES (15, 'Conversación 1', 'Centro de Idiomas') 
ON DUPLICATE KEY UPDATE nivel='Conversación 1', campus='Centro de Idiomas';

INSERT INTO Nivel (id_Nivel, nivel, campus) VALUES (16, 'Conversación 2', 'Centro de Idiomas') 
ON DUPLICATE KEY UPDATE nivel='Conversación 2', campus='Centro de Idiomas';

-- Diplomado (17-18)
INSERT INTO Nivel (id_Nivel, nivel, campus) VALUES (17, 'Diplomado 1', 'Centro de Idiomas') 
ON DUPLICATE KEY UPDATE nivel='Diplomado 1', campus='Centro de Idiomas';

INSERT INTO Nivel (id_Nivel, nivel, campus) VALUES (18, 'Diplomado 2', 'Centro de Idiomas') 
ON DUPLICATE KEY UPDATE nivel='Diplomado 2', campus='Centro de Idiomas';

-- =======================================================
-- VERIFICACIÓN: Mostrar todos los niveles por campus
-- =======================================================

SELECT '=== NIVELES DEL TECNOLÓGICO ===' AS '';
SELECT id_Nivel, nivel, campus 
FROM Nivel 
WHERE campus = 'Tecnologico' 
ORDER BY id_Nivel;

SELECT '=== NIVELES DEL CENTRO DE IDIOMAS ===' AS '';
SELECT id_Nivel, nivel, campus 
FROM Nivel 
WHERE campus = 'Centro de Idiomas' 
ORDER BY id_Nivel;

SELECT '=== RESUMEN ===' AS '';
SELECT campus, COUNT(*) AS total_niveles 
FROM Nivel 
GROUP BY campus;
