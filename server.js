const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const db = require('./models');

const port = process.env.PORT || 3001;

app.disable('x-powered-by');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.sequelize
  .sync()
  .then(() => {
    console.log('Synced db.');
  })
  .catch((err) => {
    console.log('Failed to sync db: ' + err.message);
  });

app.get('/', (req, res) => {
  res.send('Hello from the TripSquad API!');
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
