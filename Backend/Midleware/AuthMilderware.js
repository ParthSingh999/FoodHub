const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'zamato-secret-key';

/**
 * authMiddleware — attaches req.user from Bearer token.
 * If no token is provided, falls back to a Guest user so public
 * routes still work without a token.
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // No token → treat as guest (allows public order/catalog endpoints)
  if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader === 'Bearer ') {
    req.user = { id: 1, name: 'Guest User', email: 'guest@example.com' };
    return next();
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    req.user = { id: 1, name: 'Guest User', email: 'guest@example.com' };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized. Invalid or expired token.' });
  }
};

module.exports = { authMiddleware };
