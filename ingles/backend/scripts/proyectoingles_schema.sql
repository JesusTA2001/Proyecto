-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: proyectoingles
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `proyectoingles`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `proyectoingles` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `proyectoingles`;

--
-- Table structure for table `datospersonales`
--

DROP TABLE IF EXISTS `datospersonales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `datospersonales` (
  `id_dp` int NOT NULL AUTO_INCREMENT,
  `apellidoPaterno` varchar(50) DEFAULT NULL,
  `apellidoMaterno` varchar(50) DEFAULT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `genero` varchar(30) DEFAULT NULL,
  `CURP` varchar(40) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_dp`)
) ENGINE=InnoDB AUTO_INCREMENT=401 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--


--
-- Table structure for table `catalogoestudios`
--

DROP TABLE IF EXISTS `catalogoestudios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catalogoestudios` (
  `id_Estudio` int NOT NULL AUTO_INCREMENT,
  `nivelEstudio` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_Estudio`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--


--
-- Table structure for table `catalogohorarios`
--

DROP TABLE IF EXISTS `catalogohorarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catalogohorarios` (
  `id_cHorario` int NOT NULL AUTO_INCREMENT,
  `ubicacion` varchar(50) DEFAULT NULL,
  `diaSemana` varchar(20) DEFAULT NULL,
  `hora` varchar(20) DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT NULL,
  PRIMARY KEY (`id_cHorario`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--


--
-- Table structure for table `nivel`
--

DROP TABLE IF EXISTS `nivel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nivel` (
  `id_Nivel` int NOT NULL,
  `nivel` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_Nivel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--


--
-- Table structure for table `periodo`
--

DROP TABLE IF EXISTS `periodo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `periodo` (
  `id_Periodo` int NOT NULL,
  `descripcion` varchar(50) DEFAULT NULL,
  `año` int DEFAULT NULL,
  PRIMARY KEY (`id_Periodo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--


--
-- Table structure for table `empleado`
--

DROP TABLE IF EXISTS `empleado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empleado` (
  `id_empleado` int NOT NULL AUTO_INCREMENT,
  `id_dp` int NOT NULL,
  `estado` enum('activo','inactivo') DEFAULT NULL,
  `RFC` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_empleado`),
  KEY `id_dp` (`id_dp`),
  CONSTRAINT `empleado_ibfk_1` FOREIGN KEY (`id_dp`) REFERENCES `datospersonales` (`id_dp`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--


--
-- Table structure for table `profesor`
--

DROP TABLE IF EXISTS `profesor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profesor` (
  `id_Profesor` int NOT NULL AUTO_INCREMENT,
  `id_empleado` int NOT NULL,
  `ubicacion` varchar(50) DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT NULL,
  `nivelEstudio` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_Profesor`),
  KEY `id_empleado` (`id_empleado`),
  CONSTRAINT `profesor_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id_empleado`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--


--
-- Table structure for table `estudiante`
--

DROP TABLE IF EXISTS `estudiante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estudiante` (
  `nControl` int NOT NULL,
  `id_dp` int NOT NULL,
  `estado` enum('activo','inactivo') DEFAULT NULL,
  `ubicacion` varchar(50) DEFAULT NULL,
  `id_Nivel` int DEFAULT '0',
  PRIMARY KEY (`nControl`),
  KEY `id_dp` (`id_dp`),
  KEY `id_Nivel` (`id_Nivel`),
  CONSTRAINT `estudiante_ibfk_1` FOREIGN KEY (`id_dp`) REFERENCES `datospersonales` (`id_dp`),
  CONSTRAINT `estudiante_ibfk_2` FOREIGN KEY (`id_Nivel`) REFERENCES `nivel` (`id_Nivel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--


--
-- Table structure for table `administrador`
--

DROP TABLE IF EXISTS `administrador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administrador` (
  `id_Administrador` int NOT NULL AUTO_INCREMENT,
  `id_empleado` int NOT NULL,
  `estado` enum('activo','inactivo') DEFAULT NULL,
  PRIMARY KEY (`id_Administrador`),
  KEY `id_empleado` (`id_empleado`),
  CONSTRAINT `administrador_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id_empleado`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--


--
-- Table structure for table `coordinador`
--

DROP TABLE IF EXISTS `coordinador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coordinador` (
  `id_Coordinador` int NOT NULL AUTO_INCREMENT,
  `id_empleado` int NOT NULL,
  `estado` enum('activo','inactivo') DEFAULT NULL,
  PRIMARY KEY (`id_Coordinador`),
  KEY `id_empleado` (`id_empleado`),
  CONSTRAINT `coordinador_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id_empleado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--


--
-- Table structure for table `directivo`
--

DROP TABLE IF EXISTS `directivo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `directivo` (
  `id_Directivo` int NOT NULL AUTO_INCREMENT,
  `id_empleado` int NOT NULL,
  `estado` enum('activo','inactivo') DEFAULT NULL,
  PRIMARY KEY (`id_Directivo`),
  KEY `id_empleado` (`id_empleado`),
  CONSTRAINT `directivo_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id_empleado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--


--
-- Table structure for table `grupo`
--

DROP TABLE IF EXISTS `grupo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grupo` (
  `id_Grupo` int NOT NULL AUTO_INCREMENT,
  `grupo` varchar(50) DEFAULT NULL,
  `id_Periodo` int DEFAULT NULL,
  `id_Profesor` int DEFAULT NULL,
  `id_Nivel` int DEFAULT NULL,
  `ubicacion` varchar(50) DEFAULT NULL,
  `id_cHorario` int DEFAULT NULL,
  PRIMARY KEY (`id_Grupo`),
  KEY `id_Periodo` (`id_Periodo`),
  KEY `id_Profesor` (`id_Profesor`),
  KEY `id_Nivel` (`id_Nivel`),
  KEY `id_cHorario` (`id_cHorario`),
  CONSTRAINT `grupo_ibfk_1` FOREIGN KEY (`id_Periodo`) REFERENCES `periodo` (`id_Periodo`),
  CONSTRAINT `grupo_ibfk_2` FOREIGN KEY (`id_Profesor`) REFERENCES `profesor` (`id_Profesor`),
  CONSTRAINT `grupo_ibfk_3` FOREIGN KEY (`id_Nivel`) REFERENCES `nivel` (`id_Nivel`),
  CONSTRAINT `grupo_ibfk_4` FOREIGN KEY (`id_cHorario`) REFERENCES `catalogohorarios` (`id_cHorario`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--


--
-- Table structure for table `preparacion`
--

DROP TABLE IF EXISTS `preparacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preparacion` (
  `id_prep` int NOT NULL AUTO_INCREMENT,
  `id_Profesor` int NOT NULL,
  `nivel_Estudio` varchar(50) DEFAULT NULL,
  `id_Estudio` int DEFAULT NULL,
  PRIMARY KEY (`id_prep`),
  KEY `id_Profesor` (`id_Profesor`),
  KEY `id_Estudio` (`id_Estudio`),
  CONSTRAINT `preparacion_ibfk_1` FOREIGN KEY (`id_Profesor`) REFERENCES `profesor` (`id_Profesor`),
  CONSTRAINT `preparacion_ibfk_2` FOREIGN KEY (`id_Estudio`) REFERENCES `catalogoestudios` (`id_Estudio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--


--
-- Table structure for table `calificaciones`
--

DROP TABLE IF EXISTS `calificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calificaciones` (
  `id_Calificaciones` int NOT NULL AUTO_INCREMENT,
  `nControl` int NOT NULL,
  `parcial1` int DEFAULT NULL,
  `parcial2` int DEFAULT NULL,
  `parcial3` int DEFAULT NULL,
  `final` int DEFAULT NULL,
  `id_nivel` int DEFAULT NULL,
  `id_Periodo` int DEFAULT NULL,
  `id_Grupo` int DEFAULT NULL,
  PRIMARY KEY (`id_Calificaciones`),
  KEY `nControl` (`nControl`),
  KEY `id_nivel` (`id_nivel`),
  KEY `id_Periodo` (`id_Periodo`),
  KEY `id_Grupo` (`id_Grupo`),
  CONSTRAINT `calificaciones_ibfk_1` FOREIGN KEY (`nControl`) REFERENCES `estudiante` (`nControl`),
  CONSTRAINT `calificaciones_ibfk_2` FOREIGN KEY (`id_nivel`) REFERENCES `nivel` (`id_Nivel`),
  CONSTRAINT `calificaciones_ibfk_3` FOREIGN KEY (`id_Periodo`) REFERENCES `periodo` (`id_Periodo`),
  CONSTRAINT `calificaciones_ibfk_4` FOREIGN KEY (`id_Grupo`) REFERENCES `grupo` (`id_Grupo`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--


--
-- Table structure for table `asistencia`
--

DROP TABLE IF EXISTS `asistencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asistencia` (
  `id_asistencia` int NOT NULL AUTO_INCREMENT,
  `id_Grupo` int DEFAULT NULL,
  `nControl` int DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  PRIMARY KEY (`id_asistencia`),
  KEY `id_Grupo` (`id_Grupo`),
  KEY `nControl` (`nControl`),
  CONSTRAINT `asistencia_ibfk_1` FOREIGN KEY (`id_Grupo`) REFERENCES `grupo` (`id_Grupo`),
  CONSTRAINT `asistencia_ibfk_2` FOREIGN KEY (`nControl`) REFERENCES `estudiante` (`nControl`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--


--
-- Table structure for table `estudiantegrupo`
--

DROP TABLE IF EXISTS `estudiantegrupo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estudiantegrupo` (
  `nControl` int NOT NULL,
  `id_Grupo` int NOT NULL,
  `estado` enum('concluido','actual') DEFAULT NULL,
  PRIMARY KEY (`nControl`,`id_Grupo`),
  KEY `id_Grupo` (`id_Grupo`),
  CONSTRAINT `estudiantegrupo_ibfk_1` FOREIGN KEY (`nControl`) REFERENCES `estudiante` (`nControl`),
  CONSTRAINT `estudiantegrupo_ibfk_2` FOREIGN KEY (`id_Grupo`) REFERENCES `grupo` (`id_Grupo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--


--
-- Table structure for table `estudiantecalificaciones`
--

DROP TABLE IF EXISTS `estudiantecalificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estudiantecalificaciones` (
  `nControl` int NOT NULL,
  `id_Calificaciones` int NOT NULL,
  PRIMARY KEY (`nControl`,`id_Calificaciones`),
  KEY `id_Calificaciones` (`id_Calificaciones`),
  CONSTRAINT `estudiantecalificaciones_ibfk_1` FOREIGN KEY (`nControl`) REFERENCES `estudiante` (`nControl`),
  CONSTRAINT `estudiantecalificaciones_ibfk_2` FOREIGN KEY (`id_Calificaciones`) REFERENCES `calificaciones` (`id_Calificaciones`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--


--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `usuario` varchar(50) DEFAULT NULL,
  `contraseña` varchar(255) DEFAULT NULL,
  `rol` enum('ADMINISTRADOR','ESTUDIANTE','PROFESOR','COORDINADOR','DIRECTIVO') DEFAULT NULL,
  `id_relacion` int NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `usuario` (`usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=427 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--


--
-- Dumping events for database 'proyectoingles'
--

--
-- Dumping routines for database 'proyectoingles'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-28 20:15:08
