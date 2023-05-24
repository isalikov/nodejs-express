import { Response, Request } from 'express'
import httpStatus from 'http-status'

const NotFound = async (req: Request, res: Response) => {
    res.sendStatus(httpStatus.NOT_FOUND)
}

export default NotFound
