const express = require("express");
const router = express.Router();
const {
  createUser,
  getSingleUser,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");

router.get("/", (req, res) => {
  return res.status(200).send({message: "Users root route"});
});

router.post("/register", createUser);
router.get("/all", getAllUsers);
router.get("/:id", getSingleUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
