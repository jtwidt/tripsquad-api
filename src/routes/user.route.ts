import express, { Request, Response } from 'express';
const router = express.Router();
import {
    registerUser,
    getUser,
    getAllUsers,
    updateUser,
    deleteUser,
} from '../controller/user.controller';

router.get('/', (req: Request, res: Response) => {
    return res.status(200).send({ message: 'Users root route' });
});
router.get('/all', getAllUsers);
router.post('/register', registerUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/:id', getUser);

export default router;
