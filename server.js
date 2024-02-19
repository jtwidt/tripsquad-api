const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const db = require("./models");
const users = require("./routes/user.routes");

const port = process.env.SERVER_PORT || 3001;

// disable `X-Powered-By` header that reveals information about the server
app.disable("x-powered-by");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

app.get("/", (req, res) => {
  res.send("Hello from TripSquad API!");
});

app.use("/users", users);

app.listen(port, () => {
  console.log(`TripSquad API listening on port ${port}`);
});
