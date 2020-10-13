const UserController = require('../controllers/user');
const middlewares = require('../middlewares/auth');
const router = require('express').Router();

router.post('/register', async (req, res) => {
  const response = await UserController.register(req.body.name, req.body.email, req.body.password);
  res.status(response.code).send(response);
});

router.post('/login', async (req, res) => {
  const response = await UserController.login(req.body.email, req.body.password);
  res.status(response.code).send(response);
});

router.get('/details/fetch', middlewares.isLoggedIn, async (req, res) => {
  const response = await UserController.fetchDetails(req.decoded.userId);
  res.status(response.code).send(response);
});

router.post('/details/update', middlewares.isLoggedIn, async (req, res) => {
  const response = await UserController.updateDetails(req.decoded.userId, req.body.name, req.body.email);
  res.status(response.code).send(response);
});

module.exports = router;
