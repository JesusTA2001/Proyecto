# 📚 SISTEMA DE PREPARACIÓN ACADÉMICA - PROFESORES

## 🏗️ Nueva Estructura de Tablas

### 1. CatalogoEstudios
Almacena los **niveles generales** de estudio (catálogo estandarizado).

```sql
CREATE TABLE CatalogoEstudios (
    id_Estudio INT AUTO_INCREMENT PRIMARY KEY,
    nivelEstudio VARCHAR(50) UNIQUE NOT NULL
);
```

**Niveles disponibles:**
| ID | Nivel Estudio |
|----|---------------|
| 1  | Licenciatura |
| 2  | Maestría |
| 3  | Doctorado |
| 4  | Diplomado |
| 5  | Especialidad |
| 6  | Técnico Superior |

---

### 2. Preparacion
Almacena los **estudios específicos** de cada profesor (múltiples registros por profesor).

```sql
CREATE TABLE Preparacion (
    id_prep INT AUTO_INCREMENT PRIMARY KEY,
    id_Profesor INT NOT NULL,
    id_Estudio INT NOT NULL,              -- Referencia al nivel (Licenciatura, Maestría, etc.)
    titulo VARCHAR(200) NOT NULL,          -- Título específico (texto libre)
    institucion VARCHAR(200),              -- Universidad/Instituto
    año_obtencion YEAR,                    -- Año de obtención
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_Profesor) REFERENCES Profesor(id_Profesor) ON DELETE CASCADE,
    FOREIGN KEY (id_Estudio) REFERENCES CatalogoEstudios(id_Estudio)
);
```

---

### 3. Profesor (Actualizada)
```sql
CREATE TABLE Profesor (
    id_Profesor INT AUTO_INCREMENT PRIMARY KEY,
    id_empleado INT NOT NULL,
    ubicacion VARCHAR(50),
    estado ENUM('activo','inactivo'),
    nivelEstudio VARCHAR(50),  -- ⚠️ OBSOLETO - Usar tabla Preparacion
    FOREIGN KEY (id_empleado) REFERENCES Empleado(id_empleado)
);
```

**Nota:** El campo `nivelEstudio` se mantiene por compatibilidad pero está marcado como obsoleto.

---

## 📝 Ejemplos de Uso

### Ejemplo 1: Profesor con múltiples estudios

```sql
-- Profesor ID 1: María García
INSERT INTO Preparacion (id_Profesor, id_Estudio, titulo, institucion, año_obtencion) VALUES
(1, 1, 'Licenciada en Idioma Inglés', 'UNAM', 2015),
(1, 2, 'Maestría en Lingüística Aplicada', 'IPN', 2018),
(1, 4, 'Diplomado en Pedagogía Moderna', 'ITESM', 2020);
```

### Ejemplo 2: Profesor con estudios técnicos

```sql
-- Profesor ID 2: Juan Pérez
INSERT INTO Preparacion (id_Profesor, id_Estudio, titulo, institucion, año_obtencion) VALUES
(2, 1, 'Ingeniero en Sistemas Computacionales', 'IPN', 2012),
(2, 2, 'Maestría en Ciencias de la Computación', 'UNAM', 2015),
(2, 5, 'Especialidad en Inteligencia Artificial', 'ITESM', 2017);
```

### Ejemplo 3: Profesor con diplomados especializados

```sql
-- Profesor ID 3: Ana López
INSERT INTO Preparacion (id_Profesor, id_Estudio, titulo, institucion, año_obtencion) VALUES
(3, 1, 'Licenciada en Letras Inglesas', 'UAM', 2010),
(3, 4, 'Diplomado en Enseñanza del Inglés como Segunda Lengua', 'UNAM', 2012),
(3, 4, 'Diplomado en Evaluación Educativa', 'IPN', 2014),
(3, 2, 'Maestría en Educación', 'UPN', 2016);
```

---

## 🔍 Consultas SQL Útiles

### Ver todos los estudios de un profesor

```sql
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
```

### Ver profesores con Maestría

```sql
SELECT DISTINCT
    pr.id_Profesor,
    CONCAT(dp.nombre, ' ', dp.ape_paterno, ' ', dp.ape_materno) AS nombre_profesor,
    GROUP_CONCAT(p.titulo SEPARATOR ' | ') AS estudios
FROM Profesor pr
JOIN Empleado e ON pr.id_empleado = e.id_empleado
JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
JOIN Preparacion p ON pr.id_Profesor = p.id_Profesor
JOIN CatalogoEstudios ce ON p.id_Estudio = ce.id_Estudio
WHERE ce.nivelEstudio = 'Maestría'
GROUP BY pr.id_Profesor, nombre_profesor;
```

