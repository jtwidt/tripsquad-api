const express = require('express');
const {
  getPointsOfInterest,
  getActivities,
} = require('../controllers/activity.controller');
const router = express.Router();

router.get('/', (req, res) => {
  return res.status(200).send({ message: 'Activities root route' });
});

router.post('/pois', getPointsOfInterest);
router.post('/activities', getActivities);

module.exports = router;
