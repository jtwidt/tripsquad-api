import express, { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import { AppDataSource } from './data-source';

dotenv.config();

AppDataSource.initialize()
    .then(async () => {
        const app: Express = express();

        app.use(cors());
        app.use(bodyParser.json());

        const port = process.env.PORT || 3001;

        app.get('/', (req: Request, res: Response) => {
            return res
                .status(200)
                .send({ message: `Welcome to the TripSquad API` });
        });

        app.listen(port, () => {
            console.log(`[server]: Tripsquad API listening on port ${port}`);
        });
    })
    .catch((error) => console.log(error));