### Contar profesores por nivel de estudios

```sql
SELECT 
    ce.nivelEstudio,
    COUNT(DISTINCT p.id_Profesor) AS cantidad_profesores
FROM Preparacion p
JOIN CatalogoEstudios ce ON p.id_Estudio = ce.id_Estudio
GROUP BY ce.nivelEstudio
ORDER BY cantidad_profesores DESC;
```

### Ver el nivel más alto de estudios de cada profesor

```sql
SELECT 
    pr.id_Profesor,
    CONCAT(dp.nombre, ' ', dp.ape_paterno) AS nombre_profesor,
    ce.nivelEstudio AS nivel_mas_alto,
    p.titulo
FROM Profesor pr
JOIN Empleado e ON pr.id_empleado = e.id_empleado
JOIN DatosPersonales dp ON e.id_dp = dp.id_dp
JOIN Preparacion p ON pr.id_Profesor = p.id_Profesor
JOIN CatalogoEstudios ce ON p.id_Estudio = ce.id_Estudio
WHERE ce.id_Estudio = (
    SELECT MAX(ce2.id_Estudio)
    FROM Preparacion p2
    JOIN CatalogoEstudios ce2 ON p2.id_Estudio = ce2.id_Estudio
    WHERE p2.id_Profesor = pr.id_Profesor
);
```

---

## 🎯 Endpoints API Sugeridos

### GET /api/profesores/:id/estudios
Obtener todos los estudios de un profesor.

### POST /api/profesores/:id/estudios
Agregar un nuevo estudio a un profesor.

**Body:**
```json
{
  "id_Estudio": 2,
  "titulo": "Maestría en Lingüística Aplicada",
  "institucion": "IPN",
  "año_obtencion": 2018
}
```

### PUT /api/estudios/:id
Actualizar información de un estudio específico.

### DELETE /api/estudios/:id
Eliminar un estudio específico.

### GET /api/catalogoestudios
Obtener el catálogo completo de niveles de estudio.

---

## ✅ Ventajas de esta Estructura

✅ **Flexibilidad:** Texto libre para títulos específicos  
✅ **Organización:** Catálogo estandarizado para niveles generales  
✅ **Múltiples estudios:** Un profesor puede tener varios registros  
✅ **Información completa:** Incluye institución y año  
✅ **Fácil consulta:** Filtrar por nivel de estudios  
✅ **Escalable:** Fácil agregar nuevos niveles al catálogo  

---

## 📋 Archivos Generados

1. **actualizar_sistema_estudios.sql** - Script SQL para BD local
2. **actualizar_sistema_estudios_azure.sql** - Script SQL para Azure
3. **actualizar_sistema_estudios_azure.js** - Script Node.js para ejecutar en Azure

---

## 🚀 Pasos de Implementación

### Para Base de Datos Local:
```bash
mysql -u root -p proyectoIngles < actualizar_sistema_estudios.sql
```

### Para Azure (YA EJECUTADO):
```bash
node migrar_sistema_estudios_final.js
```

### Para consultar el sistema:
```bash
node consultar_sistema_estudios.js
```

---

## ✅ Estado de Implementación

**Fecha de creación:** 10 de marzo de 2026  
**Fecha de implementación en Azure:** 10 de marzo de 2026  
**Estado:** ✅ Implementado y funcionando en Azure MySQL

### Cambios aplicados en Azure:
- ✅ Tabla `CatalogoEstudios` actualizada (columna `Nombre` → `nivelEstudio`)
- ✅ 6 niveles de estudio disponibles
- ✅ Tabla `Preparacion` actualizada con campos: `titulo`, `institucion`, `año_obtencion`, `created_at`
- ✅ Columna redundante `nivel_Estudio` eliminada de `Preparacion`
- ✅ Índices agregados para optimizar consultas
- ✅ Campo `nivelEstudio` en `Profesor` marcado como obsoleto

---

## 📁 Archivos Generados

### Scripts SQL:
- `actualizar_sistema_estudios.sql` - Para base de datos local
- `actualizar_sistema_estudios_azure.sql` - SQL compacto para Azure

### Scripts JavaScript:
- `migrar_sistema_estudios_final.js` - Migración ejecutada en Azure ✅
- `verificar_estructura_estudios.js` - Verificar estructura actual
- `consultar_sistema_estudios.js` - Consultar catálogo y estructura

### Documentación:
- `SISTEMA_PREPARACION_ACADEMICA.md` - Este documento
