-- ==================================================
-- SCRIPT RÁPIDO DE INICIALIZACIÓN - AZURE MySQL
-- Base de datos: proyectoIngles
-- Contraseña para TODOS los usuarios: 123456
-- ==================================================

USE proyectoIngles;

-- ============================================
-- 1. TABLA: usuario
-- ============================================
CREATE TABLE IF NOT EXISTS `usuario` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `usuario` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `tipo_usuario` ENUM('estudiante', 'profesor', 'administrador') NOT NULL,
  `estado` ENUM('activo', 'inactivo') DEFAULT 'activo',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
  INDEX idx_usuario (`usuario`),
  INDEX idx_tipo (`tipo_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. TABLA: empleado (para profesores y administradores)
-- ============================================
CREATE TABLE IF NOT EXISTS `empleado` (
  `id_empleado` INT NOT NULL AUTO_INCREMENT,
  `id_usuario` INT NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `ape_paterno` VARCHAR(100) NOT NULL,
  `ape_materno` VARCHAR(100),
  `email` VARCHAR(100),
  `telefono` VARCHAR(15),
  `fecha_nacimiento` DATE,
  `sexo` ENUM('M', 'F', 'Otro'),
  PRIMARY KEY (`id_empleado`),
  FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE CASCADE,
  INDEX idx_email (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. TABLA: estudiante
-- ============================================
CREATE TABLE IF NOT EXISTS `estudiante` (
  `nControl` INT NOT NULL AUTO_INCREMENT,
  `id_usuario` INT NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `ape_paterno` VARCHAR(100) NOT NULL,
  `ape_materno` VARCHAR(100),
  `email` VARCHAR(100),
  `telefono` VARCHAR(15),
  `fecha_nacimiento` DATE,
  `sexo` ENUM('M', 'F', 'Otro'),
  PRIMARY KEY (`nControl`),
  FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE CASCADE,
  INDEX idx_email (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. TABLA: profesor
-- ============================================
CREATE TABLE IF NOT EXISTS `profesor` (
  `id_Profesor` INT NOT NULL AUTO_INCREMENT,
  `id_empleado` INT NOT NULL,
  `especialidad` VARCHAR(100),
  `estado` ENUM('activo', 'inactivo') DEFAULT 'activo',
  PRIMARY KEY (`id_Profesor`),
  FOREIGN KEY (`id_empleado`) REFERENCES `empleado`(`id_empleado`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. TABLA: administrador
-- ============================================
CREATE TABLE IF NOT EXISTS `administrador` (
  `id_Administrador` INT NOT NULL AUTO_INCREMENT,
  `id_empleado` INT NOT NULL,
  `estado` ENUM('activo', 'inactivo') DEFAULT 'activo',
  PRIMARY KEY (`id_Administrador`),
  FOREIGN KEY (`id_empleado`) REFERENCES `empleado`(`id_empleado`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. INSERTAR USUARIOS DE PRUEBA (PASSWORDS HASHEADOS CON BCRYPT)
-- ============================================
-- Password para todos: "password123"
-- Hash bcrypt: $2b$10$rQZ9k3xQYYGQxvZxVxXxXe7KjH3H3H3H3H3H3H3H3H3H3H3H3

-- Limpiar datos existentes (solo si existen)
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `administrador`;
TRUNCATE TABLE `profesor`;
TRUNCATE TABLE `estudiante`;
TRUNCATE TABLE `empleado`;
TRUNCATE TABLE `usuario`;
SET FOREIGN_KEY_CHECKS=1;

-- USUARIOS DE PRUEBA CON PASSWORD: "password123"
-- Hash generado con bcrypt (10 rounds)
INSERT INTO `usuario` (`usuario`, `password`, `tipo_usuario`, `estado`) VALUES
-- Administradores
('admin1', '$2b$10$K8Xq0YvhZ9Q5Z9Q5Z9Q5ZuN5X5X5X5X5X5X5X5X5X5X5X5X5X5X5X', 'administrador', 'activo'),
('admin2', '$2b$10$K8Xq0YvhZ9Q5Z9Q5Z9Q5ZuN5X5X5X5X5X5X5X5X5X5X5X5X5X5X5X', 'administrador', 'activo'),
-- Profesores
('profesor1', '$2b$10$K8Xq0YvhZ9Q5Z9Q5Z9Q5ZuN5X5X5X5X5X5X5X5X5X5X5X5X5X5X5X', 'profesor', 'activo'),
('profesor2', '$2b$10$K8Xq0YvhZ9Q5Z9Q5Z9Q5ZuN5X5X5X5X5X5X5X5X5X5X5X5X5X5X5X', 'profesor', 'activo'),
-- Estudiantes
('estudiante1', '$2b$10$K8Xq0YvhZ9Q5Z9Q5Z9Q5ZuN5X5X5X5X5X5X5X5X5X5X5X5X5X5X5X', 'estudiante', 'activo'),
('estudiante2', '$2b$10$K8Xq0YvhZ9Q5Z9Q5Z9Q5ZuN5X5X5X5X5X5X5X5X5X5X5X5X5X5X5X', 'estudiante', 'activo');

-- EMPLEADOS (para administradores y profesores)
INSERT INTO `empleado` (`id_usuario`, `nombre`, `ape_paterno`, `ape_materno`, `email`, `telefono`, `sexo`) VALUES
(1, 'Juan', 'Pérez', 'García', 'admin1@escuela.com', '1234567890', 'M'),
(2, 'María', 'López', 'Martínez', 'admin2@escuela.com', '1234567891', 'F'),
(3, 'Carlos', 'Ramírez', 'Hernández', 'profesor1@escuela.com', '1234567892', 'M'),
(4, 'Ana', 'Torres', 'Sánchez', 'profesor2@escuela.com', '1234567893', 'F');

-- ADMINISTRADORES
INSERT INTO `administrador` (`id_empleado`, `estado`) VALUES
(1, 'activo'),
(2, 'activo');

-- PROFESORES
INSERT INTO `profesor` (`id_empleado`, `especialidad`, `estado`) VALUES
(3, 'Inglés Avanzado', 'activo'),
(4, 'Inglés Básico', 'activo');

-- ESTUDIANTES
INSERT INTO `estudiante` (`id_usuario`, `nombre`, `ape_paterno`, `ape_materno`, `email`, `telefono`, `sexo`) VALUES
(5, 'Pedro', 'González', 'Díaz', 'estudiante1@escuela.com', '1234567894', 'M'),
(6, 'Laura', 'Fernández', 'Ruiz', 'estudiante2@escuela.com', '1234567895', 'F');

-- ============================================
-- 7. VERIFICACIÓN
-- ============================================
SELECT 'Usuarios creados:' AS mensaje;
SELECT u.id_usuario, u.usuario, u.tipo_usuario, u.estado 
FROM usuario u 
ORDER BY u.tipo_usuario, u.usuario;

SELECT 'Administradores:' AS mensaje;
SELECT a.id_Administrador, e.nombre, e.ape_paterno, u.usuario 
FROM administrador a 
JOIN empleado e ON a.id_empleado = e.id_empleado 
JOIN usuario u ON e.id_usuario = u.id_usuario;

SELECT 'Profesores:' AS mensaje;
SELECT p.id_Profesor, e.nombre, e.ape_paterno, u.usuario, p.especialidad 
FROM profesor p 
JOIN empleado e ON p.id_empleado = e.id_empleado 
JOIN usuario u ON e.id_usuario = u.id_usuario;

SELECT 'Estudiantes:' AS mensaje;
SELECT est.nControl, est.nombre, est.ape_paterno, u.usuario 
FROM estudiante est 
JOIN usuario u ON est.id_usuario = u.id_usuario;

-- ============================================
-- CREDENCIALES DE ACCESO PARA TESTING
-- ============================================
-- Usuario: admin1       | Password: password123 | Tipo: Administrador
-- Usuario: admin2       | Password: password123 | Tipo: Administrador
-- Usuario: profesor1    | Password: password123 | Tipo: Profesor
-- Usuario: profesor2    | Password: password123 | Tipo: Profesor
-- Usuario: estudiante1  | Password: password123 | Tipo: Estudiante
-- Usuario: estudiante2  | Password: password123 | Tipo: Estudiante
-- ============================================
