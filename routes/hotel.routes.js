const express = require('express');
const router = express.Router();
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

const {
  createHotel,
  getHotelById,
  getUserHotelReservation,
  getHotelByLocation,
  getTripHotels,
  updateHotel,
  cancelHotel,
} = require('../controllers/hotel.controller');

router.get('/', (req, res) => {
  return res.status(200).send({ message: 'Hotels root route' });
});

router.post('/create', ClerkExpressWithAuth(), createHotel);
router.get('/user/', ClerkExpressWithAuth(), getUserHotelReservation);
router.get('/location/:locationId', ClerkExpressWithAuth(), getHotelByLocation);
router.get('/trip/:tripId', ClerkExpressWithAuth(), getTripHotels);
router.get('/:hotelId', ClerkExpressWithAuth(), getHotelById);
router.patch('/:hotelId', ClerkExpressWithAuth(), updateHotel);
router.delete('/:hotelId', ClerkExpressWithAuth(), cancelHotel);

module.exports = router;
