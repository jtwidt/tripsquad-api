const express = require("express");
const app = express();
const port = process.env.SERVER_PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.send("Hello from TripSquad API!");
});

app.listen(port, () => {
  console.log(`TripSquad API listening on port ${port}`);
});
