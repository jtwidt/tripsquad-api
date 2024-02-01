import express, { Express, Request, Response } from 'express';
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
        console.log(user);
        return res.status(200).send({ message: 'User successfully created' });
    }
};
