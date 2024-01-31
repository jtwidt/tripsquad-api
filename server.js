// External packages
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

// Developer defined files
const db = require('./models');
const trips = require('./routes/trips');
const flights = require('./routes/flights');
const hotels = require('./routes/hotels');
const activities = require('./routes/activities');
const food = require('./routes/food');
const users = require('./routes/users');
const { login } = require('./controllers/auth');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

db.sequelize
    .sync()
    .then(() => {
        console.log('Synced db.');
    })
    .catch((err) => {
        console.log('Failed to sync db: ' + err.message);
    });

app.use(cors());
app.use(bodyParser.json());
app.disable('x-powered-by');

app.get('/', (req, res) => {
    return res.send('Welcome to the TripSquad API');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const token = await login(email, password);
    if (token === 401) {
        return res
            .status(401)
            .send({ message: 'Invalid email or password. Please try again.' });
    } else {
        return res.status(200).send(token);
    }
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
