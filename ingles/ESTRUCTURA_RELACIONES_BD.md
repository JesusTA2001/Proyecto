# 📊 ESTRUCTURA DE RELACIONES EN LA BASE DE DATOS

## 🎯 Resumen

La base de datos utiliza una estructura de relaciones consistente para todos los tipos de empleados (profesores, coordinadores y directivos). Todos comparten las mismas tablas base y se diferencian por tablas específicas de rol.

---

## 🏗️ ARQUITECTURA DE RELACIONES

### Estructura General para Empleados

```
usuarios → [tabla_rol] → empleado → datospersonales
```

### Flujo de Datos Completo

```
┌─────────────┐      ┌──────────────┐      ┌──────────┐      ┌─────────────────┐
│  usuarios   │─────▶│  profesor/   │─────▶│ empleado │─────▶│ datospersonales │
│             │      │ coordinador/ │      │          │      │                 │
│ id_relacion │      │  directivo   │      │  id_dp   │      │  id_dp (PK)     │
└─────────────┘      └──────────────┘      └──────────┘      └─────────────────┘
```

---

## 📋 TABLAS PRINCIPALES

### 1. **usuarios**
Tabla de autenticación y control de acceso.

```sql
CREATE TABLE usuarios (
  id_usuario INT PRIMARY KEY AUTO_INCREMENT,
  usuario VARCHAR(50) UNIQUE,
  contraseña VARCHAR(255),
  rol ENUM('ADMINISTRADOR','ESTUDIANTE','PROFESOR','COORDINADOR','DIRECTIVO'),
  id_relacion INT NOT NULL
);
```

**Campos importantes:**
- `id_relacion`: Apunta al ID de la tabla específica del rol (id_Profesor, id_Coordinador, id_Directivo)

---

### 2. **profesor / coordinador / directivo**
Tablas específicas por rol con información del puesto.

```sql
-- PROFESORES
CREATE TABLE profesor (
  id_Profesor INT PRIMARY KEY AUTO_INCREMENT,
  id_empleado INT NOT NULL,
  ubicacion VARCHAR(50),
  estado ENUM('activo','inactivo'),
  nivelEstudio VARCHAR(50),
  FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado)
);

-- COORDINADORES
CREATE TABLE coordinador (
  id_Coordinador INT PRIMARY KEY AUTO_INCREMENT,
  id_empleado INT NOT NULL,
  estado ENUM('activo','inactivo'),
  FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado)
);

-- DIRECTIVOS
CREATE TABLE directivo (
  id_Directivo INT PRIMARY KEY AUTO_INCREMENT,
  id_empleado INT NOT NULL,
  estado ENUM('activo','inactivo'),
  FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado)
);
```

---

### 3. **empleado**
Tabla de información laboral compartida.

```sql
CREATE TABLE empleado (
  id_empleado INT PRIMARY KEY AUTO_INCREMENT,
  id_dp INT NOT NULL,
  estado ENUM('activo','inactivo'),
  RFC VARCHAR(20),
  FOREIGN KEY (id_dp) REFERENCES datospersonales(id_dp)
);
```

**Función:**
- Contiene información laboral común a todos los empleados
- Conecta con los datos personales a través de `id_dp`

---

### 4. **datospersonales**
Tabla con información personal del empleado.

```sql
CREATE TABLE datospersonales (
  id_dp INT PRIMARY KEY AUTO_INCREMENT,
  apellidoPaterno VARCHAR(50),
  apellidoMaterno VARCHAR(50),
  nombre VARCHAR(50),
  email VARCHAR(100),
  genero VARCHAR(30),
  CURP VARCHAR(40),
  telefono VARCHAR(50),
  direccion VARCHAR(255)
);
```

---

## 🔗 EJEMPLOS DE RELACIONES

### Ejemplo 1: Profesor

```sql
-- 1. Usuario de login
usuarios.id_usuario = 401
usuarios.usuario = 'prof1'
usuarios.rol = 'PROFESOR'
usuarios.id_relacion = 1  ──┐
                             │
-- 2. Información del profesor    │
profesor.id_Profesor = 1  ◄──┘
profesor.id_empleado = 1  ──┐
profesor.ubicacion = 'Nodo'  │
profesor.nivelEstudio = 'Maestría'
                             │
-- 3. Información laboral        │
empleado.id_empleado = 1  ◄──┘
empleado.id_dp = 1  ──┐
empleado.RFC = 'SF0S22O08S24G'
                      │
-- 4. Datos personales      │
datospersonales.id_dp = 1  ◄──┘
datospersonales.nombre = 'Humberto'
datospersonales.apellidoPaterno = 'Menchaca'
datospersonales.email = 'francisco44@example.org'
```

### Ejemplo 2: Coordinador

