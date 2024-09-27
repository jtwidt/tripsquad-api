const db = require('../models');

const { ItineraryItem, ItineraryItemUser, User, Trip } = db;

// CREATE ITINERARY ITEM
const createItineraryItem = async (req, res) => {
  // Get all the properties from the request body
  let { type, name, startTime, endTime, confirmationNumber, userIds } =
    req.body;

  // Create JS date objects for the given start and end datetime
  startTime = new Date(startTime);
  endTime = new Date(endTime);

  // Create the default object
  let itineraryItem = await ItineraryItem.create({
    type,
    name,
    startTime,
    endTime,
    confirmationNumber,
  });

  // Create the empty array for the participants
  let participants = [];

  // Loop through the given users and create the participant object for each
  for (let userId in userIds) {
    // Search for the user with the matching ID
    const user = await User.findOne({ where: { id: userId } });

    // If the user isn't found, skip and continue to the next
    if (!user) continue;

    // Create the participant object
    const participant = await ItineraryItemUser.create({
      status: 'pending',
    });

    // Attach the itinerary item and user
    participant.setItineraryItem(itineraryItem);
    participant.setUser(user);

    // Add the participant to the array
    participants.push(participant);
  }

  // Attach the participants to the itinerary item
  itineraryItem.setParticipants(participants);

  // Refetch the item with all data
  itineraryItem = await ItineraryItem.findOne({
    where: { id: itineraryItem.id },
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
        model: ItineraryItemUser,
        as: 'participants',
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

  return res.status(201).send({ itineraryItem });
};

// GET ALL ITINERARY ITEMS
const getAllItineraryItems = async (req, res) => {
  // Get all the itinerary items
  const itineraryItems = await ItineraryItems.findAll({
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
        model: ItineraryItemUser,
        as: 'participants',
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

  // Send the results back to the user
  return res.status(200).send({ itineraryItems });
};

// GET ALL TRIP ITINERARY ITEMS
const getTripItineraryItems = async (req, res) => {
  // Get the trip ID from the URL
  const { tripId } = req.params;

  // Make sure that the trip actually exists
  const trip = await Trip.findOne({ where: { id: tripId } });

  // If the trip isn't found send an error message
  if (!trip) {
    return res.status(400).send({ message: 'No trip found' });
  }

  // Find all the itinerary items matching the trip ID
  const itineraryItems = await ItineraryItem.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
    include: [
      {
        model: Trip,
        as: 'trip',
        where: { tripId },
        attributes: ['tripName'],
      },
      {
        model: ItineraryItemUser,
        as: 'participants',
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

  // Return the found items to the user
  return res.status(200).send({ itineraryItems });
};

// GET TRIP DAY ITINERARY ITEMS
const getTripDayItineraryItems = async (req, res) => {
  // Get the trip Id and day from the URL
  let { tripId, day } = req.params;

  // Search for the trip matching the ID
  const trip = await Trip.findOne({ where: { id: tripId } });

  // If no trip is found send a message
  if (!trip) {
    return res.status(400).send({ message: 'No trip found' });
  }

  // Turn the day into a JS date object
  day = new Date(day);

  // Find all the itinerary items matching the trip ID
  const itineraryItems = await ItineraryItem.findAll({
    where: { startTime: day },
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
    include: [
      {
        model: Trip,
        as: 'trip',
        where: { tripId },
        attributes: ['tripName'],
      },
      {
        model: ItineraryItemUser,
        as: 'participants',
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

  // Send the results back to the user
  return res.status(200).send({ itineraryItems });
};

// GET TRIP USER ITINERARY ITEMS
const getTripUserItineraryItems = async (req, res) => {
  // Get the logged in users Clerk ID
  const { userId: clerkId } = req.auth;

  // Get the trip ID from the URL
  const { tripId } = req.params;

  // Get the user matching the Clerk ID
  const user = await User.findOne({ where: { clerkId } });

  // If no user is found return an error message
  if (!user) {
    return res.status(400).send({ message: 'No user found' });
  }

  // Get the trip matching the given ID
  const trip = await Trip.findOne({ where: { id: tripId } });

  // If no trip is found send an error message
  if (!trip) {
    return res.status(400).send({ message: 'No trip found' });
  }

  // Find the itinerary items matching the trip and user IDs
  const itineraryItems = await ItineraryItem.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
    include: [
      {
        model: Trip,
        as: 'trip',
        where: { tripId },
        attributes: ['tripName'],
      },
      {
        model: ItineraryItemUser,
        as: 'participants',
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

  // Return the list of items to the user
  return res.status(200).send({ itineraryItems });
};

// GET TRIP USER DAY ITINERARY ITEMS
const getTripUserDayItineraryItems = async (req, res) => {};

// UPDATE ITINERARY ITEMS
const updateItineraryItem = async (req, res) => {};

// DELETE ITINERARY ITEMS
const deleteItineraryItems = async (req, res) => {};

module.exports = {
  createItineraryItem,
  getAllItineraryItems,
  getTripItineraryItems,
  getTripDayItineraryItems,
  getTripUserItineraryItems,
  getTripUserDayItineraryItems,
  updateItineraryItem,
  deleteItineraryItems,
};
