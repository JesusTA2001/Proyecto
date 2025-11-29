# ⚙️ Variables de Entorno para Azure App Service

## Copiar estas variables en Azure Portal

**Ruta en Azure Portal:**
Web App → Configuración → Application settings → + New application setting

---

## Variables Obligatorias (8)

### 1. DB_HOST
```
mysqlingles.mysql.database.azure.com
```

### 2. DB_USER
```
admin_ingles
```

### 3. DB_PASSWORD
```
Ingles123
```

### 4. DB_NAME
```
proyectoingles
```

### 5. DB_PORT
```
3306
```

### 6. JWT_SECRET
```
tu_clave_secreta_azure_2025
```
⚠️ Puedes cambiar este valor por cualquier texto largo y aleatorio

### 7. NODE_ENV
```
production
```

### 8. WEBSITE_NODE_DEFAULT_VERSION
```
18-lts
```

---

## Variables Opcionales (para configuración avanzada)

### PORT
```
8080
```
⚠️ Azure asigna el puerto automáticamente, pero puedes especificarlo

### SCM_DO_BUILD_DURING_DEPLOYMENT
```
true
```
⚠️ Ya está en `.deployment`, pero puede ir aquí también

---

## 📋 Checklist

- [ ] DB_HOST configurado
- [ ] DB_USER configurado
- [ ] DB_PASSWORD configurado
- [ ] DB_NAME configurado
- [ ] DB_PORT configurado
- [ ] JWT_SECRET configurado
- [ ] NODE_ENV configurado
- [ ] WEBSITE_NODE_DEFAULT_VERSION configurado
- [ ] ✅ Click en "Guardar" en Azure Portal

---

## 🔒 Seguridad

⚠️ **NUNCA** subas estas credenciales a GitHub
✅ Solo configúralas en Azure Portal
✅ El archivo `.env` está en `.gitignore`

---

## 🧪 Verificación

Una vez configuradas, verifica que funcionan:

```bash
https://TU-APP.azurewebsites.net/api/test-db
```

Debe responder:
```json
{
  "success": true,
  "message": "Conexión a MySQL exitosa",
  "database": "proyectoingles"
}
```
