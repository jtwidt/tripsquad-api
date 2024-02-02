import express, { Request, Response } from 'express';
const router = express.Router();

import { loginUser } from '../controller/auth.controller';

router.get('/', (req: Request, res: Response) => {
    return res.status(200).send({ message: 'Auth root route' });
});

router.post('/login', loginUser);

export default router;
