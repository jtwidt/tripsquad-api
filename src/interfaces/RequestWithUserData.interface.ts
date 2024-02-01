import { Request } from 'express';
import DataStoredInToken from './DataStoredInToken';

interface RequestWithUserData extends Request {
    userData: DataStoredInToken;
}

export default RequestWithUserData;
