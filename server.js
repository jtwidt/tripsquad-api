const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('Hello from the TripSquad API!');
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
