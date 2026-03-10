-- ================================================================
-- SCRIPT PARA AZURE: Sistema de Preparación Académica
-- ================================================================

USE proyectoIngles;

-- ================================================================
-- PASO 1: ACTUALIZAR CatalogoEstudios
-- ================================================================

CREATE TABLE IF NOT EXISTS CatalogoEstudios (
    id_Estudio INT AUTO_INCREMENT PRIMARY KEY,
    nivelEstudio VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO CatalogoEstudios (nivelEstudio) VALUES 
('Licenciatura'),
('Maestría'),
('Doctorado'),
('Diplomado'),
('Especialidad'),
('Técnico Superior')
ON DUPLICATE KEY UPDATE nivelEstudio = VALUES(nivelEstudio);

-- ================================================================
-- PASO 2: ACTUALIZAR Preparacion
-- ================================================================

DROP TABLE IF EXISTS Preparacion;

CREATE TABLE Preparacion (
    id_prep INT AUTO_INCREMENT PRIMARY KEY,
    id_Profesor INT NOT NULL,
    id_Estudio INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    institucion VARCHAR(200),
    año_obtencion YEAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_Profesor) REFERENCES Profesor(id_Profesor) ON DELETE CASCADE,
    FOREIGN KEY (id_Estudio) REFERENCES CatalogoEstudios(id_Estudio),
    INDEX idx_profesor (id_Profesor),
    INDEX idx_estudio (id_Estudio)
);

-- ================================================================
-- PASO 3: MARCAR nivelEstudio COMO OBSOLETO
-- ================================================================

ALTER TABLE Profesor 
MODIFY COLUMN nivelEstudio VARCHAR(50) COMMENT 'OBSOLETO - Usar tabla Preparacion';

-- ================================================================
-- VERIFICACIÓN
-- ================================================================

SELECT * FROM CatalogoEstudios ORDER BY id_Estudio;
