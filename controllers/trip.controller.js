const db = require('../models');

const { User, Trip, Flight, Hotel, ItineraryItem } = db;

// CREATE A TRIP
const createTrip = async (req, res) => {
  // Gets the clerk user ID provided by the Clerk middleware
  const { userId: clerkId } = req.auth;

  // Get the required trip items from the request body
  let { tripName, startDate, endDate, location } = req.body;

  // Turn the dates into JS dates
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
    referralCode,
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
  // Get the Clerk ID of the logged in user
  const { userId: clerkId } = req.auth;

  // Find the user with the associated Clerk ID
  const user = await User.findOne({ where: { clerkId } });

  // If no user found return an error message
  if (!user) {
    return res.status(400).send({ message: 'No user found' });
  }

  // Search for trips where the user is in the list of attendees
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
        where: { userId: user.id },
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
    ],
    order: [[{ model: ItineraryItem, as: 'itinerary' }, 'startTime', 'ASC']],
  });

  // Return the list of found trips
  return res.status(200).send({ trips });
};

// GET ALL TRIPS
const getAllTrips = async (req, res) => {
  // Retrieve all the trips from the database
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

  // Return the list of trips
  return res.status(200).send({ trips });
};

// UPDATE TRIP
const updateTrip = async (req, res) => {
  // Get the trip ID from the URL
  const { tripId } = req.params;

  // Get the Clerk ID of the logged in user
  const { userId: clerkId } = req.auth;

  // Get the user associated with the Clerk ID
  const user = await User.findOne({
    where: { clerkId },
  });

  // If the user isn't found return an error message
  if (!user) {
    return res.status(400).send({ message: 'No user found' });
  }

  // Find the trip for the given trip ID
  let trip = await Trip.findOne({ where: { id: tripId } });

  // If the trip isn't found return an error message
  if (!trip) {
    return res.status(400).send({ message: 'No trip found' });
  }

  // If the logged user is not the creator they are not allowed to modify the trip
  if (trip.creatorId !== user.id) {
    return res.status(403).send({ message: 'Not authorized' });
  }

  // Get the trip info from the request body
  let { tripName, startDate, endDate, location, status } = req.body;

  // Translate the dates to Javascript dates
  startDate = new Date(startDate);
  endDate = new Date(endDate);

  // Create an object with all the updated/original values
  const updateObject = {
    tripName,
    startDate,
    endDate,
    location,
    status,
  };

  // Update the trip with the new info
  await Trip.update(updateObject, {
    where: { id: tripId },
  });

  trip = await Trip.findOne({
    where: { id: tripId },
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
};

// DELETE TRIP
const deleteTrip = async (req, res) => {};

module.exports = {
  createTrip,
  getTripById,
  getCreatedTrips,
  getAttendingTrips,
  getAllTrips,
  updateTrip,
  deleteTrip,
};
