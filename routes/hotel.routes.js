const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).send({message: "Hotels root route"});
});

module.exports = router;
