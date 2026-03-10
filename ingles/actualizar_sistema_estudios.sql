-- ================================================================
-- SCRIPT DE ACTUALIZACIÓN: Sistema de Preparación Académica
-- Implementa estructura flexible para estudios de profesores
-- ================================================================

USE proyectoIngles;

-- ================================================================
-- PASO 1: ACTUALIZAR TABLA CatalogoEstudios
-- ================================================================

-- Verificar si la tabla existe y crearla si no
CREATE TABLE IF NOT EXISTS CatalogoEstudios (
    id_Estudio INT AUTO_INCREMENT PRIMARY KEY,
    nivelEstudio VARCHAR(50) UNIQUE NOT NULL
);

-- Insertar niveles de estudio estándar
INSERT INTO CatalogoEstudios (nivelEstudio) VALUES 
('Licenciatura'),
('Maestría'),
('Doctorado'),
('Diplomado'),
('Especialidad'),
('Técnico Superior')
ON DUPLICATE KEY UPDATE nivelEstudio = VALUES(nivelEstudio);

-- ================================================================
-- PASO 2: ACTUALIZAR TABLA Preparacion
-- ================================================================

-- Si la tabla ya existe, necesitamos actualizarla
-- Primero eliminamos las llaves foráneas para poder modificar

-- Eliminar tabla si existe para crearla limpia
DROP TABLE IF EXISTS Preparacion;

-- Crear tabla Preparacion con estructura mejorada
CREATE TABLE Preparacion (
    id_prep INT AUTO_INCREMENT PRIMARY KEY,
    id_Profesor INT NOT NULL,
    id_Estudio INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,  -- "Licenciado en Inglés", "Ingeniero en Sistemas"
    institucion VARCHAR(200),       -- Universidad o institución
    año_obtencion YEAR,            -- Año en que obtuvo el título
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_Profesor) REFERENCES Profesor(id_Profesor) ON DELETE CASCADE,
    FOREIGN KEY (id_Estudio) REFERENCES CatalogoEstudios(id_Estudio),
    INDEX idx_profesor (id_Profesor),
    INDEX idx_estudio (id_Estudio)
);

-- ================================================================
-- PASO 3: ACTUALIZAR TABLA Profesor
-- ================================================================

-- Agregar comentario de que nivelEstudio está obsoleto
-- (No lo eliminamos para mantener compatibilidad con datos existentes)
ALTER TABLE Profesor 
MODIFY COLUMN nivelEstudio VARCHAR(50) COMMENT 'OBSOLETO - Usar tabla Preparacion';

-- Si quieres eliminarlo completamente (CUIDADO: se pierden datos):
-- ALTER TABLE Profesor DROP COLUMN nivelEstudio;

-- ================================================================
-- PASO 4: DATOS DE EJEMPLO (Opcional)
-- ================================================================

-- Ejemplo de cómo insertar estudios para un profesor
-- Descomenta estas líneas si quieres ver ejemplos

/*
-- Profesor con ID 1 tiene múltiples estudios
INSERT INTO Preparacion (id_Profesor, id_Estudio, titulo, institucion, año_obtencion) VALUES
(1, 1, 'Licenciado en Idioma Inglés', 'UNAM', 2015),
(1, 2, 'Maestría en Lingüística Aplicada', 'IPN', 2018),
(1, 4, 'Diplomado en Pedagogía Moderna', 'ITESM', 2020);

-- Profesor con ID 2
INSERT INTO Preparacion (id_Profesor, id_Estudio, titulo, institucion, año_obtencion) VALUES
(2, 1, 'Ingeniero en Sistemas Computacionales', 'IPN', 2012),
(2, 2, 'Maestría en Ciencias de la Computación', 'UNAM', 2015);
*/

-- ================================================================
-- VERIFICACIÓN
-- ================================================================

-- Ver catálogo de estudios disponibles
SELECT '=== CATÁLOGO DE ESTUDIOS ===' AS '';
SELECT * FROM CatalogoEstudios ORDER BY id_Estudio;

-- Ver estructura de tabla Preparacion
SELECT '=== ESTRUCTURA DE PREPARACION ===' AS '';
DESCRIBE Preparacion;

-- Ver estructura de tabla Profesor
SELECT '=== ESTRUCTURA DE PROFESOR ===' AS '';
DESCRIBE Profesor;

-- ================================================================
-- CONSULTAS ÚTILES PARA EL FUTURO
-- ================================================================

/*
-- Ver todos los estudios de un profesor específico
SELECT 
    p.id_prep,
    pr.id_Profesor,
    CONCAT(dp.nombre, ' ', dp.ape_paterno) AS nombre_profesor,
    ce.nivelEstudio,
    p.titulo,
    p.institucion,
    p.año_obtencion
FROM Preparacion p
JOIN Profesor pr ON p.id_Profesor = pr.id_Profesor
JOIN Empleado e ON pr.id_empleado = e.id_empleado
JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
JOIN CatalogoEstudios ce ON p.id_Estudio = ce.id_Estudio
WHERE pr.id_Profesor = 1
ORDER BY p.año_obtencion;

-- Ver profesores con Maestría
SELECT DISTINCT
    pr.id_Profesor,
    CONCAT(dp.nombre, ' ', dp.ape_paterno) AS nombre_profesor,
    GROUP_CONCAT(p.titulo SEPARATOR ', ') AS estudios
FROM Profesor pr
JOIN Empleado e ON pr.id_empleado = e.id_empleado
JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
JOIN Preparacion p ON pr.id_Profesor = p.id_Profesor
JOIN CatalogoEstudios ce ON p.id_Estudio = ce.id_Estudio
WHERE ce.nivelEstudio = 'Maestría'
GROUP BY pr.id_Profesor, nombre_profesor;

-- Contar profesores por nivel de estudios
SELECT 
    ce.nivelEstudio,
    COUNT(DISTINCT p.id_Profesor) AS cantidad_profesores
FROM Preparacion p
JOIN CatalogoEstudios ce ON p.id_Estudio = ce.id_Estudio
GROUP BY ce.nivelEstudio
ORDER BY cantidad_profesores DESC;
*/

-- ================================================================
-- SCRIPT COMPLETADO
-- ================================================================
SELECT '✅ Script ejecutado exitosamente' AS 'Estado';
SELECT 'Estructura actualizada para sistema flexible de estudios' AS 'Mensaje';
