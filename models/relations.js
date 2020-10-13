const User = require('./user');
const Poll = require('./poll');
const Choices = require('./choices');
const Questions = require('./question');

User.hasMany(Poll, { foreignKey: 'userId' });
Poll.hasMany(Questions, { foreignKey: 'pollId' });
Questions.hasMany(Choices, { foreignKey: 'questionId' });
