# 🎯 SOLUCIÓN: Relaciones de Coordinadores y Directivos

## 📋 Resumen Ejecutivo

**Problema inicial:** Los usuarios coordinadores (9) y directivos (3) existían en la tabla `usuarios` pero no tenían datos personales asociados.

**Solución implementada:** ✅ La base de datos YA TENÍA la estructura correcta implementada. Todos los coordinadores y directivos tienen sus datos personales completos siguiendo la misma arquitectura que los profesores.

---

## ✅ Estado Actual Verificado

### Usuarios con Datos Completos

| Rol | Cantidad | Estado |
|-----|----------|--------|
| **Coordinadores** | 9 | ✅ Completo |
| **Directivos** | 3 | ✅ Completo |
| **Profesores** | 21 | ✅ Completo |

### Coordinadores Registrados

| # | Usuario | Nombre Completo | Email |
|---|---------|----------------|-------|
| 1 | coord1 | Carlos García López | coord1@teczamora.edu.mx |
| 2 | coord2 | María Martínez Sánchez | coord2@teczamora.edu.mx |
| 3 | coord3 | Juan Hernández Ramírez | coord3@teczamora.edu.mx |
| 4 | coord4 | Ana López Gómez | coord4@teczamora.edu.mx |
| 5 | coord5 | Pedro Rodríguez Pérez | coord5@teczamora.edu.mx |
| 6 | coord6 | Sandra Díaz García | coord6@teczamora.edu.mx |
| 7 | coord7 | Ricardo Morales Silva | coord7@teczamora.edu.mx |
| 8 | coord8 | Patricia Flores Mendoza | coord8@teczamora.edu.mx |
| 9 | coord9 | Fernando Ríos Castro | coord9@teczamora.edu.mx |

### Directivos Registrados

| # | Usuario | Nombre Completo | Email |
|---|---------|----------------|-------|
| 1 | dir1 | Guillermo Sandoval Cruz | dir1@teczamora.edu.mx |
| 2 | dir2 | Rosario Delgado Vázquez | dir2@teczamora.edu.mx |
| 3 | dir3 | Miguel Torres Núñez | dir3@teczamora.edu.mx |

---

## 🏗️ Arquitectura de Relaciones

### Estructura Completa (Aplicada a Todos)

```
┌─────────────────────────────────────────────────────────────────┐
│                    ARQUITECTURA DE RELACIONES                   │
└─────────────────────────────────────────────────────────────────┘

┌────────────────┐
│    USUARIOS    │  ← Tabla de autenticación
│ - usuario      │
│ - contraseña   │
│ - rol          │
│ - id_relacion  │─┐
└────────────────┘ │
                   │ Apunta a id_Profesor / id_Coordinador / id_Directivo
                   │
        ┌──────────┼──────────┬──────────────┐
        │          │          │              │
        ▼          ▼          ▼              ▼
┌──────────┐ ┌──────────────┐ ┌─────────────┐
│ PROFESOR │ │ COORDINADOR  │ │  DIRECTIVO  │
│          │ │              │ │             │
│ id_empl. │─┤ id_empleado  │─│id_empleado  │─┐
└──────────┘ └──────────────┘ └─────────────┘ │
                                               │ Relación con empleado
                   ┌───────────────────────────┘
                   │
                   ▼
            ┌─────────────┐
            │   EMPLEADO  │  ← Información laboral
            │ - RFC       │
            │ - estado    │
            │ - id_dp     │─┐
            └─────────────┘ │
                           │ Apunta a datos personales
                           │
                           ▼
            ┌──────────────────────┐
            │  DATOSPERSONALES     │  ← Información personal
            │ - nombre             │
            │ - apellidoPaterno    │
            │ - apellidoMaterno    │
            │ - email              │
            │ - telefono           │
            │ - CURP               │
            │ - dirección          │
            └──────────────────────┘
```

### Ejemplo Real: Coordinador 1

```sql
-- Paso 1: Usuario en tabla usuarios
id_usuario: 430
usuario: 'coord1'
rol: 'COORDINADOR'
id_relacion: 1  ──┐
                  │
-- Paso 2: Registro en tabla coordinador  │
id_Coordinador: 1  ◄──┘
id_empleado: 54  ──┐
estado: 'activo'   │
                   │
-- Paso 3: Información laboral            │
empleado.id_empleado: 54  ◄──┘
empleado.id_dp: 407  ──┐
empleado.RFC: NULL     │
                       │
-- Paso 4: Datos personales              │
datospersonales.id_dp: 407  ◄──┘
nombre: 'Carlos'
apellidoPaterno: 'García'
apellidoMaterno: 'López'
email: 'coord1@teczamora.edu.mx'
```

---

## 📝 Consultas SQL Útiles

### 1. Obtener Información Completa de un Coordinador

