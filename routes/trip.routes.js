const express = require("express");
const router = express.Router();

const {
  createTrip,
  getTrip,
  getAllCreatedTrips,
  getAllAttendingTrips,
  getUpcomingCreatedTrips,
  getUpcomingAttendingTrips,
  updateTrip,
  deleteTrip,
} = require("../controllers/trip.controller");

router.get("/", (req, res) => {
  return res.status(200).send({message: "Trips root route"});
});

router.post("/", createTrip);
router.post("/created/all", getAllCreatedTrips);
router.post("/attending/all", getAllAttendingTrips);
router.post("/created/upcoming", getUpcomingCreatedTrips);
router.post("/attending/upcoming", getUpcomingAttendingTrips);
router.get("/:id", getTrip);
router.patch("/:id", updateTrip);
router.delete("/:id", deleteTrip);

module.exports = router;
