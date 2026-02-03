import axios from 'axios';

// Configuración base de axios
// Si está en producción, usar la URL del backend desplegado
// Si está en desarrollo, usar localhost
const getBaseURL = () => {
  // Si estamos en Azure (detectar por hostname)
  if (window.location.hostname.includes('azurestaticapps.net')) {
    return 'https://api-escolar-backend-cbgrhtfkbxgsdra9.eastus2-01.azurewebsites.net/api';
  }
  // Si hay variable de entorno configurada
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  // Default: localhost para desarrollo
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Agregar timestamp a peticiones GET para evitar caché
    if (config.method === 'get') {
      const separator = config.url.includes('?') ? '&' : '?';
      config.url = `${config.url}${separator}_t=${Date.now()}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
