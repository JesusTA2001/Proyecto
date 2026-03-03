-- Script para agregar todos los niveles del Centro de Idiomas a la base de datos
-- Ejecutar este script en Azure MySQL

-- Niveles Kids (7-12)
INSERT INTO nivel (id_Nivel, nivel) VALUES (7, 'Kids 1') ON DUPLICATE KEY UPDATE nivel='Kids 1';
INSERT INTO nivel (id_Nivel, nivel) VALUES (8, 'Kids 2') ON DUPLICATE KEY UPDATE nivel='Kids 2';
INSERT INTO nivel (id_Nivel, nivel) VALUES (9, 'Kids 3') ON DUPLICATE KEY UPDATE nivel='Kids 3';
INSERT INTO nivel (id_Nivel, nivel) VALUES (10, 'Kids 4') ON DUPLICATE KEY UPDATE nivel='Kids 4';
INSERT INTO nivel (id_Nivel, nivel) VALUES (11, 'Kids 5') ON DUPLICATE KEY UPDATE nivel='Kids 5';
INSERT INTO nivel (id_Nivel, nivel) VALUES (12, 'Kids 6') ON DUPLICATE KEY UPDATE nivel='Kids 6';

-- Niveles Teens (13-16)
INSERT INTO nivel (id_Nivel, nivel) VALUES (13, 'Teens 1') ON DUPLICATE KEY UPDATE nivel='Teens 1';
INSERT INTO nivel (id_Nivel, nivel) VALUES (14, 'Teens 2') ON DUPLICATE KEY UPDATE nivel='Teens 2';
INSERT INTO nivel (id_Nivel, nivel) VALUES (15, 'Teens 3') ON DUPLICATE KEY UPDATE nivel='Teens 3';
INSERT INTO nivel (id_Nivel, nivel) VALUES (16, 'Teens 4') ON DUPLICATE KEY UPDATE nivel='Teens 4';

-- Niveles Conversación (17-18)
INSERT INTO nivel (id_Nivel, nivel) VALUES (17, 'Conversación 1') ON DUPLICATE KEY UPDATE nivel='Conversación 1';
INSERT INTO nivel (id_Nivel, nivel) VALUES (18, 'Conversación 2') ON DUPLICATE KEY UPDATE nivel='Conversación 2';

-- Niveles Diplomado (19-20)
INSERT INTO nivel (id_Nivel, nivel) VALUES (19, 'Diplomado 1') ON DUPLICATE KEY UPDATE nivel='Diplomado 1';
INSERT INTO nivel (id_Nivel, nivel) VALUES (20, 'Diplomado 2') ON DUPLICATE KEY UPDATE nivel='Diplomado 2';

-- Verificar los niveles insertados
SELECT * FROM nivel ORDER BY id_Nivel;
