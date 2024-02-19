const express = require("express");
const router = express.Router();

const {
  createAddress,
  updateAddress,
  getSingleAddress,
  getAllUserAddresses,
  deleteAddress,
} = require("../controllers/address.controller");

router.get("/", (req, res) => {
  return res.status(200).send({message: "Addresses root route"});
});

router.post("/", createAddress);
router.patch("/:id", updateAddress);
router.post("/all", getAllUserAddresses);
router.get("/:id", getSingleAddress);
router.delete("/:id", deleteAddress);

module.exports = router;