```sql
-- 1. Usuario de login
usuarios.id_usuario = 430
usuarios.usuario = 'coord1'
usuarios.rol = 'COORDINADOR'
usuarios.id_relacion = 1  ──┐
                             │
-- 2. Información del coordinador │
coordinador.id_Coordinador = 1  ◄──┘
coordinador.id_empleado = 54  ──┐
coordinador.estado = 'activo'    │
                                 │
-- 3. Información laboral        │
empleado.id_empleado = 54  ◄──┘
empleado.id_dp = 54  ──┐
empleado.RFC = 'COORD54XXX'
                        │
-- 4. Datos personales          │
datospersonales.id_dp = 54  ◄──┘
datospersonales.nombre = 'Carlos'
datospersonales.apellidoPaterno = 'García'
datospersonales.email = 'coord1@teczamora.edu.mx'
```

### Ejemplo 3: Directivo

```sql
-- 1. Usuario de login
usuarios.id_usuario = 439
usuarios.usuario = 'dir1'
usuarios.rol = 'DIRECTIVO'
usuarios.id_relacion = 1  ──┐
                             │
-- 2. Información del directivo  │
directivo.id_Directivo = 1  ◄──┘
directivo.id_empleado = 63  ──┐
directivo.estado = 'activo'    │
                               │
-- 3. Información laboral       │
empleado.id_empleado = 63  ◄──┘
empleado.id_dp = 63  ──┐
empleado.RFC = 'DIR63XXX'
                        │
-- 4. Datos personales          │
datospersonales.id_dp = 63  ◄──┘
datospersonales.nombre = 'Guillermo'
datospersonales.apellidoPaterno = 'Sandoval'
datospersonales.email = 'dir1@teczamora.edu.mx'
```

---

## 📊 CONSULTAS ÚTILES

### Obtener información completa de un PROFESOR

```sql
SELECT 
  u.id_usuario,
  u.usuario,
  u.rol,
  p.id_Profesor,
  p.ubicacion,
  p.nivelEstudio,
  e.RFC,
  dp.nombre,
  dp.apellidoPaterno,
  dp.apellidoMaterno,
  dp.email,
  dp.telefono,
  dp.CURP
FROM usuarios u
INNER JOIN profesor p ON u.id_relacion = p.id_Profesor
INNER JOIN empleado e ON p.id_empleado = e.id_empleado
INNER JOIN datospersonales dp ON e.id_dp = dp.id_dp
WHERE u.usuario = 'prof1';
```

### Obtener información completa de un COORDINADOR

```sql
SELECT 
  u.id_usuario,
  u.usuario,
  u.rol,
  c.id_Coordinador,
  c.estado,
  e.RFC,
  dp.nombre,
  dp.apellidoPaterno,
  dp.apellidoMaterno,
  dp.email,
  dp.telefono,
  dp.CURP
FROM usuarios u
INNER JOIN coordinador c ON u.id_relacion = c.id_Coordinador
INNER JOIN empleado e ON c.id_empleado = e.id_empleado
INNER JOIN datospersonales dp ON e.id_dp = dp.id_dp
WHERE u.usuario = 'coord1';
```

### Obtener información completa de un DIRECTIVO

```sql
SELECT 
  u.id_usuario,
  u.usuario,
  u.rol,
  d.id_Directivo,
  d.estado,
  e.RFC,
  dp.nombre,
  dp.apellidoPaterno,
  dp.apellidoMaterno,
  dp.email,
  dp.telefono,
  dp.CURP
FROM usuarios u
INNER JOIN directivo d ON u.id_relacion = d.id_Directivo
INNER JOIN empleado e ON d.id_empleado = e.id_empleado
INNER JOIN datospersonales dp ON e.id_dp = dp.id_dp
WHERE u.usuario = 'dir1';
```

### Listar TODOS los empleados (Profesores, Coordinadores, Directivos)

```sql
-- Profesores
SELECT 
  'PROFESOR' as tipo,
  u.usuario,
  CONCAT(dp.nombre, ' ', dp.apellidoPaterno, ' ', dp.apellidoMaterno) as nombre_completo,
  dp.email,
  p.ubicacion,
  p.nivelEstudio as info_adicional
FROM usuarios u
INNER JOIN profesor p ON u.id_relacion = p.id_Profesor
INNER JOIN empleado e ON p.id_empleado = e.id_empleado
INNER JOIN datospersonales dp ON e.id_dp = dp.id_dp
WHERE u.rol = 'PROFESOR'

UNION ALL

-- Coordinadores
SELECT 
  'COORDINADOR' as tipo,
  u.usuario,
  CONCAT(dp.nombre, ' ', dp.apellidoPaterno, ' ', dp.apellidoMaterno) as nombre_completo,
  dp.email,
  'N/A' as ubicacion,
  c.estado as info_adicional
FROM usuarios u
INNER JOIN coordinador c ON u.id_relacion = c.id_Coordinador
INNER JOIN empleado e ON c.id_empleado = e.id_empleado
INNER JOIN datospersonales dp ON e.id_dp = dp.id_dp
WHERE u.rol = 'COORDINADOR'

UNION ALL

-- Directivos
SELECT 
  'DIRECTIVO' as tipo,
  u.usuario,
  CONCAT(dp.nombre, ' ', dp.apellidoPaterno, ' ', dp.apellidoMaterno) as nombre_completo,
  dp.email,
  'N/A' as ubicacion,
  d.estado as info_adicional
FROM usuarios u
INNER JOIN directivo d ON u.id_relacion = d.id_Directivo
INNER JOIN empleado e ON d.id_empleado = e.id_empleado
INNER JOIN datospersonales dp ON e.id_dp = dp.id_dp
WHERE u.rol = 'DIRECTIVO'

ORDER BY tipo, usuario;
```

