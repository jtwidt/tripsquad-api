import express, { Request, Response } from 'express';
const router = express.Router();

import { createTrip, getTrip } from '../controller/trip.controller';

router.get('/', (req: Request, res: Response) => {
    return res.status(200).send({ message: 'Trip root route' });
});
router.post('/create', createTrip);
router.get('/:id', getTrip);

export default router;
