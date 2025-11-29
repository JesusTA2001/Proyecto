-- Script para insertar 200 estudiantes con datos ficticios
-- Asegura que los estudiantes no estén asignados a ningún grupo inicialmente

USE proyectoingles;

-- Variables para IDs
SET @start_dp_id = (SELECT COALESCE(MAX(id_dp), 0) FROM DatosPersonales) + 1;
SET @start_nControl = 2024001;

-- Insertar 200 estudiantes
-- Primero insertamos en DatosPersonales, luego en Estudiante

DELIMITER $$

DROP PROCEDURE IF EXISTS InsertarEstudiantes$$

CREATE PROCEDURE InsertarEstudiantes()
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE v_id_dp INT;
    DECLARE v_nControl INT;
    DECLARE v_apellidoP VARCHAR(50);
    DECLARE v_apellidoM VARCHAR(50);
    DECLARE v_nombre VARCHAR(50);
    DECLARE v_email VARCHAR(100);
    DECLARE v_genero VARCHAR(10);
    DECLARE v_CURP VARCHAR(18);
    DECLARE v_telefono VARCHAR(15);
    DECLARE v_direccion VARCHAR(200);
    DECLARE v_ubicacion VARCHAR(50);
    DECLARE v_nivel INT;
    
    -- Arrays de nombres (simulado con CASE)
    DECLARE nombres_m TEXT DEFAULT 'Juan,Carlos,Luis,Miguel,Pedro,Jose,Fernando,Ricardo,Roberto,Mario,Eduardo,Alberto,Jorge,Francisco,Antonio,Manuel,Sergio,Rafael,Javier,Diego';
    DECLARE nombres_f TEXT DEFAULT 'Maria,Ana,Laura,Carmen,Rosa,Patricia,Sandra,Monica,Gabriela,Diana,Claudia,Elena,Sofia,Isabel,Veronica,Adriana,Cristina,Beatriz,Teresa,Lucía';
    DECLARE apellidos TEXT DEFAULT 'García,Rodríguez,Martínez,López,González,Pérez,Sánchez,Ramírez,Torres,Flores,Rivera,Gómez,Díaz,Cruz,Morales,Reyes,Jiménez,Hernández,Ruiz,Mendoza,Castro,Ortiz,Silva,Romero,Vega,Moreno,Ramos,Guerrero,Medina,Aguilar';
    
    WHILE i < 200 DO
        SET i = i + 1;
        SET v_id_dp = @start_dp_id + i - 1;
        SET v_nControl = @start_nControl + i - 1;
        
        -- Generar género aleatorio
        SET v_genero = IF(RAND() < 0.5, 'Masculino', 'Femenino');
        
        -- Generar nombre según género
        IF v_genero = 'Masculino' THEN
            SET v_nombre = SUBSTRING_INDEX(SUBSTRING_INDEX(nombres_m, ',', FLOOR(1 + RAND() * 20)), ',', -1);
        ELSE
            SET v_nombre = SUBSTRING_INDEX(SUBSTRING_INDEX(nombres_f, ',', FLOOR(1 + RAND() * 20)), ',', -1);
        END IF;
        
        -- Generar apellidos
        SET v_apellidoP = SUBSTRING_INDEX(SUBSTRING_INDEX(apellidos, ',', FLOOR(1 + RAND() * 30)), ',', -1);
        SET v_apellidoM = SUBSTRING_INDEX(SUBSTRING_INDEX(apellidos, ',', FLOOR(1 + RAND() * 30)), ',', -1);
        
        -- Generar email
        SET v_email = CONCAT(LOWER(v_nombre), '.', LOWER(v_apellidoP), v_nControl, '@estudiante.tec.mx');
        
        -- Generar CURP (ficticio pero con formato válido)
        SET v_CURP = CONCAT(
            UPPER(SUBSTRING(v_apellidoP, 1, 1)),
            UPPER(SUBSTRING(CASE WHEN SUBSTRING(v_apellidoP, 2, 1) IN ('a','e','i','o','u') THEN SUBSTRING(v_apellidoP, 2, 1) ELSE SUBSTRING(v_apellidoP, 3, 1) END, 1, 1)),
            UPPER(SUBSTRING(v_apellidoM, 1, 1)),
            UPPER(SUBSTRING(v_nombre, 1, 1)),
            LPAD(FLOOR(90 + RAND() * 10), 2, '0'),
            LPAD(FLOOR(1 + RAND() * 12), 2, '0'),
            LPAD(FLOOR(1 + RAND() * 28), 2, '0'),
            IF(v_genero = 'Masculino', 'H', 'M'),
            'GT',
            LPAD(FLOOR(100 + RAND() * 900), 3, '0'),
            LPAD(FLOOR(100 + RAND() * 900), 3, '0'),
            FLOOR(RAND() * 10)
        );
        
        -- Generar teléfono
        SET v_telefono = CONCAT('664', LPAD(FLOOR(1000000 + RAND() * 8999999), 7, '0'));
        
        -- Generar dirección
        SET v_direccion = CONCAT(
            'Calle ', FLOOR(1 + RAND() * 100), ' #', FLOOR(1 + RAND() * 999), 
            ', Colonia ', SUBSTRING_INDEX(SUBSTRING_INDEX(apellidos, ',', FLOOR(1 + RAND() * 30)), ',', -1),
            ', Tijuana, BC'
        );
        
        -- Asignar ubicación (70% Tecnológico, 30% Centro de Idiomas)
        SET v_ubicacion = IF(RAND() < 0.7, 'Tecnologico', 'Centro de Idiomas');
        
        -- Asignar nivel aleatorio según ubicación
        IF v_ubicacion = 'Tecnologico' THEN
            SET v_nivel = FLOOR(RAND() * 7); -- Niveles 0-6
        ELSE
            SET v_nivel = FLOOR(RAND() * 7); -- Por ahora también 0-6
        END IF;
        
        -- Insertar en DatosPersonales
        INSERT INTO DatosPersonales (id_dp, apellidoPaterno, apellidoMaterno, nombre, email, genero, CURP, telefono, direccion)
        VALUES (v_id_dp, v_apellidoP, v_apellidoM, v_nombre, v_email, v_genero, v_CURP, v_telefono, v_direccion);
        
        -- Insertar en Estudiante
        INSERT INTO Estudiante (nControl, id_dp, ubicacion, id_Nivel, estado, usuario, contraseña)
        VALUES (
            v_nControl, 
            v_id_dp, 
            v_ubicacion, 
            v_nivel, 
            'activo',
            v_email,
            v_CURP  -- Usar CURP como contraseña por defecto
        );
        
    END WHILE;
    
    SELECT CONCAT('Se insertaron ', i, ' estudiantes exitosamente') AS Resultado;
END$$

DELIMITER ;

-- Ejecutar el procedimiento
CALL InsertarEstudiantes();

-- Limpiar procedimiento
DROP PROCEDURE IF EXISTS InsertarEstudiantes;

-- Verificar inserción
SELECT COUNT(*) as total_estudiantes FROM Estudiante;
SELECT 
    e.ubicacion,
    COUNT(*) as cantidad,
    GROUP_CONCAT(DISTINCT n.nivel ORDER BY n.id_Nivel) as niveles
FROM Estudiante e
LEFT JOIN Nivel n ON e.id_Nivel = n.id_Nivel
GROUP BY e.ubicacion;

-- Mostrar estudiantes sin grupo asignado
SELECT COUNT(*) as estudiantes_sin_grupo
FROM Estudiante e
WHERE NOT EXISTS (
    SELECT 1 FROM EstudianteGrupo eg 
    WHERE eg.nControl = e.nControl
);
