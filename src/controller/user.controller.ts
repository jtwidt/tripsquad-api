import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { User } from '../entity/User';
import { AppDataSource } from '../data-source';

export const registerUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const verifyEmail = await AppDataSource.manager.findOneBy(User, { email });
    if (verifyEmail) {
        return res.status(403).send({ message: 'Email already in use' });
    } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User();
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.email = email;
        user.password = hashedPassword;
        user.address1 = req.body.address1;
        user.address2 = req.body.address2;
        user.city = req.body.city;
        user.state = req.body.state;
        user.country = req.body.country;
        user.postCode = req.body.postCode;
        await AppDataSource.manager.save(user);
        const accessToken = jwt.sign(
            { email, id: user.id },
            process.env.JWT_SECRET as jwt.Secret,
            { expiresIn: '1h' }
        );
        return res.status(201).send({ token: accessToken, userId: user.id });
    }
};

export const getUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = await AppDataSource.manager.find(User, {
        where: { id: id },
    });
    if (!user) {
        return res.status(401).send({ message: 'User could not be found.' });
    } else {
        return res.status(200).send({ user: user });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await AppDataSource.manager.find(User);
        return res.status(200).json({ users: users });
    } catch (error) {
        return res.status(500).send({ message: 'Internal Server Error' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const userId = req.params.id;
    const updatedUserInfo = req.body;
    const user = await AppDataSource.manager.findOneBy(User, { id: userId });
    if (!user) {
        return res.status(400).send({ message: 'User could not be found.' });
    } else {
        if (updatedUserInfo.email) {
            const verifyEmail = await AppDataSource.manager.findOneBy(User, {
                email: updatedUserInfo.email,
            });
            if (verifyEmail) {
                return res.status(401).send({
                    message: 'Email already in use. User not updated',
                });
            }
        }

        if (updatedUserInfo.password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(
                updatedUserInfo.password,
                salt
            );
            updatedUserInfo.password = hashedPassword;
        }

        await AppDataSource.manager.update(User, userId, updatedUserInfo);
        return res.status(200).send({ message: 'User updated successfully' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const userId = req.params.id;
    const user = await AppDataSource.manager.findOneBy(User, { id: userId });
    if (!user) {
        return res.status(404).send({ message: 'User could not be found.' });
    } else {
        await AppDataSource.manager.remove(user);
        return res.status(200).send({ message: 'User successfully deleted.' });
    }
};
