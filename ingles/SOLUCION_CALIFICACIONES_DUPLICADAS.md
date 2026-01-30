# 🔧 SOLUCIÓN: Problema de Calificaciones Duplicadas

## 🎯 Problema Identificado

**Registros duplicados en la tabla `Calificaciones`** causando que:
- El profesor actualiza un registro (ej: id_Calificaciones=76)
- El estudiante ve otro registro diferente (ej: id_Calificaciones=88 o id_Calificaciones=1)
- Los cambios no se reflejan porque son registros distintos
- El parcial3 queda NULL en algunos registros

## 📊 Ejemplo Real Encontrado

Estudiante nControl 1000 tiene **3 registros** de calificaciones:

| id_Calificaciones | id_Grupo | id_Periodo | parcial1 | parcial2 | parcial3 | final |
|-------------------|----------|------------|----------|----------|----------|-------|
| 88 | 30 | 3 | 100 | 87 | **NULL** | 94 |
| 76 | 29 | 3 | 88 | 88 | 88 | 88 |
| 1 | 1 | 1 | 40 | 69 | 99 | 63 |

**Problema**: El registro #88 no tiene parcial3

## 🔧 Soluciones

### Opción 1: Limpiar Duplicados (Recomendado)

Mantener solo el registro más reciente por cada combinación de `(nControl, id_Grupo, id_Periodo)`.

**Script de limpieza**: `backend/scripts/limpiar_duplicados_calificaciones.js`

### Opción 2: Mejorar Consultas

Asegurar que las consultas usen criterios consistentes para seleccionar el registro correcto.

### Opción 3: Constraint UNIQUE

Agregar una restricción única en la tabla para prevenir duplicados futuros:

```sql
ALTER TABLE Calificaciones 
ADD UNIQUE KEY unique_calificacion (nControl, id_Grupo, id_Periodo);
```

## 📝 Implementación

### 1. Script de Limpieza Automática

Ejecutar:
```bash
node backend/scripts/limpiar_duplicados_calificaciones.js
```

Este script:
- ✅ Identifica registros duplicados
- ✅ Mantiene el más reciente
- ✅ Elimina los antiguos
- ✅ Genera reporte de limpieza

### 2. Prevención Futura

Agregar restricción UNIQUE:
```bash
node backend/scripts/agregar_constraint_unique.js
```

### 3. Verificación Post-Limpieza

```bash
node backend/scripts/verificar_duplicados.js
```

## ⚠️ Notas Importantes

1. **Backup**: Hacer respaldo antes de ejecutar limpieza
2. **Testing**: Probar en desarrollo primero
3. **Período Activo**: Solo afecta registros con duplicados
4. **Sin pérdida de datos**: Se conserva el registro más actualizado

## 🎯 Resultado Esperado

Después de la limpieza:
- ✅ Un solo registro por estudiante/grupo/período
- ✅ Profesor y estudiante ven la misma información
- ✅ Todos los parciales se guardan correctamente
- ✅ No más problemas de sincronización

---

**Scripts disponibles:**
- `limpiar_duplicados_calificaciones.js` - Limpieza automática
- `verificar_duplicados.js` - Diagnóstico
- `agregar_constraint_unique.js` - Prevención
