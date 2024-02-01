import express, { Request, Response } from 'express';
const router = express.Router();
import { registerUser } from '../controller/user.controller';

router.get('/', (req: Request, res: Response) => {
    return res.status(200).send({ message: 'Users root route' });
});
router.post('/register', registerUser);

export default router;
