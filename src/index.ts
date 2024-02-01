import express, { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import cors from 'cors';

import { AppDataSource } from './data-source';
import users from './routes/user.route';
import trips from './routes/trip.route';
import flights from './routes/flight.route';
import hotels from './routes/hotel.route';
import activities from './routes/activity.route';
import food from './routes/food.route';
import auth from './routes/auth.route';

dotenv.config();

AppDataSource.initialize()
    .then(() => {
        console.log('Data source initialized');
    })
    .catch((error) => console.log(error));

const app: Express = express();

app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 3001;

app.get('/', (req: Request, res: Response) => {
    return res.status(200).send({ message: `Welcome to the TripSquad API` });
});

app.use('/users', users);
app.use('/trips', trips);
app.use('/flights', flights);
app.use('/hotels', hotels);
app.use('/activities', activities);
app.use('/food', food);
app.use('/auth', auth);

app.listen(port, () => {
    console.log(`[server]: Tripsquad API listening on port ${port}`);
});
