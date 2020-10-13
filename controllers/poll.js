const Poll = require('../models/poll');
const Choice = require('../models/choices');
const Question = require('../models/question');
const User = require('../models/user');
const uuid4 = require('uuid4');
const logger = require('../logging/logger');
const random=require("random-number");

class PollController {
  static async addPoll (userId, title) {
    try {
      const exist = await User.findOne({ where: { userId: userId } });
      if (!exist) {
        return {
          error: true,
          message: 'No such user found',
          code: 404
        };
      }
      const options={
        min:100000,
        max:999999,
        integer:true
      };
      const poll = {
        pollId: uuid4(),
        title: title,
        userId: userId,
        code:random(options)
      };
      const newPoll = await Poll.create(poll);
      return {
        error: false,
        message: 'Poll Successfully Created',
        code: 201,
        poll: newPoll
      };
    } catch (err) {
      logger.error('An error occurred' + err);
      return {
        error: true,
        message: 'An Error Occurred' + err,
        code: 500
      };
    }
  }

  static async addQuestion (pollId, questionTitle) {
    try {
      const poll = await Poll.findOne({ where: { pollId } });
      if (!poll) {
        return {
          error: true,
          message: 'No such poll exists',
          code: 404
        };
      }
      const question = {
        questionId: uuid4(),
        question: questionTitle,
        pollId: pollId
      };
      const newQuestion = await Question.create(question);
      return {
        error: false,
        message: 'Question created successfully',
        code: 201,
        question: newQuestion
      };
    } catch (err) {
      logger.error('An error occurred' + err);
      return {
        error: true,
        message: 'An Error Occurred' + err,
        code: 500
      };
    }
  }

  static async addChoice (questionId, choiceTitle) {
    try {
      const question = await Question.findOne({ where: { questionId } });
      if (!question) {
        return {
          error: true,
          message: 'No such poll exists',
          code: 404
        };
      }
      const choice = {
        choiceId: uuid4(),
        choice: choiceTitle,
        questionId: questionId
      };
      const newChoice = await Choice.create(choice);
      return {
        error: false,
        message: 'Choice created successfully',
        code: 201,
        choice: newChoice
      };
    } catch (err) {
      logger.error('An error occurred' + err);
      return {
        error: true,
        message: 'An Error Occurred' + err,
        code: 500
      };
    }
  }

  static async fetchPoll (pollId) {
    try {
      const query = {
        where: {
          pollId: pollId
        },
        include: [
          {
            all: true
          },
          {
            model: Question,
            include: [{ all: true }]
          }
        ]
      };
      const poll = await Poll.findOne(query);
      if (!poll) {
        return {
          error: true,
          message: 'No such poll found',
          code: 404
        };
      }
      return {
        error: false,
        message: 'Poll details fetched successfully',
        code: 200,
        poll: poll
      };
    } catch (err) {
      logger.error('An error occurred' + err);
      return {
        error: true,
        message: 'An Error Occurred' + err,
        code: 500
      };
    }
  }

  static async fetchQuestion (questionId) {
    try {
      const query = {
        where: {
          questionId: questionId
        },
        include:
        [
          {
            all: true
          }
        ]
      };
      const question = await Question.findOne(query);
      if (!question) {
        return {
          error: true,
          message: 'No such question found',
          code: 404
        };
      }
      return {
        error: false,
        message: 'Poll details fetched successfully',
        code: 200,
        question: question
      };
    } catch (err) {
      logger.error('An error occurred' + err);
      return {
        error: true,
        message: 'An Error Occurred' + err,
        code: 500
      };
    }
  }

  static async chooseOption (choiceId, increment) {
    try {
      const filter = {
        where: {
          choiceId
        }
      };
      const exists = await Choice.findOne();
      if (!exists) {
        return {
          error: true,
          message: 'No such option exists',
          code: 404
        };
      }
      const query = {
        stat: +increment
      };
      await Choice.increment(query, filter);
      return {
        error: false,
        message: 'Successfully chosen option',
        code: 200
      };
    } catch (err) {
      logger.error('An error occurred' + err);
      return {
        error: true,
        message: 'An Error Occurred' + err,
        code: 500
      };
    }
  }
}

module.exports = PollController;
