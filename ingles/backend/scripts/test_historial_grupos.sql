-- ===================================================================
-- SCRIPT DE PRUEBA: Historial de Grupos
-- IMPORTANTE: Ejecuta este script en tu cliente MySQL manualmente
-- ===================================================================

-- PASO 1: AGREGAR COLUMNA estado a Periodo (si no existe)
-- ===================================================================
-- Si te da error diciendo que ya existe, ignóralo y continúa
ALTER TABLE Periodo ADD COLUMN estado VARCHAR(50) DEFAULT 'Activo';

-- PASO 2: Insertar periodo finalizado de prueba
-- ===================================================================
INSERT INTO Periodo (id_Periodo, descripcion, año, fecha_inicio, fecha_fin, estado)
VALUES (999, 'PERIODO TEST ELIMINAR', 2026, '2025-01-01', '2025-12-31', 'Finalizado');

SET @periodo_test_id = 999;

-- PASO 3: Insertar grupo de prueba
-- ===================================================================
INSERT INTO Grupo (grupo, id_Periodo, id_Profesor, id_Nivel, ubicacion, id_cHorario)
VALUES ('TEST-GRUPO-HIST', @periodo_test_id, 1, 1, 'Aula Test', 1);

SELECT @grupo_test_id := LAST_INSERT_ID();

-- PASO 4: Insertar 3 estudiantes de prueba
-- ===================================================================
INSERT INTO EstudianteGrupo (nControl, id_Grupo, estado)
VALUES 
  ('TEST001', @grupo_test_id, 'concluido'),
  ('TEST002', @grupo_test_id, 'concluido'),
  ('TEST003', @grupo_test_id, 'concluido');

-- PASO 5: Insertar calificaciones completas
-- ===================================================================
INSERT INTO Calificaciones (nControl, parcial1, parcial2, parcial3, final, id_nivel, id_Periodo, id_Grupo)
VALUES
  ('TEST001', 85, 90, 88, 87.67, 1, @periodo_test_id, @grupo_test_id),
  ('TEST002', 75, 78, 80, 77.67, 1, @periodo_test_id, @grupo_test_id),
  ('TEST003', 92, 95, 93, 93.33, 1, @periodo_test_id, @grupo_test_id);

-- Verificar datos
SELECT 'VERIFICACION: Grupo insertado' AS status,
       g.grupo, g.id_Grupo, p.descripcion, p.estado,
       (SELECT COUNT(*) FROM EstudianteGrupo eg WHERE eg.id_Grupo = g.id_Grupo) AS total_estudiantes
FROM Grupo g
LEFT JOIN Periodo p ON g.id_Periodo = p.id_Periodo
WHERE g.grupo = 'TEST-GRUPO-HIST';

-- ===================================================================
-- PASO 6: VER EN LA APLICACION
-- ===================================================================
-- Abre el navegador en: Administrador → Estudiantes → Historial de Grupos
-- Deberias ver el grupo "TEST-GRUPO-HIST" con 3 estudiantes
-- Haz click "Ver Calificaciones" para ver la tabla
-- Exporta a Excel para probar

-- ===================================================================
-- PASO 7: LIMPIAR DATOS (ejecuta DESPUES de probar)
-- ===================================================================
-- Descomenta las siguientes lineas CUANDO TERMINES LA PRUEBA:

/*
DELETE FROM Calificaciones WHERE id_Grupo IN (SELECT id_Grupo FROM Grupo WHERE grupo = 'TEST-GRUPO-HIST');
DELETE FROM EstudianteGrupo WHERE id_Grupo IN (SELECT id_Grupo FROM Grupo WHERE grupo = 'TEST-GRUPO-HIST');
DELETE FROM Grupo WHERE grupo = 'TEST-GRUPO-HIST';
DELETE FROM Periodo WHERE descripcion = 'PERIODO TEST ELIMINAR';
SELECT 'Datos de prueba eliminados' AS status;
*/


-- ===================================================================
-- PASO 6: VER EN LA APLICACION
-- ===================================================================
-- Abre el navegador en: Administrador → Estudiantes → Historial de Grupos
-- Deberias ver el grupo "TEST-GRUPO-HIST" con 3 estudiantes
-- Haz click "Ver Calificaciones" para ver la tabla
-- Exporta a Excel para probar

-- ===================================================================
-- PASO 7: LIMPIAR DATOS (ejecuta DESPUES de probar)
-- ===================================================================
-- Descomenta las siguientes lineas CUANDO TERMINES LA PRUEBA:

/*
DELETE FROM Calificaciones WHERE id_Grupo IN (SELECT id_Grupo FROM Grupo WHERE grupo = 'TEST-GRUPO-HIST');
DELETE FROM EstudianteGrupo WHERE id_Grupo IN (SELECT id_Grupo FROM Grupo WHERE grupo = 'TEST-GRUPO-HIST');
DELETE FROM Grupo WHERE grupo = 'TEST-GRUPO-HIST';
DELETE FROM Periodo WHERE descripcion = 'PERIODO TEST ELIMINAR';
SELECT 'Datos de prueba eliminados' AS status;
*/

