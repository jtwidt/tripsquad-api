const Amadeus = require('amadeus');
const db = require('../models');

const Flight = db.Flight;
const Trip = db.Trip;
const User = db.User;

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

const searchFlights = async (req, res) => {
  const {
    originCode,
    destinationCode,
    departureDate,
    returnDate,
    travelClass,
    currencyCode,
  } = req.body;

  let result;

  try {
    result = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: originCode,
      destinationLocationCode: destinationCode,
      departureDate,
      returnDate,
      currencyCode,
      adults: '1',
    });
  } catch (error) {
    return res.status(400).send({ error });
  }

  return res.status(200).send({
    flights: result.result.data,
    dictionary: result.result.dictionaries,
    count: result.result.meta.count,
  });
};

const confirmFlight = async (req, res) => {
  const flight = req.body;

  let result;

  const flightConfirmationData = {
    data: {
      type: 'flight-offers-pricing',
      flightOffers: [flight],
    },
  };

  try {
    result = await amadeus.shopping.flightOffers.pricing.post(
      JSON.stringify(flightConfirmationData)
    );
  } catch (error) {
    return res.status(400).send({ error });
  }

  return res.status(200).send({
    warnings: result.result.warnings,
    flightOffers: result.result.data.flightOffers,
    dictionary: result.result.dictionaries,
  });
};

const bookFlight = async (req, res) => {
  const { flight, userId, tripId } = req.body;

  const user = await User.findOne({ where: { id: userId } });

  if (!user) {
    return res.status(400).send({ message: 'Traveller not found.' });
  }

  const trip = await Trip.findOne({ where: { id: tripId } });

  if (!trip) {
    return res.status(400).send({ message: 'Trip not found.' });
  }

  // TODO: Adjust function to reflect correct travel document details
  const flightBookingData = {
    data: {
      type: 'flight-order',
      flightOffers: [flight],
      travelers: [
        {
          id: '1',
          dateOfBirth: '1982-10-24',
          name: {
            firstName: user.firstName,
            lastName: user.lastName,
          },
          gender: 'MALE',
          contact: {
            emailAddress: user.email,
            phones: [
              {
                deviceType: 'MOBILE',
                countryCallingCode: '1',
                number: '2105484829',
              },
            ],
          },
          documents: [
            {
              documentType: 'PASSPORT',
              birthPlace: 'Oklahoma, U.S.A.',
              issuanceLocation: 'Texas',
              number: '123456789',
              expiryDate: '2026-03-23',
              issuanceCountry: 'US',
              validityCountry: 'US',
              nationality: 'US',
              holder: 'true',
            },
          ],
        },
      ],
    },
  };

  try {
    result = await amadeus.booking.flightOrders.post(
      JSON.stringify(flightBookingData)
    );
  } catch (error) {
    return res.status(400).send({ error });
  }

  const flightOrderNumber = result.data.id;

  await Flight.create({ flightOrderNumber, userId, tripId });

  return res.status(200).send({
    id: flightOrderNumber,
    flight: result.data.flightOffers,
    travelers: result.data.travelers,
  });
};

const getTripFlights = async (req, res) => {
  const tripId = req.params.tripId;

  const flights = await Flight.findAll({
    where: { tripId: tripId },
    include: [
      {
        model: User,
        as: 'traveller',
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt'],
        },
      },
      {
        model: Trip,
        as: 'trip',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
    ],
  });

  return res.status(200).send({ flights });
};

const getFlightOrder = async (req, res) => {
  const flightId = req.params.id;

  const flight = await Flight.findOne({ where: { id: flightId } });

  if (!flight) {
    return res.status(400).send({ message: 'No flight found.' });
  }

  let response;
  try {
    response = await amadeus.booking
      .flightOrder(flight.flightOrderNumber)
      .get();
  } catch (error) {
    return res.status(400).send({ error });
  }

  return res.status(200).send({
    flightOrder: response.result.data,
    dictionary: response.result.dictionaries,
  });
};

const deleteFlightOrder = async (req, res) => {
  const flightId = req.params.id;

  const flight = await Flight.findOne({ where: { id: flightId } });

  if (!flight) {
    return res.status(400).send({ message: 'No flight found.' });
  }

  await Flight.destroy({ where: { id: flightId } });

  return res
    .status(200)
    .send({ message: 'Flight was successfully cancelled.' });
};

module.exports = {
  searchFlights,
  confirmFlight,
  bookFlight,
  getTripFlights,
  getFlightOrder,
  deleteFlightOrder,
};
