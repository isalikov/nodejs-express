import Joi from '@hapi/joi'

import Route from '../../../services/route'
import User from '../../../models/user'

import { handleError } from '../../../services/logger'

import {
    ERROR_EMAIL_EXIST,
    FATAL_MONGODB_PROVIDER,
    SUCCESS_EMAIL_AVAILABLE,
} from '../../../constants'

export const paramsSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2 })
        .required(),
})

class RouteMiddleware extends Route {
    constructor(props) {
        super(props)

        this.validate = this.getValidationMiddleware('params', paramsSchema)
    }

    async handle({ params: { email } }, response) {
        try {
            const isUserExist = await User.findOne({ 'email.value': email })

            if (isUserExist) {
                response
                    .status(ERROR_EMAIL_EXIST.status)
                    .end(ERROR_EMAIL_EXIST.message)

                return
            }

            response
                .status(SUCCESS_EMAIL_AVAILABLE.status)
                .end(SUCCESS_EMAIL_AVAILABLE.message)
        } catch (error) {
            handleError(error)

            response
                .status(FATAL_MONGODB_PROVIDER.status)
                .end(FATAL_MONGODB_PROVIDER.message)
        }
    }
}

export default new RouteMiddleware({ limit: 10, time: 6 })
