# 🔐 CREDENCIALES DE ACCESO AL SISTEMA

**Fecha de creación:** 28 de noviembre de 2025  
**Total de usuarios:** 326

---

## 📊 RESUMEN POR ROL

| Rol | Total de Usuarios | Patrón de Usuario | Patrón de Contraseña |
|-----|-------------------|-------------------|----------------------|
| 👨‍🎓 **ESTUDIANTES** | 300 | `nControl` | `primeras3letrasNombre + 2025` |
| 👨‍🏫 **PROFESORES** | 20 | `prof[id]` | `primeras3letrasNombre + primeras3letrasApellido` |
| 👨‍💼 **ADMINISTRADORES** | 6 | `admin[id]` | `primeras3letrasNombre + primeras3letrasApellido` |

---

## 🎓 ESTUDIANTES (300 usuarios)

Todos los estudiantes pueden acceder usando su **número de control** como usuario.

### Patrón:
- **Usuario:** Su número de control (ej: `1002`, `2024050`)
- **Contraseña:** Primeras 3 letras de su nombre + año 2025 (ej: `vic2025` para Victoria)

### Ejemplos:
| Usuario | Contraseña | Nombre Completo |
|---------|------------|-----------------|
| 1002 | vic2025 | Victoria Olmos |
| 1022 | tom2025 | Tomás Farías |
| 1042 | mar2025 | María Cristina Hinojosa |
| 2024001 | ver2025 | Veronica Aguilar |
| 2024050 | cla2025 | Claudia Castro |
| 2024100 | edu2025 | Eduardo Martinez |

### Todos los estudiantes (1000-1099):
```
1000 / sil2025 - Silvia Farías
1001 / mar2025 - Martín Gamez
1002 / vic2025 - Victoria Olmos
1003 / nat2025 - Natividad Ledesma
1004 / dan2025 - Daniel Serna
1005 / ade2025 - Adela Farías
1006 / yol2025 - Yolanda Nieves
1007 / nel2025 - Nelly Montaño
1008 / vio2025 - Violeta Vélez
1009 / jos2025 - José Salgado
1010 / osw2025 - Oswaldo Arteaga
1011 / ben2025 - Benjamín Domínguez
1012 / jes2025 - Jesus Torres
1013 / mag2025 - Magdalena Quesada
1014 / jul2025 - Julia Valles
1015 / ant2025 - Antonio Arguello
1016 / ali2025 - Alicia Rojo
1017 / mau2025 - Mauro Manzanares
1018 / sus2025 - Susana Villagómez
1019 / and2025 - Andrea Domínguez
1020 / alb2025 - Alberto Berríos
1021 / mod2025 - Modesto Olivares
1022 / tom2025 - Tomás Farías
1023 / elo2025 - Eloisa Gamez
1024 / hel2025 - Helena Jaimes
1025 / mar2025 - María José Rocha
... (continúa hasta 1099)
```

### Todos los estudiantes (2024001-2024200):
```
2024001 / ver2025 - Veronica Aguilar
2024002 / jor2025 - Jorge Lopez
2024003 / jav2025 - Javier Ortiz
... (continúa hasta 2024200)
```

---

## 👨‍🏫 PROFESORES (20 usuarios)

### Listado Completo:

| Usuario | Contraseña | Nombre Completo | ID Profesor |
|---------|------------|-----------------|-------------|
| prof1 | hummen | Humberto Menchaca | 1 |
| prof2 | liloli | Lilia Olivares | 2 |
| prof3 | siltej | Silvia Tejeda | 3 |
| prof4 | yolrey | Yolanda Reyes | 4 |
| prof5 | jaisai | Jaime Saiz | 5 |
| prof6 | aidmez | Aida Meza | 6 |
| prof7 | araben | Araceli Benítez | 7 |
| prof8 | abesan | Abel Sanches | 8 |
| prof9 | ivozúñ | Ivonne Zúñiga | 9 |
| prof10 | amabét | Amador Bétancourt | 10 |
| prof11 | rodde  | Rodolfo de la Crúz | 11 |
| prof12 | elogue | Eloisa Guerrero | 12 |
| prof13 | luznáj | Luz Nájera | 13 |
| prof14 | elvmar | Elvia Martínez | 14 |
| prof15 | micbot | Micaela Botello | 15 |
| prof16 | eugtir | Eugenia Tirado | 16 |
| prof17 | marmal | Margarita Malave | 17 |
| prof18 | nelhen | Nelly Henríquez | 18 |
| prof19 | pabher | Pablo Hernádez | 19 |
| prof20 | fedceb | Federico Ceballos | 20 |

---

## 👨‍💼 ADMINISTRADORES (6 usuarios)

### Listado Completo:

| Usuario | Contraseña | Nombre Completo | ID Admin |
|---------|------------|-----------------|----------|
| admin1 | anapar | Ana Parra | 1 |
| admin2 | enrsan | Enrique Sanches | 2 |
| admin3 | ólimej | Óliver Mejía | 3 |
| admin4 | joaiba | Joaquín Ibarra | 4 |
| admin5 | juacal | Juan Caldera | 5 |
| admin6 | jacvan | Jacobo Vanegas | 6 |

---

## 🔄 COORDINADORES Y DIRECTIVOS

⚠️ **Nota:** Actualmente no hay coordinadores ni directivos registrados en la base de datos.  
Si se agregan en el futuro, el patrón será:
- **Coordinadores:** `coord[id]` / `primeras3letrasNombre + primeras3letrasApellido`
- **Directivos:** `dir[id]` / `primeras3letrasNombre + primeras3letrasApellido`

---

## 📝 NOTAS IMPORTANTES

### ✅ Ventajas del nuevo sistema:
1. **Sin limitantes:** Todos los estudiantes, profesores y administradores pueden acceder
2. **Patrón simple:** Fácil de recordar y comunicar
3. **Cobertura completa:** 326 usuarios pueden acceder inmediatamente
4. **Seguridad básica:** Contraseñas hasheadas con bcrypt
5. **Escalable:** El script puede ejecutarse nuevamente si hay cambios

### 🔒 Recomendaciones de Seguridad:
1. Los usuarios deberían cambiar su contraseña al primer inicio de sesión
2. Considerar implementar una política de cambio de contraseña periódico
3. Agregar validación de contraseña segura (mayúsculas, números, símbolos)
4. Implementar recuperación de contraseña por email

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
2. Usuario: Tu número de control (ej: `1042`)
3. Contraseña: Primeras 3 letras de tu nombre + 2025 (ej: `mar2025`)

### Para Profesores:
1. Ir a la página de login
2. Usuario: `prof` + tu ID (ej: `prof3` para Silvia Tejeda)
3. Contraseña: Primeras 3 letras de tu nombre + primeras 3 de tu apellido (ej: `siltej`)

### Para Administradores:
1. Ir a la página de login
2. Usuario: `admin` + tu ID (ej: `admin1`)
3. Contraseña: Primeras 3 letras de tu nombre + primeras 3 de tu apellido (ej: `anapar`)

---

**Última actualización:** 28/11/2025  
**Script:** `backend/scripts/crear_usuarios_completo.js`
