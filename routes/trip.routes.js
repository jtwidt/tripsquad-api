const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/clerk-sdk-node');

const { createTrip } = require('../controllers/trip.controller');

router.get('/', (req, res) => {
  return res.status(200).send({ message: 'Trip root route' });
});

router.post('/create', requireAuth(), createTrip);
