# Backend - Sistema de Gestión Escolar

## 🚀 Instalación

1. Instalar dependencias:
```bash
npm install
```

## ▶️ Ejecutar el servidor

### Modo desarrollo (con auto-reload):
```bash
npm run dev
```

### Modo producción:
```bash
npm start
```

## 🧪 Probar la conexión

### Probar desde terminal:
```bash
npm test
```

### Probar desde navegador:
Abre: http://localhost:5000/api/test-db

## 📊 Configuración

La configuración de la base de datos está en el archivo `.env`:
- Host: 127.0.0.1
- Usuario: root
- Contraseña: root
- Base de datos: ingles
- Puerto: 3306

## 🗂️ Estructura del Proyecto

```
backend/
├── config/
│   └── db.js              # Configuración de MySQL
├── .env                   # Variables de entorno
├── server.js             # Servidor principal
├── package.json          # Dependencias
└── README.md            # Este archivo
```

## 📝 Próximos pasos

Cuando estés listo para crear tu API, añade estas carpetas:

```
backend/
├── routes/              # Rutas de la API
│   ├── alumnos.js
│   ├── profesores.js
│   ├── administradores.js
│   ├── grupos.js
│   └── auth.js
├── controllers/         # Lógica de negocio
├── middleware/         # Middleware (autenticación, etc.)
└── models/            # Modelos de datos (opcional)
```

## 🔗 Rutas Disponibles

- `GET /` - Información del servidor
- `GET /api/test-db` - Probar conexión a MySQL
