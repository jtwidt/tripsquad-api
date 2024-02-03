import express, { Request, Response } from 'express';
const router = express.Router();

import {
    createTrip,
    getTrip,
    getUserAttendingTrips,
    getUserCreatedTrips,
} from '../controller/trip.controller';

router.get('/', (req: Request, res: Response) => {
    return res.status(200).send({ message: 'Trip root route' });
});
router.post('/create', createTrip);
router.post('/created/all', getUserCreatedTrips);
router.post('/attending/all', getUserAttendingTrips);
router.get('/:id', getTrip);

export default router;
