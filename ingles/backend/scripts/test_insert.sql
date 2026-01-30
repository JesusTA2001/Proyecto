INSERT INTO Periodo (descripcion, año, fecha_inicio, fecha_fin, estado)
VALUES ('PERIODO TEST - ELIMINAR', 2026, '2025-01-01', '2025-12-31', 'Finalizado');

SET @periodo_test_id = LAST_INSERT_ID();

INSERT INTO Grupo (grupo, id_Periodo, id_Profesor, id_Nivel, ubicacion, id_cHorario)
VALUES ('TEST-GRUPO-HIST', @periodo_test_id, 1, 1, 'Aula Test', 1);

SET @grupo_test_id = LAST_INSERT_ID();

INSERT INTO EstudianteGrupo (nControl, id_Grupo, estado)
VALUES 
  ('TEST001', @grupo_test_id, 'concluido'),
  ('TEST002', @grupo_test_id, 'concluido'),
  ('TEST003', @grupo_test_id, 'concluido');

INSERT INTO Calificaciones (nControl, parcial1, parcial2, parcial3, final, id_nivel, id_Periodo, id_Grupo)
VALUES
  ('TEST001', 85, 90, 88, 87.67, 1, @periodo_test_id, @grupo_test_id),
  ('TEST002', 75, 78, 80, 77.67, 1, @periodo_test_id, @grupo_test_id),
  ('TEST003', 92, 95, 93, 93.33, 1, @periodo_test_id, @grupo_test_id);

SELECT 'Datos de prueba insertados exitosamente' AS mensaje;
