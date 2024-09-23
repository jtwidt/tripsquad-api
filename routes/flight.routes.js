const express = require('express');
const router = express.Router();
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

const { addFlightToTrip } = require('../controllers/flight.controller');

router.get('/', (req, res) => {
  return res.status(200).send({ message: 'Trip root route' });
});

router.post('/:tripId', ClerkExpressWithAuth(), addFlightToTrip);

module.exports = router;
