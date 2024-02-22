const express = require('express');

const {
  searchHotelsByCity,
  searchHotelOffers,
  confirmOfferDetails,
  bookHotel,
  getHotelRatings,
} = require('../controllers/hotel.controller');

const router = express.Router();

router.get('/', (req, res) => {
  return res.status(200).send({ message: 'Hotels root route' });
});

router.post('/search', searchHotelsByCity);
router.post('/offers', searchHotelOffers);
router.get('/offers/:id', confirmOfferDetails);
router.post('/book', bookHotel);
router.post('/ratings', getHotelRatings);

module.exports = router;
