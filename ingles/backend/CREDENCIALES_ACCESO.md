# 🔐 CREDENCIALES DE ACCESO AL SISTEMA

**Fecha de actualización:** 1 de diciembre de 2025  
**Total de usuarios:** 326  
**⚠️ IMPORTANTE:** Todas las contraseñas han sido simplificadas a `123456`

---

## 📊 RESUMEN POR ROL

| Rol | Total de Usuarios | Patrón de Usuario | Contraseña |
|-----|-------------------|-------------------|------------|
| 👨‍🎓 **ESTUDIANTES** | 300 | `nControl` | `123456` |
| 👨‍🏫 **PROFESORES** | 20 | `prof[id]` | `123456` |
| 👨‍💼 **ADMINISTRADORES** | 6 | `admin[id]` | `123456` |

---

## 🎓 ESTUDIANTES (300 usuarios)

Todos los estudiantes pueden acceder usando su **número de control** como usuario.

### Patrón:
- **Usuario:** Su número de control (ej: `1000`, `1002`, `2024050`)
- **Contraseña:** `123456` (para todos)

### Ejemplos:
| Usuario | Contraseña | Nombre Completo |
|---------|------------|-----------------|
| 1000 | 123456 | Silvia Farías |
| 1002 | 123456 | Victoria Olmos |
| 1022 | 123456 | Tomás Farías |
| 1042 | 123456 | María Cristina Hinojosa |
| 2024001 | 123456 | Veronica Aguilar |
| 2024050 | 123456 | Claudia Castro |
| 2024100 | 123456 | Eduardo Martinez |

### Todos los estudiantes (1000-1099):
```
1000 / 123456 - Silvia Farías
1001 / 123456 - Martín Gamez
1002 / 123456 - Victoria Olmos
1003 / 123456 - Natividad Ledesma
1004 / 123456 - Daniel Serna
1005 / 123456 - Adela Farías
1006 / 123456 - Yolanda Nieves
1007 / 123456 - Nelly Montaño
1008 / 123456 - Violeta Vélez
1009 / 123456 - José Salgado
1010 / 123456 - Oswaldo Arteaga
1011 / 123456 - Benjamín Domínguez
1012 / 123456 - Jesus Torres
1013 / 123456 - Magdalena Quesada
1014 / 123456 - Julia Valles
1015 / 123456 - Antonio Arguello
1016 / 123456 - Alicia Rojo
1017 / 123456 - Mauro Manzanares
1018 / 123456 - Susana Villagómez
1019 / 123456 - Andrea Domínguez
1020 / 123456 - Alberto Berríos
1021 / 123456 - Modesto Olivares
1022 / 123456 - Tomás Farías
1023 / 123456 - Eloisa Gamez
1024 / 123456 - Helena Jaimes
1025 / 123456 - María José Rocha
... (continúa hasta 1099)
```

### Todos los estudiantes (2024001-2024200):
```
2024001 / 123456 - Veronica Aguilar
2024002 / 123456 - Jorge Lopez
2024003 / 123456 - Javier Ortiz
... (continúa hasta 2024200)
```

---

## 👨‍🏫 PROFESORES (20 usuarios)

### Listado Completo:

| Usuario | Contraseña | Nombre Completo | ID Profesor |
|---------|------------|-----------------|-------------|
| prof1 | 123456 | Humberto Menchaca | 1 |
| prof2 | 123456 | Lilia Olivares | 2 |
| prof3 | 123456 | Silvia Tejeda | 3 |
| prof4 | 123456 | Yolanda Reyes | 4 |
| prof5 | 123456 | Jaime Saiz | 5 |
| prof6 | 123456 | Aida Meza | 6 |
| prof7 | 123456 | Araceli Benítez | 7 |
| prof8 | 123456 | Abel Sanches | 8 |
| prof9 | 123456 | Ivonne Zúñiga | 9 |
| prof10 | 123456 | Amador Bétancourt | 10 |
| prof11 | 123456 | Rodolfo de la Crúz | 11 |
| prof12 | 123456 | Eloisa Guerrero | 12 |
| prof13 | 123456 | Luz Nájera | 13 |
| prof14 | 123456 | Elvia Martínez | 14 |
| prof15 | 123456 | Micaela Botello | 15 |
| prof16 | 123456 | Eugenia Tirado | 16 |
| prof17 | 123456 | Margarita Malave | 17 |
| prof18 | 123456 | Nelly Henríquez | 18 |
| prof19 | 123456 | Pablo Hernádez | 19 |
| prof20 | 123456 | Federico Ceballos | 20 |

