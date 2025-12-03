const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { testConnection } = require('./config/db');

const app = express();

// Middleware CORS - Permitir Azure Static Web Apps, Vercel y localhost
app.use(cors({
  origin: [
    'https://gray-beach-0cdc4478f.3.azurestaticapps.net',  // Azure Static Web App
    'https://proyecto-2971.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
    /\.vercel\.app$/,  // Permite cualquier subdominio de vercel.app
    /\.azurestaticapps\.net$/  // Permite cualquier subdominio de Azure Static Web Apps
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'API del Sistema de Gestión Escolar',
    status: 'Servidor funcionando correctamente',
    version: '1.0.0'
  });
});

// Ruta para probar la conexión a la base de datos
app.get('/api/test-db', async (req, res) => {
  const isConnected = await testConnection();
  if (isConnected) {
    res.json({ 
      success: true, 
      message: 'Conexión a MySQL exitosa',
      database: process.env.DB_NAME
    });
  } else {
    res.status(500).json({ 
      success: false, 
      message: 'Error al conectar con MySQL'
    });
  }
});

// Importar rutas
const authRoutes = require('./routes/auth');
const alumnosRoutes = require('./routes/alumnos');
const profesoresRoutes = require('./routes/profesores');
const administradoresRoutes = require('./routes/administradores');
const gruposRoutes = require('./routes/grupos');
const horariosRoutes = require('./routes/horarios');
const periodosRoutes = require('./routes/periodos');
const nivelesRoutes = require('./routes/niveles');
const asistenciasRoutes = require('./routes/asistencias');
const calificacionesRoutes = require('./routes/calificaciones');

// Registrar rutas
app.use('/api/auth', authRoutes);
app.use('/api/alumnos', alumnosRoutes);
app.use('/api/profesores', profesoresRoutes);
app.use('/api/administradores', administradoresRoutes);
app.use('/api/grupos', gruposRoutes);
app.use('/api/horarios', horariosRoutes);
app.use('/api/periodos', periodosRoutes);
app.use('/api/niveles', nivelesRoutes);
app.use('/api/asistencias', asistenciasRoutes);
app.use('/api/calificaciones', calificacionesRoutes);

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Manejador para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Ruta no encontrada' 
  });
});

const PORT = process.env.PORT || 5000;

// Iniciar servidor
const server = app.listen(PORT, async () => {
  console.log('='.repeat(50));
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log('='.repeat(50));
  
  // Probar conexión a la base de datos al iniciar
  await testConnection();
  
  console.log('='.repeat(50));
  console.log('💡 Rutas disponibles:');
  console.log(`   GET    http://localhost:${PORT}/`);
  console.log(`   GET    http://localhost:${PORT}/api/test-db`);
  console.log(`   POST   http://localhost:${PORT}/api/auth/login`);
  console.log(`   GET    http://localhost:${PORT}/api/auth/verify`);
  console.log(`   GET    http://localhost:${PORT}/api/alumnos`);
  console.log(`   POST   http://localhost:${PORT}/api/alumnos`);
  console.log(`   GET    http://localhost:${PORT}/api/profesores`);
  console.log(`   POST   http://localhost:${PORT}/api/profesores`);
  console.log(`   GET    http://localhost:${PORT}/api/administradores`);
  console.log(`   POST   http://localhost:${PORT}/api/administradores`);
  console.log(`   GET    http://localhost:${PORT}/api/grupos`);
  console.log(`   POST   http://localhost:${PORT}/api/grupos`);
  console.log(`   GET    http://localhost:${PORT}/api/horarios`);
  console.log(`   POST   http://localhost:${PORT}/api/horarios`);
  console.log('='.repeat(50));
});

// Manejo de señales para cierre graceful
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido, cerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT recibido, cerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado');
    process.exit(0);
  });
});

// Capturar errores no manejados
process.on('uncaughtException', (error) => {
  console.error('Error no capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa rechazada no manejada:', reason);
});
