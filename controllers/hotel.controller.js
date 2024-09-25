const { db } = require('../models');

const { Hotel, HotelReservation, Trip, Location, User } = db;

// CREATE HOTEL
const createHotel = async (req, res) => {
  // Get the new hotel properties from the request body
  let {
    hotelName,
    checkIn,
    checkOut,
    numberOfRooms,
    confirmationNumber,
    tripId,
    locationId,
    userIds,
  } = req.body;

  // Create JS date objects
  checkIn = new Date(checkIn);
  checkOut = new Date(checkOut);

  // Create the hotel object as long as there is not one with matching details
  let [hotel, created] = await Hotel.findOrCreate({
    hotelName,
    checkIn,
    checkOut,
    numberOfRooms,
    confirmationNumber,
  });

  // If the hotel wasn't created send an error message
  if (!created) {
    return res.status(400).send({ message: 'Hotel already exists' });
  }

  // Get the trip associated with the trip ID
  const trip = await Trip.findOne({ where: { id: tripId } });

  // If no trip is found send an error message
  if (!trip) {
    return res.status(400).send({ message: 'No trip found' });
  }

  // Get the location associated with the location ID
  let location = await Location.findOne({ where: { id: locationId } });

  // If no location is found send an error message
  if (!location) {
    return res.status(400).send({ message: 'No location found' });
  }

  // Add the trip and location to the hotel
  hotel.setTrip(trip);
  hotel.setLocation(location);

  // Set up an empty array to hold the list of users
  const userArray = [];

  // Loop through the given IDs and create the reservation association
  for (let userId in userIds) {
    // Get the user associated with the ID
    const user = await User.findOne({ where: { id: userId } });

    // If no user is found, skip the ID and move onto the next one
    if (!user) continue;

    // Create a new reservation object
    const userReservation = await HotelReservation.create({
      status: 'pending',
    });

    // Attach the hotel and user to the reservation
    userReservation.setHotel(hotel);
    userReservation.setUser(user);

    // Add the reservation to the array
    userArray.push(userReservation);
  }

  // Add the reservations to the hotel object
  hotel.setReservations(userArray);

  // Refetch the hotel with full information
  hotel = await Hotel.findOne({
    where: {
      id: hotel.id,
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
    include: [
      {
        model: Trip,
        as: 'trip',
        attributes: ['tripName'],
      },
      {
        model: Location,
        as: 'location',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
      {
        model: HotelReservation,
        as: 'reservations',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        include: [
          {
            model: User,
            as: 'user',
            attributes: {
              exclude: ['createdAt', 'updatedAt'],
            },
          },
        ],
      },
    ],
  });

  // Return the object to the user
  return res.status(201).send({ hotel });
};

// GET HOTEL BY ID
const getHotelById = async (req, res) => {
  // Get the hotel ID from the URL
  const { hotelId } = req.params;

  // Search for the hotel matching the ID
  const hotel = await Hotel.findOne({
    where: {
      id: hotelId,
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
    include: [
      {
        model: Trip,
        as: 'trip',
        attributes: ['tripName'],
      },
      {
        model: Location,
        as: 'location',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
      {
        model: HotelReservation,
        as: 'reservations',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        include: [
          {
            model: User,
            as: 'user',
            attributes: {
              exclude: ['createdAt', 'updatedAt'],
            },
          },
        ],
      },
    ],
  });

  // If no hotel is found send an error message
  if (!hotel) {
    return res.status(400).send({ message: 'No hotel found' });
  }

  return res.status(200).send({ hotel });
};

// GET USER HOTEL RESERVATIONS
const getUserHotelReservation = async (req, res) => {
  // get the logged in users clerk ID
  const { userId: clerkId } = req.auth;

  // Get the user with the matching Clerk ID
  const user = await User.findOne({ where: { clerkId } });

  // If no user is found return an error message
  if (!user) {
    return res.status(400).send({ message: 'No user found' });
  }

  const hotels = await Hotel.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
    include: [
      {
        model: Trip,
        as: 'trip',
        attributes: ['tripName'],
      },
      {
        model: Location,
        as: 'location',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
      {
        model: HotelReservation,
        as: 'reservations',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        include: [
          {
            model: User,
            as: 'user',
            where: { id: user.id },
            attributes: {
              exclude: ['createdAt', 'updatedAt'],
            },
          },
        ],
      },
    ],
  });

  return res.status(200).send({ hotels });
};

// GET HOTEL BY LOCATION
const getHotelByLocation = async (req, res) => {
  // Get the location ID from the URL
  const { locationId } = req.params;

  // Get the location matching the ID
  const location = await Location.findOne({ where: { id: locationId } });

  // If no location is found send an error message
  if (!location) {
    return res.status(400).send({ message: 'No location found' });
  }

  // Find all the hotels that match the location ID
  const hotels = await Hotel.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
    include: [
      {
        model: Trip,
        as: 'trip',
        attributes: ['tripName'],
      },
      {
        model: Location,
        as: 'location',
        where: {id: location.id},
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
      {
        model: HotelReservation,
        as: 'reservations',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        include: [
          {
            model: User,
            as: 'user',
            attributes: {
              exclude: ['createdAt', 'updatedAt'],
            },
          },
        ],
      },
    ],
  });

  // Return the results to the user
  return res.status(200).send({ hotels})
};

// GET HOTEL BY TRIP
const getTripHotels = async (req, res) => {
  // Get the trip ID from the URL
  const { tripId } = req.params;

  // Get the trip matching the ID
  const trip = await Trip.findOne({ where: { id: tripId } });

  // If no trip is found send an error message
  if (!trip) {
    return res.status(400).send({ message: 'No trip found' });
  }

  // Find all the hotels that match the trip ID
  const hotels = await Hotel.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
    include: [
      {
        model: Trip,
        as: 'trip',
        where: {id: trip.id},
        attributes: ['tripName'],
      },
      {
        model: Location,
        as: 'location',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
      {
        model: HotelReservation,
        as: 'reservations',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        include: [
          {
            model: User,
            as: 'user',
            attributes: {
              exclude: ['createdAt', 'updatedAt'],
            },
          },
        ],
      },
    ],
  });

  // Return the results to the user
  return res.status(200).send({ hotels})
};

// UPDATE HOTEL
const updateHotel = async (req, res) => {
  // Get the hotel ID from the URL
  const {hotelId} = req.params;
};

// DELETE HOTEL
const deleteHotel = async (req, res) => {};

module.exports = {
  createHotel,
  getHotelById,
  getUserHotelReservation,
  getHotelByLocation,
  getTripHotels,
  updateHotel,
  deleteHotel,
};
