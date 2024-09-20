const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/clerk-sdk-node');

const {
  createUser,
  getLoggedInUser,
} = require('../controllers/user.controller');

router.get('/', (req, res) => {
  return res.status(200).send({ message: 'Users root route' });
});

router.post('/register', requireAuth(), createUser);
router.get('/me', requireAuth(), getLoggedInUser);
