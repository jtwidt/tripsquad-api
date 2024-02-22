const Amadeus = require('amadeus');
const db = require('../models');

const Hotel = db.Hotel;
const Trip = db.Trip;
const User = db.User;

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

const getPointsOfInterest = async (req, res) => {
  let { latitude, longitude, radius } = req.body;

  if (!radius) {
    radius = 1;
  }

  const response = await amadeus.referenceData.locations.pointsOfInterest.get({
    latitude,
    longitude,
    radius,
  });

  return res
    .status(200)
    .send({ count: response.result.meta.count, pois: response.data });
};

const getActivities = async (req, res) => {
  let { latitude, longitude, radius } = req.body;

  if (!radius) {
    radius = 1;
  }

  const response = await amadeus.shopping.activities.get({
    latitude,
    longitude,
    radius,
  });

  return res
    .status(200)
    .send({ count: response.result.meta.count, activities: response.data });
};

module.exports = {
  getPointsOfInterest,
  getActivities,
};
