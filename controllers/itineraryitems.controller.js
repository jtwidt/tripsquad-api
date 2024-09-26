const db = require('../models');

const { ItineraryItem, ItineraryItemUser, User } = db;

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
const getAllItineraryItems = async (req, res) => {};

// GET ALL TRIP ITINERARY ITEMS
const getTripItineraryItems = async (req, res) => {};

// GET TRIP DAY ITINERARY ITEMS
const getTripDayItineraryItems = async (req, res) => {};

// GET TRIP USER ITINERARY ITEMS
const getTripUserItineraryItems = async (req, res) => {};

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
