import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import RequestWithUserData from '../interfaces/RequestWithUserData.interface';
import DataStoredInToken from '../interfaces/DataStoredInToken';

export default (
    req: RequestWithUserData,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (token) {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET as jwt.Secret
            ) as DataStoredInToken;
            req.userData = decoded;
            next();
        }
    } catch (error) {
        return res.status(401).send({ message: 'Authentication failed' });
    }
};
