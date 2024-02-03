import express, { Request, Response } from 'express';
const router = express.Router();

import {
    createTrip,
    getTrip,
    getAllUserAttendingTrips,
    getAllUserCreatedTrips,
    getUpcomingUserCreatedTrips,
    getUpcomingUserAttendingTrips,
    editTrip,
    deleteTrip,
} from '../controller/trip.controller';

router.get('/', (req: Request, res: Response) => {
    return res.status(200).send({ message: 'Trip root route' });
});
router.post('/create', createTrip);
router.post('/created/all', getAllUserCreatedTrips);
router.post('/created/upcoming', getUpcomingUserCreatedTrips);
router.post('/attending/all', getAllUserAttendingTrips);
router.post('/attending/upcoming', getUpcomingUserAttendingTrips);
router.patch('/edit/:id', editTrip);
router.delete('/:id', deleteTrip);
router.get('/:id', getTrip);

export default router;
