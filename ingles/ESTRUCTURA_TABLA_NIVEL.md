# 📚 ESTRUCTURA ACTUALIZADA DE LA TABLA NIVEL

## 🏗️ Definición de la Tabla

```sql
CREATE TABLE Nivel (
    id_Nivel INT PRIMARY KEY,
    nivel VARCHAR(50),
    campus SET('Tecnologico','Centro de Idiomas')
);
```

**Nota importante:** El campo `campus` utiliza el tipo **SET** que permite que un nivel pertenezca a múltiples campus simultáneamente.

## 📊 Distribución de Niveles por Campus

### 📚 Niveles Compartidos - Ambos Campus (7 niveles)
Estos niveles están disponibles tanto en el Tecnológico como en el Centro de Idiomas.

| ID | Nombre | Campus |
|----|--------|--------|
| 0  | Intro  | Tecnologico, Centro de Idiomas |
| 1  | Nivel1 | Tecnologico, Centro de Idiomas |
| 2  | Nivel2 | Tecnologico, Centro de Idiomas |
| 3  | Nivel3 | Tecnologico, Centro de Idiomas |
| 4  | Nivel4 | Tecnologico, Centro de Idiomas |
| 5  | Nivel5 | Tecnologico, Centro de Idiomas |
| 6  | Nivel6 | Tecnologico, Centro de Idiomas |

### 🎓 Solo Centro de Idiomas (12 niveles)

#### Kids (4 niveles)
| ID | Nombre | Campus |
|----|--------|--------|
| 7  | Kids 1 | Centro de Idiomas |
| 8  | Kids 2 | Centro de Idiomas |
| 9  | Kids 3 | Centro de Idiomas |
| 10 | Kids 4 | Centro de Idiomas |

#### Teens (4 niveles)
| ID | Nombre | Campus |
|----|--------|--------|
| 11 | Teens 1 | Centro de Idiomas |
| 12 | Teens 2 | Centro de Idiomas |
| 13 | Teens 3 | Centro de Idiomas |
| 14 | Teens 4 | Centro de Idiomas |

#### Conversación (2 niveles)
| ID | Nombre | Campus |
|----|--------|--------|
| 15 | Conversación 1 | Centro de Idiomas |
| 16 | Conversación 2 | Centro de Idiomas |

#### Diplomado (2 niveles)
| ID | Nombre | Campus |
|----|--------|--------|
| 17 | Diplomado 1 | Centro de Idiomas |
| 18 | Diplomado 2 | Centro de Idiomas |

## 🔌 Endpoints API Actualizados

### GET /api/niveles
Obtiene todos los niveles con su campo campus.

**Respuesta:**
```json
[
  { "id_Nivel": 0, "nivel": "Intro", "campus": "Tecnologico,Centro de Idiomas" },
  { "id_Nivel": 1, "nivel": "Nivel1", "campus": "Tecnologico,Centro de Idiomas" },
  ...
  { "id_Nivel": 7, "nivel": "Kids 1", "campus": "Centro de Idiomas" },
  ...
]
```

### GET /api/niveles/campus/:campus
Obtiene niveles que incluyen el campus especificado.

**Importante:** Usa `FIND_IN_SET()` para buscar en el campo SET.

**Parámetros:**
- `campus`: "Tecnologico" o "Centro de Idiomas"

**Ejemplo:**
```
GET /api/niveles/campus/Tecnologico
  → Devuelve: Intro, Nivel1-6 (7 niveles)

GET /api/niveles/campus/Centro de Idiomas
  → Devuelve: Intro, Nivel1-6, Kids 1-4, Teens 1-4, Conversación 1-2, Diplomado 1-2 (19 niveles)
```

**Respuesta para Tecnológico:**
```json
[
  { "id_Nivel": 0, "nivel": "Intro", "campus": "Tecnologico,Centro de Idiomas" },
  { "id_Nivel": 1, "nivel": "Nivel1", "campus": "Tecnologico,Centro de Idiomas" },
  ...
]
```

**Respuesta para Centro de Idiomas:**
```json
[
  { "id_Nivel": 0, "nivel": "Intro", "campus": "Tecnologico,Centro de Idiomas" },
  ...
  { "id_Nivel": 7, "nivel": "Kids 1", "campus": "Centro de Idiomas" },
  ...
]
```

### GET /api/niveles/:id
Obtiene un nivel específico por ID, incluyendo el campo campus.

**Respuesta:**
```json
{
  "id_Nivel": 0,
  "nivel": "Intro",
  "campus": "Tecnologico,Centro de Idiomas"
}
```

## 🔍 Consultas SQL con SET

### Buscar niveles por campus
```sql
-- Niveles que incluyen Tecnológico
SELECT * FROM Nivel 
WHERE FIND_IN_SET('Tecnologico', campus) > 0;

-- Niveles que incluyen Centro de Idiomas
SELECT * FROM Nivel 
WHERE FIND_IN_SET('Centro de Idiomas', campus) > 0;

-- Niveles en ambos campus
SELECT * FROM Nivel 
WHERE campus LIKE '%,%';

-- Niveles solo en un campus
SELECT * FROM Nivel 
WHERE campus NOT LIKE '%,%';
```

## 📝 Scripts de Base de Datos

### Script de Migración a SET
Archivo: `migrar_campus_a_set.js`
- Cambia el campo campus de ENUM a SET
- Actualiza niveles 0-6 para pertenecer a ambos campus
- Muestra verificación detallada de los cambios

### Script de Actualización Original
Archivo: `actualizar_niveles_con_campus.sql`
- Script SQL original (ahora obsoleto, usar SET en su lugar)

### Script de Ejecución Original
Archivo: `ejecutar_actualizacion_niveles.js`
- Primera versión con ENUM (ahora obsoleto)

### Script de Consulta
Archivo: `consultar_niveles.js`
- Consulta actualizada que muestra niveles por categoría
- Diferencia entre niveles compartidos y exclusivos

## 📊 Resumen

- **Total de niveles:** 19
- **Niveles en ambos campus:** 7 (Intro + Nivel 1-6)
  - Disponibles en: Tecnológico y Centro de Idiomas
- **Niveles exclusivos del Centro de Idiomas:** 12
  - Kids 1-4 (4 niveles)
  - Teens 1-4 (4 niveles)
  - Conversación 1-2 (2 niveles)
  - Diplomado 1-2 (2 niveles)

## 💡 Ventajas del tipo SET

✅ **No duplicación de datos:** Los niveles básicos se almacenan una sola vez  
✅ **Flexibilidad:** Un nivel puede pertenecer a uno o más campus  
✅ **Fácil consulta:** Uso de `FIND_IN_SET()` para filtrar  
✅ **Mantenimiento simple:** Cambios en un solo registro afectan a ambos campus  

## 🔄 Historial de Cambios

**10 de marzo de 2026:**
- ✅ Migración de ENUM a SET para campo campus
- ✅ Niveles 0-6 ahora disponibles en ambos campus
- ✅ Controller actualizado con FIND_IN_SET()
- ✅ Scripts y documentación actualizados

**Fecha inicial:** 10 de marzo de 2026  
**Estado:** ✅ Implementado en Azure MySQL con tipo SET
