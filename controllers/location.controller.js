const db = require('../models');

const Location = db.Location;

// CREATE LOCATION
const createLocation = async (req, res) => {
  // Get all the location information from the request
  const {
    name,
    address,
    city,
    state,
    country,
    latitude,
    longitude,
    description,
  } = req.body;

  // Search the database for a location exactly matching or create the new one
  const [location, created] = await Location.findOrCreate({
    where: {
      name,
      address,
      city,
      state,
      country,
      latitude,
      longitude,
      description,
    },
  });

  // If the location wasn't created return an error message
  if (!created) {
    return res.status(400).send({ message: 'Location already exists' });
  }

  // Return the location
  return res.status(201).send({ location });
};

// GET SINGLE LOCATION
const getLocationById = async (req, res) => {
  // Get the location ID from the URL
  const { locationId } = req.params;

  // Find the location with the matching ID
  const location = await Location.findOne({
    where: { id: locationId },
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
  });

  // If no location is found, send an error message
  if (!location) {
    return res.status(400).send({ message: 'No location found' });
  }

  // Return the found location
  return res.status(200).send({ location });
};

// GET ALL LOCATIONS
const getAllLocations = async (req, res) => {
  // Get all the locations that are currently in the database
  const locations = await Location.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
  });

  return res.status(200).send({ locations });
};

// GET ALL COUNTRY LOCATIONS
const getCountryLocations = async (req, res) => {};

// GET ALL CITY LOCATIONS
const getCityLocations = async (req, res) => {};

// UPDATE LOCATION
const updateLocation = async (req, res) => {};

// DELETE LOCATION
const deleteLocation = async (req, res) => {};

module.exports = {
  createLocation,
  getLocationById,
  getAllLocations,
  getCountryLocations,
  getCityLocations,
  updateLocation,
  deleteLocation,
};
