-- ==================================================
-- SCRIPT RÁPIDO - AZURE MySQL: proyectoIngles
-- PASSWORD PARA TODOS: 123456 (sin hashear)
-- ==================================================

USE proyectoIngles;

-- Limpiar datos existentes
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `usuarios`;
SET FOREIGN_KEY_CHECKS=1;

-- ============================================
-- INSERTAR USUARIOS DE PRUEBA
-- Password: 123456 (SIN HASHEAR)
-- ============================================

INSERT INTO `usuarios` (`usuario`, `contraseña`, `rol`, `id_relacion`) VALUES
-- ADMINISTRADORES (usar con: admin1 / 123456)
('admin1', '123456', 'ADMINISTRADOR', 1),
('admin2', '123456', 'ADMINISTRADOR', 2),
('admin3', '123456', 'ADMINISTRADOR', 3),

-- PROFESORES (usar con: prof1 / 123456)
('prof1', '123456', 'PROFESOR', 1),
('prof2', '123456', 'PROFESOR', 2),
('prof3', '123456', 'PROFESOR', 3),
('prof4', '123456', 'PROFESOR', 4),
('prof5', '123456', 'PROFESOR', 5),

-- ESTUDIANTES (usar con: 1000 / 123456)
('1000', '123456', 'ESTUDIANTE', 1000),
('1001', '123456', 'ESTUDIANTE', 1001),
('1002', '123456', 'ESTUDIANTE', 1002),
('1003', '123456', 'ESTUDIANTE', 1003),
('1004', '123456', 'ESTUDIANTE', 1004),
('1005', '123456', 'ESTUDIANTE', 1005),
('1006', '123456', 'ESTUDIANTE', 1006),
('1007', '123456', 'ESTUDIANTE', 1007),
('1008', '123456', 'ESTUDIANTE', 1008),
('1009', '123456', 'ESTUDIANTE', 1009),
('1010', '123456', 'ESTUDIANTE', 1010);

-- ============================================
-- VERIFICACIÓN
-- ============================================
SELECT 'USUARIOS CREADOS:' AS mensaje;
SELECT id_usuario, usuario, rol, id_relacion FROM usuarios ORDER BY rol, usuario;

-- ============================================
-- CREDENCIALES PARA LOGIN
-- ============================================
-- ADMINISTRADOR: admin1 / 123456
-- ADMINISTRADOR: admin2 / 123456
-- ADMINISTRADOR: admin3 / 123456
-- 
-- PROFESOR: prof1 / 123456
-- PROFESOR: prof2 / 123456
-- PROFESOR: prof3 / 123456
-- 
-- ESTUDIANTE: 1000 / 123456
-- ESTUDIANTE: 1001 / 123456
-- ESTUDIANTE: 1002 / 123456
-- ==================================================

-- NOTA: Tu backend está configurado para comparar contraseñas
-- con bcrypt. Necesitas MODIFICAR el authController.js 
-- para aceptar contraseñas sin hashear TEMPORALMENTE.