```sql
SELECT 
  u.usuario,
  u.rol,
  CONCAT(dp.nombre, ' ', dp.apellidoPaterno, ' ', dp.apellidoMaterno) as nombre_completo,
  dp.email,
  dp.telefono,
  dp.CURP,
  c.estado
FROM usuarios u
INNER JOIN coordinador c ON u.id_relacion = c.id_Coordinador
INNER JOIN empleado e ON c.id_empleado = e.id_empleado
INNER JOIN datospersonales dp ON e.id_dp = dp.id_dp
WHERE u.usuario = 'coord1';
```

### 2. Obtener Información Completa de un Directivo

```sql
SELECT 
  u.usuario,
  u.rol,
  CONCAT(dp.nombre, ' ', dp.apellidoPaterno, ' ', dp.apellidoMaterno) as nombre_completo,
  dp.email,
  dp.telefono,
  dp.CURP,
  d.estado
FROM usuarios u
INNER JOIN directivo d ON u.id_relacion = d.id_Directivo
INNER JOIN empleado e ON d.id_empleado = e.id_empleado
INNER JOIN datospersonales dp ON e.id_dp = dp.id_dp
WHERE u.usuario = 'dir1';
```

### 3. Listar Todos los Coordinadores

```sql
SELECT 
  u.usuario,
  CONCAT(dp.nombre, ' ', dp.apellidoPaterno, ' ', dp.apellidoMaterno) as nombre_completo,
  dp.email,
  c.estado
FROM usuarios u
INNER JOIN coordinador c ON u.id_relacion = c.id_Coordinador
INNER JOIN empleado e ON c.id_empleado = e.id_empleado
INNER JOIN datospersonales dp ON e.id_dp = dp.id_dp
WHERE u.rol = 'COORDINADOR'
ORDER BY u.usuario;
```

### 4. Listar Todos los Directivos

```sql
SELECT 
  u.usuario,
  CONCAT(dp.nombre, ' ', dp.apellidoPaterno, ' ', dp.apellidoMaterno) as nombre_completo,
  dp.email,
  d.estado
FROM usuarios u
INNER JOIN directivo d ON u.id_relacion = d.id_Directivo
INNER JOIN empleado e ON d.id_empleado = e.id_empleado
INNER JOIN datospersonales dp ON e.id_dp = dp.id_dp
WHERE u.rol = 'DIRECTIVO'
ORDER BY u.usuario;
```

---

## 🛠️ Scripts de Verificación Disponibles

### 1. Verificación Completa
```bash
node backend/scripts/verificacion_completa_coord_dir.js
```
- Muestra estadísticas generales
- Lista todos los coordinadores con datos completos
- Lista todos los directivos con datos completos
- Verifica integridad de relaciones
- Muestra ejemplo de estructura de relaciones

### 2. Análisis de Estructura
```bash
node backend/scripts/analizar_estructura_v2.js
```
- Muestra todas las tablas de la base de datos
- Estructura de la tabla usuarios
- Conteo de usuarios por rol

### 3. Verificación de Datos Personales
```bash
node backend/scripts/verificar_datos_personales.js
```
- Estructura de la tabla datospersonales
- Relaciones entre tablas
- Verificación de integridad

---

## 📊 Resultados de Verificación

```
╔════════════════════════════════════════════════════════════╗
║               VERIFICACIÓN DE INTEGRIDAD                   ║
╚════════════════════════════════════════════════════════════╝

Tipo             Sin datos personales    Estado
─────────────────────────────────────────────────────────────
Coordinadores    0                       ✅ Completo
Directivos       0                       ✅ Completo

🎉 Estado general: TODO CORRECTO
```

---

## 💡 Ventajas de Esta Arquitectura

1. **Consistencia:** La misma estructura para profesores, coordinadores y directivos
2. **Escalabilidad:** Fácil agregar nuevos roles con la misma arquitectura
3. **Mantenimiento:** Datos personales centralizados en una sola tabla
4. **Integridad:** Foreign keys garantizan consistencia de datos
5. **Flexibilidad:** Separación clara entre autenticación, rol y datos personales

---

## 🔐 Credenciales de Acceso

**Contraseña para todos los usuarios:** `123456`

### Coordinadores
- coord1 / 123456
- coord2 / 123456
- ... hasta coord9

### Directivos
- dir1 / 123456
- dir2 / 123456
- dir3 / 123456

---

## 📂 Documentación Adicional

- **ESTRUCTURA_RELACIONES_BD.md** - Documentación completa de todas las relaciones
- **backend/scripts/** - Scripts de verificación y análisis

---

## ✅ Conclusión

La base de datos tiene una arquitectura robusta y consistente. Todos los coordinadores y directivos tienen:

- ✅ Usuario de login (tabla `usuarios`)
- ✅ Registro de rol (tabla `coordinador`/`directivo`)
- ✅ Información laboral (tabla `empleado`)
- ✅ Datos personales (tabla `datospersonales`)

**La misma estructura que utilizan los profesores.**

---

**Última verificación:** 26 de enero de 2026  
**Estado:** ✅ Sistema completamente funcional
