# Sistema de Estado de Grupos - Documentación

## Descripción
Sistema automático para gestionar el estado de los grupos (activo/inactivo) según reglas de negocio definidas.

## Reglas de Negocio

Un grupo pasa a estado **INACTIVO** cuando se cumplen las siguientes condiciones:

### Condición 1: Fecha de término del semestre
- El periodo al que pertenece el grupo ya concluyó
- La fecha actual es posterior a la `fecha_fin` del periodo

### Condición 2: Calificaciones completas + Periodo concluido
- Todos los alumnos del grupo tienen sus 3 parciales y calificación final registrados
- Y además el periodo ya concluyó

## Periodos Semestrales

### Semestre 1 (2025-1)
- **Inicio:** 1 de febrero
- **Fin:** 30 de junio

### Semestre 2 (2025-2)
- **Inicio:** 1 de agosto
- **Fin:** 30 de enero (del año siguiente)

## Endpoints de la API

### 1. Verificar y actualizar estado de grupos
```
POST /api/estado-grupo/verificar
```
**Descripción:** Ejecuta la verificación automática de todos los grupos activos y actualiza su estado según las reglas de negocio.

**Respuesta:**
```json
{
  "success": true,
  "message": "Se verificaron 15 grupos activos",
  "gruposInactivados": 3,
  "detalles": [
    {
      "id_Grupo": 5,
      "nombre": "Grupo 1",
      "razon": "Calificaciones completas y periodo concluido"
    }
  ]
}
```

### 2. Obtener grupos inactivos
```
GET /api/estado-grupo/inactivos
```
**Descripción:** Obtiene el historial de todos los grupos que están inactivos.

**Respuesta:**
```json
{
  "success": true,
  "grupos": [
    {
      "id_Grupo": 5,
      "grupo": "Grupo 1",
      "ubicacion": "Tecnologico",
      "nivel_nombre": "Nivel1",
      "periodo_nombre": "2025-1",
      "fecha_inicio": "2025-02-01",
      "fecha_fin": "2025-06-30",
      "profesor_nombre": "García López Juan",
      "total_alumnos": 18
    }
  ]
}
```

### 3. Inactivar grupo manualmente
```
PATCH /api/estado-grupo/:id/inactivar
```
**Descripción:** Inactiva un grupo específico de forma manual.

### 4. Reactivar grupo manualmente
```
PATCH /api/estado-grupo/:id/reactivar
```
**Descripción:** Reactiva un grupo que estaba inactivo.

## Cambios en la Base de Datos

### Tabla `Grupo`
Se agregó el campo:
- `estado` ENUM('activo', 'inactivo') DEFAULT 'activo'

### Tabla `Periodo`
Se agregaron los campos:
- `fecha_inicio` DATE
- `fecha_fin` DATE

## Scripts de Migración

### 1. Agregar campos de estado
```bash
node scripts/agregar_estado_grupos.js
```
Agrega los campos `estado` a Grupo y `fecha_inicio`, `fecha_fin` a Periodo.

### 2. Actualizar fechas de periodos
```bash
node scripts/actualizar_periodos_fechas.js
```
Actualiza automáticamente las fechas de inicio y fin de los periodos existentes según el formato:
- `2025-1` → Febrero 1 a Junio 30, 2025
- `2025-2` → Agosto 1, 2025 a Enero 30, 2026

## Uso en Producción

### Verificación Automática
Se recomienda ejecutar la verificación de estado de grupos:
1. **Diariamente:** Al finalizar cada día lectivo
2. **Al término del semestre:** Cuando se acerque la fecha de fin del periodo
3. **Después de subir calificaciones finales:** Cuando se complete el registro de notas

### Ejemplo de integración con cron job:
```javascript
// Verificar estado de grupos todos los días a las 11:59 PM
const cron = require('node-cron');

cron.schedule('59 23 * * *', async () => {
  try {
    await axios.post('http://localhost:5000/api/estado-grupo/verificar');
    console.log('✅ Estado de grupos verificado');
  } catch (error) {
    console.error('❌ Error al verificar grupos:', error);
  }
});
```

## Consultas para Verificar

### Ver todos los grupos con su estado
```sql
SELECT 
  g.id_Grupo,
  g.grupo,
  g.estado,
  p.descripcion as periodo,
  p.fecha_fin
FROM Grupo g
LEFT JOIN Periodo p ON g.id_Periodo = p.id_Periodo;
```

### Ver grupos que deberían inactivarse
```sql
SELECT 
  g.id_Grupo,
  g.grupo,
  g.estado,
  p.fecha_fin,
  COUNT(DISTINCT ge.nControl) as total_alumnos,
  COUNT(DISTINCT CASE 
    WHEN c.parcial1 IS NOT NULL 
      AND c.parcial2 IS NOT NULL 
      AND c.parcial3 IS NOT NULL 
      AND c.final IS NOT NULL 
    THEN c.nControl 
  END) as alumnos_con_calificaciones_completas
FROM Grupo g
LEFT JOIN Periodo p ON g.id_Periodo = p.id_Periodo
LEFT JOIN GrupoEstudiante ge ON g.id_Grupo = ge.id_Grupo
LEFT JOIN Calificaciones c ON g.id_Grupo = c.id_Grupo AND ge.nControl = c.nControl
WHERE g.estado = 'activo'
GROUP BY g.id_Grupo, g.grupo, g.estado, p.fecha_fin
HAVING (p.fecha_fin < CURDATE()) 
   OR (total_alumnos > 0 AND total_alumnos = alumnos_con_calificaciones_completas AND p.fecha_fin < CURDATE());
```

## Notas Importantes

1. Los grupos inactivos NO aparecen en los listados normales de grupos
2. Los grupos inactivos conservan toda su información (alumnos, calificaciones, horarios)
3. Los grupos pueden reactivarse manualmente si es necesario
4. La verificación automática no afecta grupos que ya están inactivos
