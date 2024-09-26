const express = require("express");
const router = express.Router();
const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node");

const {
  createItineraryItem,
  getAllItineraryItems,
  getTripItineraryItems,
  getTripDayItineraryItems,
  getTripUserItineraryItems,
  getTripUserDayItineraryItems,
  updateItineraryItem,
  deleteItineraryItems,
} = require("../controllers/itineraryitems.controller");

router.get("/", (req, res) => {
  return res.status(200).send({ message: "ItineraryItems root route" });
});

router.post("/create", ClerkExpressWithAuth(), createItineraryItem);
router.get("/all", ClerkExpressWithAuth(), getAllItineraryItems);
router.get("/trip/:tripId", ClerkExpressWithAuth(), getTripItineraryItems);
router.get(
  "/trip/:tripId/:day",
  ClerkExpressWithAuth(),
  getTripDayItineraryItems
);
router.get(
  "/trip/user/:tripId",
  ClerkExpressWithAuth(),
  getTripUserItineraryItems
);
router.get(
  "/trip/user/day/:day",
  ClerkExpressWithAuth(),
  getTripUserDayItineraryItems
);
router.patch("/:itemId", ClerkExpressWithAuth(), updateItineraryItem);
router.delete("/:itemId", ClerkExpressWithAuth(), deleteItineraryItems);

module.exports = router;
