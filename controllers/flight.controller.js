const db = require('../models');

const { Trip, Flight, User } = db;

// ADD FLIGHT TO TRIP
const addFlightToTrip = async (req, res) => {
  // Get the Clerk ID of the logged in user
  const { userId: clerkId } = req.auth;

  // Get the trip ID from the URL
  const { tripId } = req.params

  // Search for the user with the matching Clerk ID
  const user = await User.findOne({ where: { clerkId } });

  // If no user is found send back an error message
  if (!user) {
    return res.status(400).send({ message: 'No user found' })
  }

  // Search for the trip with the matching trip ID
  const trip = await Trip.findOne({ where: { id: tripId } });

  // If no trip is found send back an error message
  if (!trip) {
    return res.status(400).send({ message: 'No trip found' })
  }

  // Get all the flight information from the request
  let {
    flightNumber,
    airline,
    departureAirport,
    arrivalAirport,
    departureTime,
    arrivalTime,
    confirmationNumber
  } = req.body;

  // Create new JS date objects
  departureTime = new Date(departureTime);
  arrivalTime = new Date(arrivalTime);

  // Create the new flight object
  let flight = await Flight.create({
    flightNumber,
    airline,
    departureAirport,
    arrivalAirport,
    departureTime,
    arrivalTime,
    confirmationNumber
  });

  // Attach the user and trip to the flight
  await flight.addFlyer(user);
  await flight.addTrip(trip);

  // Re-fetch the flight information to include the new added info
  flight = await Flight.findOne({ 
    where: { 
      id: flight.id 
    }, 
    attributes: { 
      exclude: ['createdAt', 'updatedAt'] 
    },
    include: [
      {
        model: User,
        as: 'flyer',
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      },
      {
        model: Trip,
        as: 'trip',
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      }
    ]
  });

  return res.status(200).send({flight});
};

// UPDATE FLIGHT
const updateFlight = async (req, res) => {
  // Get the Clerk Id for the logged on user
  const {userId: clerkId} = req.auth;

  // Get the flight ID from the URL
  const {flightId} = req.params;

  // Get the user with the matching Clerk ID
  const user = await User.findOne({where: {clerkId}});

  // If no user is found return an error message
  if (!user) {
    return res.status(400).send({message: 'No user found'})
  }
  
  // Get the flight with the matching flight ID
  let flight = await Flight.findOne({ where: {id: flightId}});

  // If no flight is found, return an error
  if (!flight) {
    return res.status(400),=.send({message: 'No flight found'})
  }

  // The logged in user is not the person that "owns" the flight
  if (flight.userId !== user.id) {
    return res.status(403).send({message: 'Not authorized'});
  }

  // Get the update info from the request body
  let {
    departureTime,
    arrivalTime,
  } = req.body;

  // Convert the dates to JS date objects
  arrivalTime = new Date(arrivalTime);
  departureTime = new Date(departureTime);

  const updateObject = {...req.body, departureTime, arrivalTime};

  // Update the flight in the database
  await Flight.update(updateObject, { where: {id: flightId}})

  // Re-fetch the updated object
  flight = await Flight.findOne({ 
    where: { 
      id: flight.id 
    }, 
    attributes: { 
      exclude: ['createdAt', 'updatedAt'] 
    },
    include: [
      {
        model: User,
        as: 'flyer',
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      },
      {
        model: Trip,
        as: 'trip',
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      }
    ]
  });

  return res.status(200).send({flight});
};


 // DELETE FLIGHT
const deleteFlight = async (req, res) => { 
  // Get the Clerk ID of the logged in user
  const {userId: clerkId} = req.auth;

  // Get the flight ID from the URL
  const {flightId} = req.params;

  // Get the user associated with the Clerk ID
  const user = await User.findOne({where: {clerkId}});

  // If no user is found, return an error
  if (!user) {
    return res.status(400).send({message: 'No user found'});
  }

  // Get the flight with the matching flight ID
  const flight = await Flight.findOne({where: {id: flightId}});

  // If no flight is found, return an error
  if (!flight) {
    return res.status(400).send({message: 'No flight found'})
  }

  // If the user is not the owner of the flight return an error
  if (flight.userId !== user.id) {
    return res.status(403).send({message: 'Not authorized'});
  }

  await flight.destroy({where: {id: flightId}});

  return res.status(200).send({message: 'Flight successfully deleted'});
};

module.exports = {
  addFlightToTrip,
  updateFlight,
  deleteFlight,
};
