// External packages
const express = require('express');
const dotenv = require('dotenv');

// Developer defined files
const trips = require('./routes/trips');
const flights = require('./routes/flights');
const hotels = require('./routes/hotels');
const activities = require('./routes/activities');
const food = require('./routes/food');
const users = require('./routes/users');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.send('Welcome to the TripSquad API');
});

app.use('/trips', trips);
app.use('/flights', flights);
app.use('/hotels', hotels);
app.use('/activities', activities);
app.use('/food', food);
app.use('/users', users);

app.listen(port, () => {
    console.log(`[server]: TripSquad API started on port: ${port}`);
});
