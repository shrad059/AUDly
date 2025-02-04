const jwt = require('jsonwebtoken');

console.log('hi')

const authMiddleware = (req, res, next) => {
    console.log('hi2')
  const token = req.header('Authorization')?.replace('Bearer ', ''); 

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = decoded.user; 
    next();
  } catch (err) {
    console.log('Token verification failed:', err);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
