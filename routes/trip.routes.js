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
  modifyTripItinerary,
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
  '/:tripId',
  ClerkExpressWithAuth({ signInUrl: '/sign-in' }),
  getTripById
);
router.patch(
  '/:tripId',
  ClerkExpressWithAuth({ signInUrl: '/sign-in' }),
  updateTrip
);
router.patch(
  '/:tripId/attendees',
  ClerkExpressWithAuth({ signInUrl: '/sign-in' }),
  modifyTripAttendees
);
router.patch(
  '/:tripId/flights',
  ClerkExpressWithAuth({ signInUrl: '/sign-in' }),
  modifyTripFlights
);
router.patch(
  '/:tripId/hotels',
  ClerkExpressWithAuth({ signInUrl: '/sign-in' }),
  modifyTripHotels
);
router.patch(
  '/:tripId/itinerary',
  ClerkExpressWithAuth({ signInUrl: '/sign-in' }),
  modifyTripItinerary
);
router.delete(
  '/:tripId',
  ClerkExpressWithAuth({ signInUrl: '/sign-in' }),
  deleteTrip
);
