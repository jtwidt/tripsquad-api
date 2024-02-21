const express = require('express');
const { loginUser } = require('../controllers/auth.controller');
const router = express.Router();

router.get('/', (req, res) => {
  return res.status(200).send({ message: 'Auth root route' });
});

router.post('/login', loginUser);

module.exports = router;
