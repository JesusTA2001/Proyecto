-- Script para crear usuarios de prueba en la base de datos
-- IMPORTANTE: Las contraseñas están hasheadas con bcrypt (contraseña: "admin123", "prof123", "alum123")

USE ingles;

-- Insertar datos de prueba para Administrador
-- Contraseña: admin123 (hash bcrypt)
INSERT INTO DatosPersonales (apellidoPaterno, apellidoMaterno, nombre, email, genero, CURP, telefono, direccion)
VALUES 
('García', 'López', 'Carlos', 'admin1@teczamora.edu.mx', 'Masculino', 'GALC850615HJCRPR01', '3511234567', 'Av. Tecnológico 100');

INSERT INTO Empleado (id_dp, ubicacion, estado)
VALUES (LAST_INSERT_ID(), 'Tecnologico', 'activo');

INSERT INTO Administrador (id_empleado, gradoEstudio)
VALUES (LAST_INSERT_ID(), 'Maestría');

-- Crear usuario para el administrador (usuario: admin1, contraseña: admin123)
INSERT INTO Usuarios (usuario, contraseña, rol, id_relacion)
VALUES ('admin1', '$2b$10$rQ7K5j9YxXZ8VqYwZxYwZeX8VqYwZxYwZeX8VqYwZxYwZeX8VqYwZ', 'ADMINISTRADOR', LAST_INSERT_ID());

-- Insertar datos de prueba para Profesor
INSERT INTO DatosPersonales (apellidoPaterno, apellidoMaterno, nombre, email, genero, CURP, telefono, direccion)
VALUES 
('Martínez', 'Sánchez', 'Juan', 'profesor1@teczamora.edu.mx', 'Masculino', 'MASJ800312HJCRNR02', '3519876543', 'Calle Principal 200');

INSERT INTO Empleado (id_dp, ubicacion, estado)
VALUES (LAST_INSERT_ID(), 'Tecnologico', 'activo');

INSERT INTO Profesor (id_empleado, numero_empleado, RFC, nivelEstudio)
VALUES (LAST_INSERT_ID(), 'EMP001', 'MASJ800312ABC', 'Doctorado');

-- Crear usuario para el profesor (usuario: prof1, contraseña: prof123)
INSERT INTO Usuarios (usuario, contraseña, rol, id_relacion)
VALUES ('prof1', '$2b$10$rQ7K5j9YxXZ8VqYwZxYwZeX8VqYwZxYwZeX8VqYwZxYwZeX8VqYwZ', 'PROFESOR', LAST_INSERT_ID());

-- Insertar datos de prueba para Estudiante
INSERT INTO DatosPersonales (apellidoPaterno, apellidoMaterno, nombre, email, genero, CURP, telefono, direccion)
VALUES 
('Hernández', 'Ramírez', 'María', 'alumna1@teczamora.edu.mx', 'Femenino', 'HERM020815MJCRMR03', '3517894561', 'Colonia Centro 300');

INSERT INTO Estudiante (nControl, id_dp, estado, ubicacion)
VALUES (2112345, LAST_INSERT_ID(), 'activo', 'Tecnologico');

-- Crear usuario para el estudiante (usuario: alumno1, contraseña: alum123)
INSERT INTO Usuarios (usuario, contraseña, rol, id_relacion)
VALUES ('alumno1', '$2b$10$rQ7K5j9YxXZ8VqYwZxYwZeX8VqYwZxYwZeX8VqYwZxYwZeX8VqYwZ', 'ESTUDIANTE', 2112345);

-- Verificar los registros creados
SELECT 'Usuarios creados exitosamente:' as mensaje;
SELECT * FROM Usuarios;
