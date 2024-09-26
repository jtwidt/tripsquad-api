const db = require("../models");

const { ItineraryItem } = db;

// CREATE ITINERARY ITEM
const createItineraryItem = async (req, res) => {};

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
