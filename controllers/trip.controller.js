const { Op } = require('sequelize');

const db = require('../models/');

const Destination = db.Destination;
const Flight = db.Flight;
const Hotel = db.Hotel;
const Trip = db.Trip;
const User = db.User;

const createTrip = async (req, res) => {
  const { tripName, tripStart, tripEnd, creatorId, attendees, destinations } =
    req.body;

  const validCreator = await User.findOne({ where: { id: creatorId } });

  if (!validCreator) {
    return res.status(400).send({ message: 'Trip creator not found.' });
  }

  const startDate = new Date(tripStart);
  const endDate = new Date(tripEnd);

  const trip = await Trip.create({
    tripName,
    tripStart: startDate,
    tripEnd: endDate,
    creatorId,
  });

  const attendeeArray = await User.findAll({ where: { id: attendees } });

  await trip.addAttendees(attendeeArray);

  const createdDestinations = [];

  for (const destination of destinations) {
    const created = await Destination.findOrCreate({
      where: {
        city: destination.city,
        country: destination.country,
      },
      defaults: destination,
    });
    createdDestinations.push(created[0]);
  }

  await trip.addDestinations(createdDestinations);

  const fullTrip = await Trip.findOne({
    where: { id: trip.id },
    include: [
      {
        model: User,
        as: 'attendees',
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt'],
        },
      },
      {
        model: User,
        as: 'creator',
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt'],
        },
      },
      {
        model: Flight,
        as: 'flights',
        include: 'traveller',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
      {
        model: Hotel,
        as: 'hotels',
        include: 'guest',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
      {
        model: Destination,
        as: 'destinations',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
    ],
  });

  return res.status(200).send({ trip: fullTrip });
};

const getTrip = async (req, res) => {
  const id = req.params.id;

  const trip = await Trip.findOne({
    where: { id: id },
    include: [
      {
        model: User,
        as: 'attendees',
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt'],
        },
      },
      {
        model: User,
        as: 'creator',
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt'],
        },
      },
      {
        model: Flight,
        as: 'flights',
        include: 'traveller',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
      {
        model: Hotel,
        as: 'hotels',
        include: 'guest',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
    ],
  });

  if (!trip) {
    return res.status(400).send({ message: 'Trip not found.' });
  }

  return res.status(200).send({ trip });
};

const getAllCreatedTrips = async (req, res) => {
  const { creatorId } = req.body;

  if (!creatorId) {
    return res.status(400).send({ message: 'No creator ID given' });
  }

  const validUser = await User.findOne({ where: { id: creatorId } });

  if (!validUser) {
    return res.status(400).send({ message: 'User not found.' });
  }

  const trips = await Trip.findAll({ where: { creatorId: creatorId } });

  return res.status(200).send({ trips });
};

const getAllAttendingTrips = async (req, res) => {
  const { userId } = req.body;

  const validUser = await User.findOne({ where: { id: userId } });

  if (!validUser) {
    return res.status(400).send({ message: 'User not found.' });
  }

  const trips = await Trip.findAll({
    include: [
      {
        model: User,
        as: 'attendees',
        where: { id: userId },
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt'],
        },
      },
    ],
  });

  return res.status(200).send({ trips });
};

const getUpcomingCreatedTrips = async (req, res) => {
  const { creatorId } = req.body;
  const now = new Date();
  const formattedNow = now.toLocaleDateString('en-US');

  if (!creatorId) {
    return res.status(400).send({ message: 'No creator ID given' });
  }

  const validUser = await User.findOne({ where: { id: creatorId } });

  if (!validUser) {
    return res.status(400).send({ message: 'User not found.' });
  }

  const trips = await Trip.findAll({
    where: { creatorId: creatorId, tripEnd: { [Op.gte]: formattedNow } },
  });

  return res.status(200).send({ trips });
};

const getUpcomingAttendingTrips = async (req, res) => {
  const { userId } = req.body;

  const now = new Date();
  const formattedNow = now.toLocaleDateString('en-US');

  if (!userId) {
    return res.status(400).send({ message: 'No user ID given.' });
  }

  const validUser = await User.findOne({ where: { id: userId } });

  if (!validUser) {
    return res.status(400).send({ message: 'User not found.' });
  }

  const trips = await Trip.findAll({
    where: {
      tripEnd: { [Op.gte]: formattedNow },
    },
    include: [
      {
        model: User,
        as: 'attendees',
        where: { id: userId },
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt'],
        },
      },
    ],
  });

  return res.status(200).send({ trips });
};

const updateTrip = async (req, res) => {
  const id = req.params.id;

  let { tripName, tripStart, tripEnd, attendees } = req.body;

  tripStart = new Date(tripStart);

  tripEnd = new Date(tripStart);

  const attendeeArray = await User.findAll({ where: { id: attendees } });

  const trip = await Trip.findOne({ where: { id: id } });

  const tripUpdate = {
    tripName,
    tripStart,
    tripEnd,
  };

  await Trip.update(tripUpdate, {
    where: { id: id },
  });

  trip.setAttendees([]);
  trip.addAttendees(attendeeArray);

  const updatedTrip = await Trip.findOne({
    where: { id: id },
    include: [
      {
        model: User,
        as: 'attendees',
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt'],
        },
      },
      {
        model: User,
        as: 'creator',
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt'],
        },
      },
      {
        model: Flight,
        as: 'flights',
        include: 'traveller',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
      {
        model: Hotel,
        as: 'hotels',
        include: 'guest',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
    ],
  });

  return res.status(200).send({ trip: updatedTrip });
};

const deleteTrip = async (req, res) => {
  const id = req.params.id;

  const trip = await Trip.findOne({ where: { id: id } });

  if (!trip) {
    return res.status(400).send({ message: 'Trip not found.' });
  }

  await Trip.destroy({ where: { id: id } });

  return res.status(200).send({ message: 'Trip successfully deleted' });
};

module.exports = {
  createTrip,
  getTrip,
  getAllCreatedTrips,
  getAllAttendingTrips,
  getUpcomingCreatedTrips,
  getUpcomingAttendingTrips,
  updateTrip,
  deleteTrip,
};