---

## 🎯 ESTADO ACTUAL

### Usuarios en el Sistema

| Rol | Cantidad | Estado |
|-----|----------|--------|
| ESTUDIANTE | 301 | ✅ Con datos personales (tabla estudiante) |
| PROFESOR | 21 | ✅ Con datos personales completos |
| COORDINADOR | 9 | ✅ Con datos personales completos |
| DIRECTIVO | 3 | ✅ Con datos personales completos |
| ADMINISTRADOR | 6 | ⚠️ Verificar estructura |

### Coordinadores Registrados

| Usuario | Nombre | Email |
|---------|--------|-------|
| coord1 | Carlos García López | coord1@teczamora.edu.mx |
| coord2 | María Martínez Sánchez | coord2@teczamora.edu.mx |
| coord3 | Juan Hernández Ramírez | coord3@teczamora.edu.mx |
| coord4 | Ana López Gómez | coord4@teczamora.edu.mx |
| coord5 | Pedro Rodríguez Pérez | coord5@teczamora.edu.mx |
| coord6 | Sandra Díaz García | coord6@teczamora.edu.mx |
| coord7 | Ricardo Morales Silva | coord7@teczamora.edu.mx |
| coord8 | Patricia Flores Mendoza | coord8@teczamora.edu.mx |
| coord9 | Fernando Ríos Castro | coord9@teczamora.edu.mx |

### Directivos Registrados

| Usuario | Nombre | Email |
|---------|--------|-------|
| dir1 | Guillermo Sandoval Cruz | dir1@teczamora.edu.mx |
| dir2 | Rosario Delgado Vázquez | dir2@teczamora.edu.mx |
| dir3 | Miguel Torres Núñez | dir3@teczamora.edu.mx |

---

## ✅ VERIFICACIÓN DE INTEGRIDAD

Para verificar que todos los usuarios tienen sus datos personales correctamente relacionados:

```sql
-- Verificar usuarios sin datos personales
SELECT 
  u.rol,
  COUNT(*) as total_usuarios,
  SUM(CASE WHEN dp.id_dp IS NULL THEN 1 ELSE 0 END) as sin_datos_personales,
  SUM(CASE WHEN dp.id_dp IS NOT NULL THEN 1 ELSE 0 END) as con_datos_personales
FROM usuarios u
LEFT JOIN (
  -- Profesores
  SELECT u.id_usuario, dp.id_dp
  FROM usuarios u
  INNER JOIN profesor p ON u.id_relacion = p.id_Profesor
  INNER JOIN empleado e ON p.id_empleado = e.id_empleado
  INNER JOIN datospersonales dp ON e.id_dp = dp.id_dp
  WHERE u.rol = 'PROFESOR'
  
  UNION ALL
  
  -- Coordinadores
  SELECT u.id_usuario, dp.id_dp
  FROM usuarios u
  INNER JOIN coordinador c ON u.id_relacion = c.id_Coordinador
  INNER JOIN empleado e ON c.id_empleado = e.id_empleado
  INNER JOIN datospersonales dp ON e.id_dp = dp.id_dp
  WHERE u.rol = 'COORDINADOR'
  
  UNION ALL
  
  -- Directivos
  SELECT u.id_usuario, dp.id_dp
  FROM usuarios u
  INNER JOIN directivo d ON u.id_relacion = d.id_Directivo
  INNER JOIN empleado e ON d.id_empleado = e.id_empleado
  INNER JOIN datospersonales dp ON e.id_dp = dp.id_dp
  WHERE u.rol = 'DIRECTIVO'
) dp ON u.id_usuario = dp.id_usuario
WHERE u.rol IN ('PROFESOR', 'COORDINADOR', 'DIRECTIVO')
GROUP BY u.rol;
```

---

## 📝 NOTAS IMPORTANTES

1. **Consistencia**: La misma estructura se aplica a profesores, coordinadores y directivos.
2. **Escalabilidad**: Si se agregan nuevos roles de empleados, deben seguir el mismo patrón.
3. **Integridad referencial**: Todas las Foreign Keys garantizan la integridad de los datos.
4. **Contraseñas**: Todos los usuarios tienen la contraseña hasheada con bcrypt (password: 123456).

---

## 🛠️ SCRIPTS DISPONIBLES

### Verificar estructura completa
```bash
node backend/scripts/analizar_estructura_v2.js
```

### Ver relaciones detalladas
```bash
node backend/scripts/analizar_relaciones.js
```

### Verificar datos personales
```bash
node backend/scripts/verificar_datos_personales.js
```

### Completar datos faltantes (si es necesario)
```bash
node backend/scripts/completar_datos_coord_dir.js
```

---

**Fecha de actualización:** 26 de enero de 2026  
**Estado:** ✅ Todos los coordinadores y directivos tienen datos personales completos
