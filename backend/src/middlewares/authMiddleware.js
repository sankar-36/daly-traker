const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401);
    return next(new Error('Not authorized, no token'));
  }

  const authParts = authHeader.trim().split(/\s+/);
  const [scheme, token] = authParts;

  if (authParts.length !== 2 || scheme.toLowerCase() !== 'bearer' || !token) {
    res.status(401);
    return next(new Error('Not authorized, invalid authorization header'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401);
      return next(new Error('Not authorized, user not found'));
    }

    req.user = user;
    return next();
  } catch (error) {
    res.status(401);

    if (error.name === 'TokenExpiredError') {
      return next(new Error('Not authorized, token expired'));
    }

    return next(new Error('Not authorized, token failed'));
  }
};

module.exports = { protect };
