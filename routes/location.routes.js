const express = require('express');
const { getLocationInfo } = require('../controllers/location.controller');
const router = express.Router();

router.get('/', (req, res) => {
  return res.status(200).send({ message: 'Locations root route' });
});

router.post('/search', getLocationInfo);

module.exports = router;
