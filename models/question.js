const sequelize = require('sequelize');
const db = require('../database/connection');
const logger = require('../logging/logger');

const schema = {
  questionId: {
    type: sequelize.UUID,
    primaryKey: true
  },
  question: {
    type: sequelize.STRING(255),
    allowNull: false
  },
  pollId: {
    type: sequelize.UUID,
    allowNull: false,
    references: {
      model: 'Polls',
      key: 'pollId'
    }
  }
};

const options = {
  timestamps: false
};
const Question = db.define('Questions', schema, options);

Question.sync({ alter: true })
  .then(() => {
    logger.info('Questions Migration Made');
  })
  .catch(err => {
    logger.error('An Error Occurred:' + err);
  });

module.exports = Question;