---

## 👨‍💼 ADMINISTRADORES (6 usuarios)

### Listado Completo:

| Usuario | Contraseña | Nombre Completo | ID Admin |
|---------|------------|-----------------|----------|
| admin1 | 123456 | Ana Parra | 1 |
| admin2 | 123456 | Enrique Sanches | 2 |
| admin3 | 123456 | Óliver Mejía | 3 |
| admin4 | 123456 | Joaquín Ibarra | 4 |
| admin5 | 123456 | Juan Caldera | 5 |
| admin6 | 123456 | Jacobo Vanegas | 6 |

---

## 🔄 COORDINADORES Y DIRECTIVOS

⚠️ **Nota:** Actualmente no hay coordinadores ni directivos registrados en la base de datos.  
Si se agregan en el futuro, el patrón será:
- **Coordinadores:** `coord[id]` / `123456`
- **Directivos:** `dir[id]` / `123456`

---

## 📝 NOTAS IMPORTANTES

### ✅ Ventajas del nuevo sistema:
1. **Sin limitantes:** Todos los estudiantes, profesores y administradores pueden acceder
2. **Contraseña universal:** Una sola contraseña (`123456`) para todos los usuarios
3. **Cobertura completa:** 326 usuarios pueden acceder inmediatamente
4. **Fácil de comunicar:** Sólo necesitas recordar tu usuario y `123456`
5. **Simplificado:** Sin contraseñas hasheadas, comparación directa

### 🔒 Recomendaciones de Seguridad:
⚠️ **IMPORTANTE:** Este sistema usa contraseñas planas y una contraseña universal (`123456`).  
**NO es seguro para producción.** Recomendaciones:
1. Implementar bcrypt para hashear contraseñas antes de producción
2. Forzar cambio de contraseña al primer inicio de sesión
3. Implementar política de contraseñas seguras (mayúsculas, números, símbolos)
4. Agregar recuperación de contraseña por email
5. **Este sistema es SOLO para desarrollo y pruebas**

### 🛠️ Para agregar más usuarios:
Ejecutar el script: `node backend/scripts/crear_usuarios_completo.js`

Este script:
- Limpia la tabla Usuarios
- Crea usuarios para todos los registros en las tablas: Estudiante, Profesor, Administrador, Coordinador, Directivo
- Genera contraseñas siguiendo el patrón establecido
- Usa bcrypt para hashear las contraseñas

---

## 🚀 INICIO RÁPIDO

### Para Estudiantes:
1. Ir a la página de login
2. Usuario: Tu número de control (ej: `1000`, `1042`, `2024001`)
3. Contraseña: `123456`

### Para Profesores:
1. Ir a la página de login
2. Usuario: `prof` + tu ID (ej: `prof1`, `prof3`, `prof10`)
3. Contraseña: `123456`

### Para Administradores:
1. Ir a la página de login
2. Usuario: `admin` + tu ID (ej: `admin1`, `admin2`)
3. Contraseña: `123456`

### ✅ Ejemplos de acceso:
```
Estudiante: 1000 / 123456
Estudiante: 2024001 / 123456
Profesor:   prof1 / 123456
Profesor:   prof10 / 123456
Admin:      admin1 / 123456
```

---

**Última actualización:** 1/12/2025  
**Sistema:** Contraseñas planas (sin bcrypt) - SOLO para desarrollo
