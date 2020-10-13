const sequelize = require('sequelize');
const db = require('../database/connection');
const logger = require('../logging/logger');

const schema = {
  code: {
    type: sequelize.INTEGER,
  },
  pollId: {
    type: sequelize.UUID,
    primaryKey: true
  },
  title: {
    type: sequelize.STRING(255),
    allowNull: false
  },
  userId: {
    type: sequelize.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'userId'
    }
  }
};

const options = {
  timestamps: false
};
const Poll = db.define('Polls', schema, options);

Poll.sync({ alter: true })
  .then(() => {
    logger.info('Polls Migration Made');
  })
  .catch(err => {
    logger.error('An Error Occurred:' + err);
  });

module.exports = Poll;
