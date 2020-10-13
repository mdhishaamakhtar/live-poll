const jwt = require('jsonwebtoken');
const logger = require('../logging/logger');

exports.isLoggedIn = async (req, res, next) => {
  const tokenHeader = req.header('Authorization');
  if (!tokenHeader) {
    const response = {
      error: true,
      message: 'Access is denied',
      code: 401
    };
    return res.status(response.code).send(response);
  }
  try {
    const token = tokenHeader.split(' ');
    req.decoded = jwt.verify(token[1], process.env.TOKEN_SECRET);
    next();
  } catch (err) {
    logger.error('Invalid Token: ' + err);
    const response = {
      error: true,
      message: 'Token is invalid',
      code: 400
    };
    return res.status(response.code).send(response);
  }
};
