const express = require('express');
const router = express.Router();
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

const {
    createLocation,
    getLocationById,
    getAllLocations,
    getCountryLocations,
    getCityLocations,
    updateLocation,
    deleteLocation
} = require('../controllers/location.controller');

router.get('/', (req, res) => {
    return res.status(200).send({ message: 'Locations root route' });
  });

  router.post('/create', ClerkExpressWithAuth(), createLocation);
  router.get('/all', ClerkExpressWithAuth(), getAllLocations)
  

module.exports = router