import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    return res.status(200).send({ message: 'Flight root route' });
});

export default router;
