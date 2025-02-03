const jwt = require('jsonwebtoken');


module.exports = ({ meta, config, managers }) => {
  return async (req, res, next) => {
    if (!req.headers || !req.headers.authorization) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = req.headers['authorization']?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
      const decoded = jwt.verify(token, config.dotEnv.LONG_TOKEN_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      console.log('Error', err);
      res.status(400).json({ message: 'Invalid token.' });
    }
  };
};