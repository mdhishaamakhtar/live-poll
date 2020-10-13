const middlewares = require('../middlewares/auth');
const PollController = require('../controllers/poll');
const router = require('express').Router();

router.post('/create', middlewares.isLoggedIn, async (req, res) => {
  const response = await PollController.addPoll(req.decoded.userId, req.body.title);
  res.status(response.code).send(response);
});

router.post('/question/create', middlewares.isLoggedIn, async (req, res) => {
  const response = await PollController.addQuestion(req.body.pollId, req.body.title);
  res.status(response.code).send(response);
});

router.post('/choice/create', middlewares.isLoggedIn, async (req, res) => {
  const response = await PollController.addChoice(req.body.questionId, req.body.choice);
  res.status(response.code).send(response);
});

router.get('/details/fetch', middlewares.isLoggedIn, async (req, res) => {
  const response = await PollController.fetchPoll(req.query.pollId);
  res.status(response.code).send(response);
});

router.get('/question/details/fetch', middlewares.isLoggedIn, async (req, res) => {
  const response = await PollController.fetchQuestion(req.query.questionId);
  res.status(response.code).send(response);
});

router.post('/choice/choose', middlewares.isLoggedIn, async (req, res) => {
  const response = await PollController.chooseOption(req.body.choiceId, req.body.increment);
  res.status(response.code).send(response);
});

module.exports = router;
