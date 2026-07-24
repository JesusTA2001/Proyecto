-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: mysql-5e061d7-accitesz-f16a.d.aivencloud.com    Database: proyectoingles
-- ------------------------------------------------------
-- Server version	8.0.45

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
-- Table structure for table `Administrador`
--

DROP TABLE IF EXISTS `Administrador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Administrador` (
  `id_Administrador` int NOT NULL AUTO_INCREMENT,
  `id_empleado` int NOT NULL,
  `estado` enum('activo','inactivo') DEFAULT NULL,
  PRIMARY KEY (`id_Administrador`),
  KEY `id_empleado` (`id_empleado`),
  CONSTRAINT `Administrador_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `Empleado` (`id_empleado`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Asistencia`
--

DROP TABLE IF EXISTS `Asistencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Asistencia` (
  `id_asistencia` int NOT NULL AUTO_INCREMENT,
  `id_Grupo` int DEFAULT NULL,
  `nControl` int DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  PRIMARY KEY (`id_asistencia`),
  KEY `id_Grupo` (`id_Grupo`),
  KEY `nControl` (`nControl`),
  CONSTRAINT `Asistencia_ibfk_1` FOREIGN KEY (`id_Grupo`) REFERENCES `Grupo` (`id_Grupo`),
  CONSTRAINT `Asistencia_ibfk_2` FOREIGN KEY (`nControl`) REFERENCES `Estudiante` (`nControl`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Calificaciones`
--

DROP TABLE IF EXISTS `Calificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Calificaciones` (
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
  CONSTRAINT `Calificaciones_ibfk_1` FOREIGN KEY (`nControl`) REFERENCES `Estudiante` (`nControl`),
  CONSTRAINT `Calificaciones_ibfk_2` FOREIGN KEY (`id_nivel`) REFERENCES `Nivel` (`id_Nivel`),
  CONSTRAINT `Calificaciones_ibfk_3` FOREIGN KEY (`id_Periodo`) REFERENCES `Periodo` (`id_Periodo`),
  CONSTRAINT `Calificaciones_ibfk_4` FOREIGN KEY (`id_Grupo`) REFERENCES `Grupo` (`id_Grupo`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `CatalogoEstudios`
--

DROP TABLE IF EXISTS `CatalogoEstudios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CatalogoEstudios` (
  `id_Estudio` int NOT NULL AUTO_INCREMENT,
  `nivelEstudio` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_Estudio`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Coordinador`
--

DROP TABLE IF EXISTS `Coordi