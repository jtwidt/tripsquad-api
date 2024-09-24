const { db } = require('../models');

const Hotel = db.Hotel;

// CREATE HOTEL
const createHotel = async (req, res) => {};

// GET HOTEL BY ID
const getHotelById = async (req, res) => {};

// GET USER HOTEL RESERVATIONS
const getUserHotelReservation = async (req, res) => {};

// GET HOTEL BY LOCATION
const getHotelByLocation = async (req, res) => {};

// GET HOTEL BY TRIP
const getTripHotels = async (req, res) => {};

// UPDATE HOTEL
const updateHotel = async (req, res) => {};

// DELETE HOTEL
const deleteHotel = async (req, res) => {};

module.exports = {
  createHotel,
  getHotelById,
  getUserHotelReservation,
  getHotelByLocation,
  getTripHotels,
  updateHotel,
  deleteHotel,
};
