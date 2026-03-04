const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No hay token, autorización denegada' });
  }

  // Si es un token temporal (usuarios de prueba del frontend), permitir acceso
  if (token.startsWith('temp_token_')) {
    req.user = { rol: 'ADMINISTRADOR', temp: true };
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token no válido' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.rol !== 'ADMINISTRADOR') {
    return res.status(403).json({ message: 'Acceso denegado. Solo administradores' });
  }
  next();
};

module.exports = { authMiddleware, isAdmin };
