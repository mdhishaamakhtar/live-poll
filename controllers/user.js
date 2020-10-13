const User = require('../models/user');
const logger = require('../logging/logger');
const uuid4 = require('uuid4');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Poll = require('../models/poll');
const Question = require('../models/question');

class UserController {
  static async register (name, email, pass) {
    try {
      const emailExists = await User.findOne({
        where: {
          email
        }
      });
      if (emailExists) {
        return {
          error: true,
          message: 'An account with this email already exists',
          code: 409
        };
      }
      const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
      const password = await bcrypt.hash(pass, salt);
      const user = {
        userId: uuid4(),
        name: name,
        email: email,
        password: password
      };
      await User.create(user);
      return {
        error: false,
        message: 'Your Account Has Been Created Successfully',
        code: 201
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

  static async login (email, password) {
    try {
      const filter = {
        where: {
          email
        }
      };
      const exists = await User.findOne(filter);
      if (!exists) {
        return {
          error: true,
          message: 'No such user exists',
          code: 404
        };
      }
      const pass = await bcrypt.compare(password, exists.password);
      if (!pass) {
        return {
          error: true,
          message: 'Incorrect Password',
          code: 401
        };
      }
      const token = jwt.sign({ userId: exists.userId }, process.env.TOKEN_SECRET);
      return {
        error: false,
        message: 'Login Successful',
        code: 200,
        JWT: token,
        userDetails: exists
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

  static async fetchDetails (userId) {
    try {
      const query = {
        where: {
          userId: userId
        },
        include:
        [
          {
            all: true
          },
          {
            model: Poll,
            include:
            [
              {
                all: true
              },
              {
                model: Question,
                include:
                  [
                    {
                      all: true
                    }
                  ]
              }
            ]
          }
        ]
      };
      const exist = await User.findOne(query);
      if (!exist) {
        return {
          error: true,
          message: 'No such user found',
          code: 404
        };
      }
      return {
        error: false,
        message: 'User found',
        code: 200,
        userDetails: exist
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

  static async updateDetails (userId, name, email) {
    try {
      const filter = { where: { userId } };
      const exist = await User.findOne();
      if (!exist) {
        return {
          error: true,
          message: 'No such user found',
          code: 404
        };
      }
      const query = {
        name: name,
        email: email
      };
      await User.update(query, filter);
      return {
        error: false,
        message: 'The details have been successfully updated',
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

module.exports = UserController;
