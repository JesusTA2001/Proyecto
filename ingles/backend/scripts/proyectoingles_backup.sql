use proyectoingles;
drop database proyectoingles;

CREATE DATABASE IF NOT EXISTS proyectoingles
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

USE proyectoingles;

DROP TABLE IF EXISTS datospersonales;
CREATE TABLE datospersonales (
  id_dp int NOT NULL AUTO_INCREMENT,
  apellidoPaterno varchar(50) DEFAULT NULL,
  apellidoMaterno varchar(50) DEFAULT NULL,
  nombre varchar(50) DEFAULT NULL,
  email varchar(100) DEFAULT NULL,
  genero varchar(30) DEFAULT NULL,
  CURP varchar(40) DEFAULT NULL,
  telefono varchar(50) DEFAULT NULL,
  direccion varchar(255) DEFAULT NULL,
  PRIMARY KEY (id_dp)
) ENGINE=InnoDB AUTO_INCREMENT=401 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS catalogoestudios;
CREATE TABLE catalogoestudios (
  id_Estudio int NOT NULL AUTO_INCREMENT,
  nivelEstudio varchar(50) DEFAULT NULL,
  PRIMARY KEY (id_Estudio)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS catalogohorarios;
CREATE TABLE catalogohorarios (
  id_cHorario int NOT NULL AUTO_INCREMENT,
  ubicacion varchar(50) DEFAULT NULL,
  diaSemana varchar(20) DEFAULT NULL,
  hora varchar(20) DEFAULT NULL,
  estado enum('activo','inactivo') DEFAULT NULL,
  PRIMARY KEY (id_cHorario)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS nivel;
CREATE TABLE nivel (
  id_Nivel int NOT NULL,
  nivel varchar(50) DEFAULT NULL,
  PRIMARY KEY (id_Nivel)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS periodo;
CREATE TABLE periodo (
  id_Periodo int NOT NULL,
  descripcion varchar(50) DEFAULT NULL,
  año int DEFAULT NULL,
  PRIMARY KEY (id_Periodo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS empleado;
CREATE TABLE empleado (
  id_empleado int NOT NULL AUTO_INCREMENT,
  id_dp int NOT NULL,
  estado enum('activo','inactivo') DEFAULT NULL,
  RFC varchar(20) DEFAULT NULL,
  PRIMARY KEY (id_empleado),
  KEY id_dp (id_dp),
  CONSTRAINT empleado_ibfk_1 FOREIGN KEY (id_dp) REFERENCES datospersonales (id_dp)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS profesor;
CREATE TABLE profesor (
  id_Profesor int NOT NULL AUTO_INCREMENT,
  id_empleado int NOT NULL,
  ubicacion varchar(50) DEFAULT NULL,
  estado enum('activo','inactivo') DEFAULT NULL,
  nivelEstudio varchar(50) DEFAULT NULL,
  PRIMARY KEY (id_Profesor),
  KEY id_empleado (id_empleado),
  CONSTRAINT profesor_ibfk_1 FOREIGN KEY (id_empleado) REFERENCES empleado (id_empleado)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS estudiante;
CREATE TABLE estudiante (
  nControl int NOT NULL,
  id_dp int NOT NULL,
  estado enum('activo','inactivo') DEFAULT NULL,
  ubicacion varchar(50) DEFAULT NULL,
  id_Nivel int DEFAULT '0',
  PRIMARY KEY (nControl),
  KEY id_dp (id_dp),
  KEY id_Nivel (id_Nivel),
  CONSTRAINT estudiante_ibfk_1 FOREIGN KEY (id_dp) REFERENCES datospersonales (id_dp),
  CONSTRAINT estudiante_ibfk_2 FOREIGN KEY (id_Nivel) REFERENCES nivel (id_Nivel)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS administrador;
CREATE TABLE administrador (
  id_Administrador int NOT NULL AUTO_INCREMENT,
  id_empleado int NOT NULL,
  estado enum('activo','inactivo') DEFAULT NULL,
  PRIMARY KEY (id_Administrador),
  KEY id_empleado (id_empleado),
  CONSTRAINT administrador_ibfk_1 FOREIGN KEY (id_empleado) REFERENCES empleado (id_empleado)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS coordinador;
CREATE TABLE coordinador (
  id_Coordinador int NOT NULL AUTO_INCREMENT,
  id_empleado int NOT NULL,
  estado enum('activo','inactivo') DEFAULT NULL,
  PRIMARY KEY (id_Coordinador),
  KEY id_empleado (id_empleado),
  CONSTRAINT coordinador_ibfk_1 FOREIGN KEY (id_empleado) REFERENCES empleado (id_empleado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS directivo;
CREATE TABLE directivo (
  id_Directivo int NOT NULL AUTO_INCREMENT,
  id_empleado int NOT NULL,
  estado enum('activo','inactivo') DEFAULT NULL,
  PRIMARY KEY (id_Directivo),
  KEY id_empleado (id_empleado),
  CONSTRAINT directivo_ibfk_1 FOREIGN KEY (id_empleado) REFERENCES empleado (id_empleado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS grupo;
CREATE TABLE grupo (
  id_Grupo int NOT NULL AUTO_INCREMENT,
  grupo varchar(50) DEFAULT NULL,
  id_Periodo int DEFAULT NULL,
  id_Profesor int DEFAULT NULL,
  id_Nivel int DEFAULT NULL,
  ubicacion varchar(50) DEFAULT NULL,
  id_cHorario int DEFAULT NULL,
  PRIMARY KEY (id_Grupo),
  KEY id_Periodo (id_Periodo),
  KEY id_Profesor (id_Profesor),
  KEY id_Nivel (id_Nivel),
  KEY id_cHorario (id_cHorario),
  CONSTRAINT grupo_ibfk_1 FOREIGN KEY (id_Periodo) REFERENCES periodo (id_Periodo),
  CONSTRAINT grupo_ibfk_2 FOREIGN KEY (id_Profesor) REFERENCES profesor (id_Profesor),
  CONSTRAINT grupo_ibfk_3 FOREIGN KEY (id_Nivel) REFERENCES nivel (id_Nivel),
  CONSTRAINT grupo_ibfk_4 FOREIGN KEY (id_cHorario) REFERENCES catalogohorarios (id_cHorario)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS preparacion;
CREATE TABLE preparacion (
  id_prep int NOT NULL AUTO_INCREMENT,
  id_Profesor int NOT NULL,
  nivel_Estudio varchar(50) DEFAULT NULL,
  id_Estudio int DEFAULT NULL,
  PRIMARY KEY (id_prep),
  KEY id_Profesor (id_Profesor),
  KEY id_Estudio (id_Estudio),
  CONSTRAINT preparacion_ibfk_1 FOREIGN KEY (id_Profesor) REFERENCES profesor (id_Profesor),
  CONSTRAINT preparacion_ibfk_2 FOREIGN KEY (id_Estudio) REFERENCES catalogoestudios (id_Estudio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS calificaciones;
CREATE TABLE calificaciones (
  id_Calificaciones int NOT NULL AUTO_INCREMENT,
  nControl int NOT NULL,
  parcial1 int DEFAULT NULL,
  parcial2 int DEFAULT NULL,
  parcial3 int DEFAULT NULL,
  final int DEFAULT NULL,
  id_nivel int DEFAULT NULL,
  id_Periodo int DEFAULT NULL,
  id_Grupo int DEFAULT NULL,
  PRIMARY KEY (id_Calificaciones),
  KEY nControl (nControl),
  KEY id_nivel (id_nivel),
  KEY id_Periodo (id_Periodo),
  KEY id_Grupo (id_Grupo),
  CONSTRAINT calificaciones_ibfk_1 FOREIGN KEY (nControl) REFERENCES estudiante (nControl),
  CONSTRAINT calificaciones_ibfk_2 FOREIGN KEY (id_nivel) REFERENCES nivel (id_Nivel),
  CONSTRAINT calificaciones_ibfk_3 FOREIGN KEY (id_Periodo) REFERENCES periodo (id_Periodo),
  CONSTRAINT calificaciones_ibfk_4 FOREIGN KEY (id_Grupo) REFERENCES grupo (id_Grupo)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS asistencia;
CREATE TABLE asistencia (
  id_asistencia int NOT NULL AUTO_INCREMENT,
  id_Grupo int DEFAULT NULL,
  nControl int DEFAULT NULL,
  fecha date DEFAULT NULL,
  PRIMARY KEY (id_asistencia),
  KEY id_Grupo (id_Grupo),
  KEY nControl (nControl),
  CONSTRAINT asistencia_ibfk_1 FOREIGN KEY (id_Grupo) REFERENCES grupo (id_Grupo),
  CONSTRAINT asistencia_ibfk_2 FOREIGN KEY (nControl) REFERENCES estudiante (nControl)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS estudiantegrupo;
CREATE TABLE estudiantegrupo (
  nControl int NOT NULL,
  id_Grupo int NOT NULL,
  estado enum('concluido','actual') DEFAULT NULL,
  PRIMARY KEY (nControl,id_Grupo),
  KEY id_Grupo (id_Grupo),
  CONSTRAINT estudiantegrupo_ibfk_1 FOREIGN KEY (nControl) REFERENCES estudiante (nControl),
  CONSTRAINT estudiantegrupo_ibfk_2 FOREIGN KEY (id_Grupo) REFERENCES grupo (id_Grupo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS estudiantecalificaciones;
CREATE TABLE estudiantecalificaciones (
  nControl int NOT NULL,
  id_Calificaciones int NOT NULL,
  PRIMARY KEY (nControl,id_Calificaciones),
  KEY id_Calificaciones (id_Calificaciones),
  CONSTRAINT estudiantecalificaciones_ibfk_1 FOREIGN KEY (nControl) REFERENCES estudiante (nControl),
  CONSTRAINT estudiantecalificaciones_ibfk_2 FOREIGN KEY (id_Calificaciones) REFERENCES calificaciones (id_Calificaciones)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios (
  id_usuario int NOT NULL AUTO_INCREMENT,
  usuario varchar(50) DEFAULT NULL,
  contraseña varchar(255) DEFAULT NULL,
  rol enum('ADMINISTRADOR','ESTUDIANTE','PROFESOR','COORDINADOR','DIRECTIVO') DEFAULT NULL,
  id_relacion int NOT NULL,
  PRIMARY KEY (id_usuario),
  UNIQUE KEY usuario (usuario)
) ENGINE=InnoDB AUTO_INCREMENT=427 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;