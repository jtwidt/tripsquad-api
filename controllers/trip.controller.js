const db = require('../models');

const User = db.User;
const Trip = db.Trip;

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

  if (!creatingUser) {
    return res.status(400).send({ message: 'User not found' });
  }

  const trip = await Trip.create({
    tripName,
    startDate,
    endDate,
    location,
  });

  await trip.setCreator(creatingUser);

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
    ],
  });

  return res.status(200).send({ trip: updatedTrip });
};

// GET A SPECIFIC TRIP

// GET CREATED TRIPS

// GET ATTENDING TRIPS

// GET ALL TRIPS

// UPDATE TRIP

// MODIFY LOCATIONS FOR TRIP

// MODIFY TRIP PARTICIPANTS

// DELETE TRIP

module.exports = { createTrip };
