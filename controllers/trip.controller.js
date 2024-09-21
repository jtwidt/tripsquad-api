const db = require('../models');

const { User, Trip, Flight, Hotel, ItineraryItem } = db;

// CREATE A TRIP
const createTrip = async (req, res) => {
  // Gets the clerk user ID provided by the Clerk middleware
  const { clerkId } = req.auth;

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
  });

  // Return the full object to the user
  return res.status(200).send({ trip: updatedTrip });
};

// GET A SPECIFIC TRIP
const getTripById = async (req, res) => {};

// GET CREATED TRIPS
const getCreatedTrips = async (req, res) => {};

// GET ATTENDING TRIPS
const getAttendingTrips = async (req, res) => {};

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
  deleteTrip,
};
