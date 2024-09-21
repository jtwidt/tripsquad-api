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
  modifyTripAttendees,
  modifyTripFlights,
  modifyTripHotels,
  deleteTrip,
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
  '/:id',
  ClerkExpressWithAuth({ signInUrl: '/sign-in' }),
  getTripById
);
router.patch(
  '/:id',
  ClerkExpressWithAuth({ signInUrl: '/sign-in' }),
  updateTrip
);
router.patch(
  '/:id/attendees',
  ClerkExpressWithAuth({ signInUrl: '/sign-in' }),
  modifyTripAttendees
);
router.patch(
  '/:id/flights',
  ClerkExpressWithAuth({ signInUrl: '/sign-in' }),
  modifyTripFlights
);
router.patch(
  '/:id/hotels',
  ClerkExpressWithAuth({ signInUrl: '/sign-in' }),
  modifyTripHotels
);
router.delete(
  '/:id',
  ClerkExpressWithAuth({ signInUrl: '/sign-in' }),
  deleteTrip
);
