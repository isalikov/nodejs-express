import { Response, Request } from 'express';
import httpStatus from 'http-status';

const NotFound = async (req: Request, res: Response) => {
    res.status(httpStatus.NOT_FOUND).send(httpStatus['NOT_FOUND']);
};

export default NotFound;
