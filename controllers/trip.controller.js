const db = require('../models');

const { User, Trip, Flight, Hotel, ItineraryItem } = db;

// CREATE A TRIP
const createTrip = async (req, res) => {
  // Gets the clerk user ID provided by the Clerk middleware
  const { userId: clerkId } = req.auth;

  // Get the required trip items from the request body
  const { tripName, startDate, endDate, location } = req.body;

  startDate = new Date(startDate);
  endDate = new Date(endDate);

  // Get the user that has the clerkId
  const creatingUser = await User.findOne({ where: { clerkId } });

  // Send an error message if no user is found
  if (!creatingUser) {
    return res.status(400).send({ message: 'User not found' });
  }

  // Create the basic trip with the required non-null fields
  const trip = await Trip.create({
    tripName,
    startDate,
    endDate,
    location,
  });

  // Add the found user as the creator
  await trip.setCreator(creatingUser);

  // Retrieve the full object
  const updatedTrip = await Trip.findOne({
    where: {
      id: trip.id,
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
    include: [
      {
        model: User,
        as: 'creator',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
      {
        model: Flight,
        as: 'flights',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
      {
        model: Hotel,
        as: 'hotels',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
      {
        model: ItineraryItem,
        as: 'itinerary',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
      {
        model: User,
        as: 'attendees',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
    ],
    order: [[{ model: ItineraryItem, as: 'itinerary' }, 'startTime', 'ASC']],
  });

  // Return the full object to the user
  return res.status(200).send({ trip: updatedTrip });
};

// GET A SPECIFIC TRIP
const getTripById = async (req, res) => {
  // Get the trip ID from the URL
  const { tripId } = req.params;

  // Search the database for the trip
  const trip = await Trip.findOne({
    where: {
      id: tripId,
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
    include: [
      {
        model: User,
        as: 'creator',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
      {
        model: Flight,
        as: 'flights',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
      {
        model: Hotel,
        as: 'hotels',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
      {
        model: ItineraryItem,
        as: 'itinerary',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        include: [
          {
            model: User,
            as: 'participants',
            attributes: {
              exclude: ['createdAt', 'updatedAt'],
            },
          },
        ],
      },
      {
        model: User,
        as: 'attendees',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
    ],
    order: [[{ model: ItineraryItem, as: 'itinerary' }, 'startTime', 'ASC']],
  });

  // If no trip was found send an error message
  if (!trip) {
    return res.status(400).send({ message: 'No trip found' });
  }

  // Send the found trip
  return res.status(200).send({ trip });
};

// GET CREATED TRIPS
const getCreatedTrips = async (req, res) => {
  // Get the Clerk ID of the logged in user
  const { userId: clerkId } = req.auth;

  // Search the database for the user
  const user = await User.findOne({ where: { clerkId } });

  // If no user is found send an error message
  if (!user) {
    return res.status(400).send({ message: 'User not found' });
  }

  // Find all the trips where the creator ID matches the user with the Clerk ID
  const trips = await Trip.findAll({
    where: {
      creatorId: user.id,
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
    include: [
      {
        model: User,
        as: 'creator',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
      {
        model: Flight,
        as: 'flights',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
      {
        model: Hotel,
        as: 'hotels',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
      {
        model: ItineraryItem,
        as: 'itinerary',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        include: [
          {
            model: User,
            as: 'participants',
            attributes: {
              exclude: ['createdAt', 'updatedAt'],
            },
          },
        ],
      },
      {
        model: User,
        as: 'attendees',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
    ],
    order: [[{ model: ItineraryItem, as: 'itinerary' }, 'startTime', 'ASC']],
  });

  // Send all the found trips
  return res.status(200).send({ trips });
};

// GET ATTENDING TRIPS
const getAttendingTrips = async (req, res) => {
  const { userId: clerkId } = req.auth;

  const user = await User.findOne({ where: { clerkId } });

  if (!user) {
    return res.status(400).send({ message: 'No user found' });
  }

  const trips = await Trip.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
    include: [
      {
        model: User,
        as: 'creator',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
      {
        model: Flight,
        as: 'flights',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
      {
        model: Hotel,
        as: 'hotels',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
      {
        model: ItineraryItem,
        as: 'itinerary',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        include: [
          {
            model: User,
            as: 'participants',
            attributes: {
              exclude: ['createdAt', 'updatedAt'],
            },
          },
        ],
      },
      {
        model: User,
        as: 'attendees',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
    ],
    order: [[{ model: ItineraryItem, as: 'itinerary' }, 'startTime', 'ASC']],
  });

  return res.status(200).send({ trips });
};

// GET ALL TRIPS
const getAllTrips = async (req, res) => {};

// UPDATE TRIP
const updateTrip = async (req, res) => {};

// MODIFY TRIP ATTENDEES
const modifyTripAttendees = async (req, res) => {};

// MODIFY FLIGHTS FOR TRIP
const modifyTripFlights = async (req, res) => {};

// MODIFY HOTELS FOR TRIP
const modifyTripHotels = async (req, res) => {};

// MODIFY TRIP ITINERARY
const modifyTripItinerary = async (req, res) => {};

// DELETE TRIP
const deleteTrip = async (req, res) => {};

module.exports = {
  createTrip,
  getTripById,
  getCreatedTrips,
  getAttendingTrips,
  getAllTrips,
  updateTrip,
  modifyTripAttendees,
  modifyTripFlights,
  modifyTripHotels,
  modifyTripItinerary,
  deleteTrip,
};
