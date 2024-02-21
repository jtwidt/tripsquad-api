const express = require('express');

const {
  searchFlights,
  confirmFlight,
  bookFlight,
  getTripFlights,
  getFlightOrder,
  deleteFlightOrder,
} = require('../controllers/flight.controller');

const router = express.Router();

router.get('/', (req, res) => {
  return res.status(200).send({ message: 'Flights root route' });
});

router.post('/search', searchFlights);
router.post('/confirm', confirmFlight);
router.post('/book', bookFlight);
router.get('/trip/:tripId', getTripFlights);
router.get('/:id', getFlightOrder);
router.delete('/:id', deleteFlightOrder);

module.exports = router;
