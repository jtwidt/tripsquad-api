import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { User } from '../entity/User';
import { AppDataSource } from '../data-source';

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await AppDataSource.getRepository(User)
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .addSelect('user.password')
        .getOne();
    if (!user) {
        return res
            .status(401)
            .send({ message: 'Email or password incorrect.' });
    } else {
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res
                .status(401)
                .send({ message: 'Email or password incorrect.' });
        } else {
            const accessToken = jwt.sign(
                { email, id: user.id },
                process.env.JWT_SECRET as jwt.Secret,
                { expiresIn: '1h' }
            );
            return res
                .status(201)
                .send({ token: accessToken, userId: user.id });
        }
    }
};
