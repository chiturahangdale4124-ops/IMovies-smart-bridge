const jwt = require('jsonwebtoken');

const generateToken = (userId, role = 'user') => {
  const secret = process.env.JWT_SECRET || 'imovies_super_secret_jwt_key_2026';
  return jwt.sign({ id: userId, role }, secret, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
