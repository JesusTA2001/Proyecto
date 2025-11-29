-- Script simplificado para insertar 200 estudiantes
USE proyectoingles;

DELIMITER $$

DROP PROCEDURE IF EXISTS InsertarEstudiantesSimple$$

CREATE PROCEDURE InsertarEstudiantesSimple()
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
    DECLARE v_rand_nombre INT;
    DECLARE v_rand_ap1 INT;
    DECLARE v_rand_ap2 INT;
    
    SET @start_dp_id = (SELECT COALESCE(MAX(id_dp), 0) FROM DatosPersonales) + 1;
    SET @start_nControl = 2024001;
    
    WHILE i < 200 DO
        SET i = i + 1;
        SET v_id_dp = @start_dp_id + i - 1;
        SET v_nControl = @start_nControl + i - 1;
        
        SET v_rand_nombre = FLOOR(1 + RAND() * 20);
        SET v_rand_ap1 = FLOOR(1 + RAND() * 30);
        SET v_rand_ap2 = FLOOR(1 + RAND() * 30);
        
        SET v_genero = IF(RAND() < 0.5, 'Masculino', 'Femenino');
        
        SET v_nombre = CASE v_rand_nombre
            WHEN 1 THEN IF(v_genero='Masculino', 'Juan', 'Maria')
            WHEN 2 THEN IF(v_genero='Masculino', 'Carlos', 'Ana')
            WHEN 3 THEN IF(v_genero='Masculino', 'Luis', 'Laura')
            WHEN 4 THEN IF(v_genero='Masculino', 'Miguel', 'Carmen')
            WHEN 5 THEN IF(v_genero='Masculino', 'Pedro', 'Rosa')
            WHEN 6 THEN IF(v_genero='Masculino', 'Jose', 'Patricia')
            WHEN 7 THEN IF(v_genero='Masculino', 'Fernando', 'Sandra')
            WHEN 8 THEN IF(v_genero='Masculino', 'Ricardo', 'Monica')
            WHEN 9 THEN IF(v_genero='Masculino', 'Roberto', 'Gabriela')
            WHEN 10 THEN IF(v_genero='Masculino', 'Mario', 'Diana')
            WHEN 11 THEN IF(v_genero='Masculino', 'Eduardo', 'Claudia')
            WHEN 12 THEN IF(v_genero='Masculino', 'Alberto', 'Elena')
            WHEN 13 THEN IF(v_genero='Masculino', 'Jorge', 'Sofia')
            WHEN 14 THEN IF(v_genero='Masculino', 'Francisco', 'Isabel')
            WHEN 15 THEN IF(v_genero='Masculino', 'Antonio', 'Veronica')
            WHEN 16 THEN IF(v_genero='Masculino', 'Manuel', 'Adriana')
            WHEN 17 THEN IF(v_genero='Masculino', 'Sergio', 'Cristina')
            WHEN 18 THEN IF(v_genero='Masculino', 'Rafael', 'Beatriz')
            WHEN 19 THEN IF(v_genero='Masculino', 'Javier', 'Teresa')
            ELSE IF(v_genero='Masculino', 'Diego', 'Lucia')
        END;
        
        SET v_apellidoP = CASE v_rand_ap1
            WHEN 1 THEN 'Garcia' WHEN 2 THEN 'Rodriguez' WHEN 3 THEN 'Martinez'
            WHEN 4 THEN 'Lopez' WHEN 5 THEN 'Gonzalez' WHEN 6 THEN 'Perez'
            WHEN 7 THEN 'Sanchez' WHEN 8 THEN 'Ramirez' WHEN 9 THEN 'Torres'
            WHEN 10 THEN 'Flores' WHEN 11 THEN 'Rivera' WHEN 12 THEN 'Gomez'
            WHEN 13 THEN 'Diaz' WHEN 14 THEN 'Cruz' WHEN 15 THEN 'Morales'
            WHEN 16 THEN 'Reyes' WHEN 17 THEN 'Jimenez' WHEN 18 THEN 'Hernandez'
            WHEN 19 THEN 'Ruiz' WHEN 20 THEN 'Mendoza' WHEN 21 THEN 'Castro'
            WHEN 22 THEN 'Ortiz' WHEN 23 THEN 'Silva' WHEN 24 THEN 'Romero'
            WHEN 25 THEN 'Vega' WHEN 26 THEN 'Moreno' WHEN 27 THEN 'Ramos'
            WHEN 28 THEN 'Guerrero' WHEN 29 THEN 'Medina' ELSE 'Aguilar'
        END;
        
        SET v_apellidoM = CASE v_rand_ap2
            WHEN 1 THEN 'Garcia' WHEN 2 THEN 'Rodriguez' WHEN 3 THEN 'Martinez'
            WHEN 4 THEN 'Lopez' WHEN 5 THEN 'Gonzalez' WHEN 6 THEN 'Perez'
            WHEN 7 THEN 'Sanchez' WHEN 8 THEN 'Ramirez' WHEN 9 THEN 'Torres'
            WHEN 10 THEN 'Flores' WHEN 11 THEN 'Rivera' WHEN 12 THEN 'Gomez'
            WHEN 13 THEN 'Diaz' WHEN 14 THEN 'Cruz' WHEN 15 THEN 'Morales'
            WHEN 16 THEN 'Reyes' WHEN 17 THEN 'Jimenez' WHEN 18 THEN 'Hernandez'
            WHEN 19 THEN 'Ruiz' WHEN 20 THEN 'Mendoza' WHEN 21 THEN 'Castro'
            WHEN 22 THEN 'Ortiz' WHEN 23 THEN 'Silva' WHEN 24 THEN 'Romero'
            WHEN 25 THEN 'Vega' WHEN 26 THEN 'Moreno' WHEN 27 THEN 'Ramos'
            WHEN 28 THEN 'Guerrero' WHEN 29 THEN 'Medina' ELSE 'Aguilar'
        END;
        
        SET v_email = CONCAT(LOWER(v_nombre), '.', LOWER(v_apellidoP), v_nControl, '@estudiante.tec.mx');
        
        SET v_CURP = CONCAT(
            UPPER(SUBSTRING(v_apellidoP, 1, 2)),
            UPPER(SUBSTRING(v_apellidoM, 1, 1)),
            UPPER(SUBSTRING(v_nombre, 1, 1)),
            LPAD(FLOOR(90 + RAND() * 10), 2, '0'),
            LPAD(FLOOR(1 + RAND() * 12), 2, '0'),
            LPAD(FLOOR(1 + RAND() * 28), 2, '0'),
            IF(v_genero = 'Masculino', 'H', 'M'),
            'BC',
            LPAD(FLOOR(100 + RAND() * 900), 3, '0'),
            LPAD(FLOOR(10 + RAND() * 90), 2, '0')
        );
        
        SET v_telefono = CONCAT('664', LPAD(FLOOR(1000000 + RAND() * 8999999), 7, '0'));
        SET v_direccion = CONCAT('Calle ', FLOOR(1 + RAND() * 100), ' #', FLOOR(1 + RAND() * 999), ', Tijuana, BC');
        SET v_ubicacion = IF(RAND() < 0.7, 'Tecnologico', 'Centro de Idiomas');
        SET v_nivel = FLOOR(RAND() * 7);
        
        INSERT INTO DatosPersonales (id_dp, apellidoPaterno, apellidoMaterno, nombre, email, genero, CURP, telefono, direccion)
        VALUES (v_id_dp, v_apellidoP, v_apellidoM, v_nombre, v_email, v_genero, v_CURP, v_telefono, v_direccion);
        
        INSERT INTO Estudiante (nControl, id_dp, ubicacion, id_Nivel, estado)
        VALUES (v_nControl, v_id_dp, v_ubicacion, v_nivel, 'activo');
        
    END WHILE;
    
    SELECT CONCAT('Se insertaron ', i, ' estudiantes exitosamente') AS Resultado;
END$$

DELIMITER ;

CALL InsertarEstudiantesSimple();

DROP PROCEDURE IF EXISTS InsertarEstudiantesSimple;

SELECT COUNT(*) as total_estudiantes FROM Estudiante;
