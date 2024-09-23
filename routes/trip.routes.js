const express = require('express');
const router = express.Router();
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

const {
  createTrip,
  getCreatedTrips,
  getAttendingTrips,
  getAllTrips,
  getTripById,
  updateTrip,
  cancelTrip,
} = require('../controllers/trip.controller');

router.get('/', (req, res) => {
  return res.status(200).send({ message: 'Trip root route' });
});

router.post(
  '/create',
  ClerkExpressWithAuth({ signInUrl: '/sign-in' }),
  createTrip
);
router.get(
  '/created',
  ClerkExpressWithAuth({ signInUrl: '/sign-in' }),
  getCreatedTrips
);
router.get(
  '/attending',
  ClerkExpressWithAuth({ signInUrl: '/sign-in' }),
  getAttendingTrips
);
router.get(
  '/all',
  ClerkExpressWithAuth({ signInUrl: '/sign-in' }),
  getAllTrips
);
router.get(
  '/:tripId',
  ClerkExpressWithAuth({ signInUrl: '/sign-in' }),
  getTripById
);
router.patch(
  '/:tripId',
  ClerkExpressWithAuth({ signInUrl: '/sign-in' }),
  updateTrip
);
router.delete(
  '/:tripId',
  ClerkExpressWithAuth({ signInUrl: '/sign-in' }),
  cancelTrip
);

module.exports = router;
