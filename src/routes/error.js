import { Router } from 'express'

import {
    ERROR_NOT_ALLOWED,
} from '../constants'

const router = Router()

const handleError = (request, response) => {
    response
        .status(ERROR_NOT_ALLOWED.status)
        .end(ERROR_NOT_ALLOWED.message)
}

router.use('*', handleError)

export default router
