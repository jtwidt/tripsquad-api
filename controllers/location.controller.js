const db = require('../models');

const Location = db.Location;

// CREATE LOCATION
const createLocation = async (req, res) => {}

// GET SINGLE LOCATION
const getLocationById = async (req, res) => {}

// GET ALL LOCATIONS
const getAllLocations = async (req, res) => {}

// GET ALL COUNTRY LOCATIONS
const getCountryLocations = async (req, res) => {}

// GET ALL CITY LOCATIONS
const getCityLocations = async (req, res) => {}

// UPDATE LOCATION
const updateLocation = async (req, res) => {}

// DELETE LOCATION
const deleteLocation = async (req, res) => {}

module.exports = {
    createLocation,
    getLocationById,
    getAllLocations,
    getCountryLocations,
    getCityLocations,
    updateLocation,
    deleteLocation
}