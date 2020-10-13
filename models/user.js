const sequelize = require('sequelize');
const db = require('../database/connection');
const logger = require('../logging/logger');

const schema = {
  userId: {
    type: sequelize.UUID,
    primaryKey: true
  },
  name: {
    type: sequelize.STRING(255),
    allowNull: false
  },
  email: {
    type: sequelize.STRING(255),
    allowNull: false,
    isEmail: true
  },
  password: {
    type: sequelize.STRING(255),
    allowNull: false
  }
};

const options = {
  timestamps: false
};
const User = db.define('Users', schema, options);

User.sync({ alter: true })
  .then(() => {
    logger.info('Users Migration Made');
  })
  .catch(err => {
    logger.error('An Error Occurred:' + err);
  });

module.exports = User;
