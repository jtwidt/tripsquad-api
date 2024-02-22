const Amadeus = require('amadeus');
const db = require('../models');

const Hotel = db.Hotel;
const Trip = db.Trip;
const User = db.User;

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

const searchHotelsByCity = async (req, res) => {
  const { cityCode } = req.body;

  let response;

  try {
    response = await amadeus.referenceData.locations.hotels.byCity.get({
      cityCode,
    });
  } catch (error) {
    return res.status(400).send({ error });
  }

  return res
    .status(200)
    .send({ count: response.result.meta.count, hotels: response.result.data });
};

const searchHotelOffers = async (req, res) => {
  const { hotelId, adults, checkInDate, checkOutDate } = req.body;

  let response;

  try {
    response = await amadeus.shopping.hotelOffersSearch.get({
      hotelIds: hotelId,
      adults,
      checkInDate,
      checkOutDate,
    });
  } catch (error) {
    return res.status(400).send({ error });
  }

  return res.status(200).send({ offers: response.data });
};

const confirmOfferDetails = async (req, res) => {
  const id = req.params.id;

  let response;

  try {
    response = await amadeus.shopping.hotelOfferSearch(id).get();
  } catch (error) {
    return res.status(400).send({ error });
  }

  return res.status(200).send({ offer: response.data });
};

// TODO: modify function to get user contact details and payment info
const bookHotel = async (req, res) => {
  const { offerId, guestId, tripId } = req.body;

  const guest = await User.findOne({ where: { id: guestId } });

  if (!guest) {
    return res.status(400).send({ message: 'User not found.' });
  }

  const trip = await Trip.findOne({ where: { id: tripId } });

  if (!trip) {
    return res.status(400).send({ message: 'Trip not found.' });
  }

  const data = {
    data: {
      offerId,
      guests: [
        {
          id: 1,
          name: {
            title: 'Mr',
            firstName: guest.firstName,
            lastName: guest.lastName,
          },
          contact: {
            phone: '+12105484829',
            email: guest.email,
          },
        },
      ],
      payments: [
        {
          id: 1,
          method: 'creditCard',
          card: {
            vendorCode: 'VI',
            cardNumber: '4242424242424242',
            expiryDate: '2028-07',
          },
        },
      ],
    },
  };

  let response;

  try {
    response = await amadeus.booking.hotelBookings.post(JSON.stringify(data));
  } catch (error) {
    return res.status(400).send({ error });
  }

  const booking = await Hotel.create({
    bookingId: response.data[0].id,
    providerConfirmationId: response.data[0].providerConfirmationId,
    userId: guestId,
    tripId,
  });

  return res.status(200).send({ booking });
};

const getHotelRatings = async (req, res) => {
  const { hotelIds } = req.body;

  const hotelIdsString = hotelIds.join(',');

  let response;

  try {
    response = await amadeus.eReputation.hotelSentiments.get({
      hotelIds: hotelIdsString,
    });
  } catch (error) {
    return res.status(400).send({ error });
  }

  return res
    .status(200)
    .send({ count: response.result.meta.count, ratings: response.data });
};

module.exports = {
  searchHotelsByCity,
  searchHotelOffers,
  confirmOfferDetails,
  bookHotel,
  getHotelRatings,
};
