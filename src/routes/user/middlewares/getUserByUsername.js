import Joi from '@hapi/joi'

import Route from '../../../services/route'
import User from '../../../models/user'

import cache from '../../../services/cache'
import { handleError } from '../../../services/logger'
import { SELECT_USER } from '../../../schemas/user'

import {
    ERROR_NOT_FOUND,
    FATAL_GET_USER,
} from '../../../constants'

const paramsSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .required(),
})

class RouteMiddleware extends Route {
    constructor(props) {
        super(props)

        this.validate = this.getValidationMiddleware('params', paramsSchema)
    }

    async handle({ params: { username } }, response) {
        try {
            const cacheValue = await cache.get(username)

            if (cacheValue) {
                response.json(cacheValue)

                return
            }

            const dbValue = await User.findOne({ username })
                .select(SELECT_USER)

            if (!dbValue) {
                response
                    .status(ERROR_NOT_FOUND.status)
                    .end(ERROR_NOT_FOUND.message)

                return
            }

            await cache.set(username, dbValue)

            response.json(dbValue)
        } catch (error) {
            handleError(error)

            response
                .status(FATAL_GET_USER.status)
                .end(FATAL_GET_USER.message)
        }
    }
}

export default new RouteMiddleware({ limit: 10, time: 6 })
