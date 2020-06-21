import Joi from '@hapi/joi'

import Route from '../../../services/route'
import User from '../../../models/user'

import { handleError } from '../../../services/logger'

import {
    ERROR_USERNAME_EXIST,
    FATAL_MONGODB_PROVIDER,
    SUCCESS_USERNAME_AVAILABLE,
} from '../../../constants'

export const paramsSchema = Joi.object({
    username: Joi.string()
        .required(),
})

class RouteMiddleware extends Route {
    constructor(props) {
        super(props)

        this.validate = this.getValidationMiddleware('params', paramsSchema)
    }

    async handle({ params: { username } }, response) {
        try {
            const isUserExist = await User.findOne({ username })

            if (isUserExist) {
                await response
                    .status(ERROR_USERNAME_EXIST.status)
                    .end(ERROR_USERNAME_EXIST.message)

                return
            }

            response
                .status(SUCCESS_USERNAME_AVAILABLE.status)
                .end(SUCCESS_USERNAME_AVAILABLE.message)
        } catch (error) {
            handleError(error)

            response
                .status(FATAL_MONGODB_PROVIDER.status)
                .end(FATAL_MONGODB_PROVIDER.message)
        }
    }
}

export default new RouteMiddleware({ limit: 10, time: 6 })
