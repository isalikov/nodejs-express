import Joi from '@hapi/joi'

import Route from '../../../services/route'
import User from '../../../models/user'

import getHash from '../../../services/hash'
import { handleError } from '../../../services/logger'

import {
    ERROR_FORBIDDEN,
    ERROR_UNAUTHORIZED,
    FATAL_SET_PASSWORD,
    SUCCESS_SET_PASSWORD,
} from '../../../constants'

const bodySchema = Joi.object({
    password: Joi.string()
        .min(8)
        .required(),
})

class RouteMiddleware extends Route {
    constructor(props) {
        super(props)

        this.validate = this.getValidationMiddleware('body', bodySchema)
    }

    async handle(request, response) {
        try {
            const token = request.headers['reset-token']

            const { password } = request.body

            if (!token || token.length < 120) {
                response
                    .status(ERROR_FORBIDDEN.status)
                    .end(ERROR_FORBIDDEN.message)

                return
            }

            const user = await User.findOne({ reset: token })

            if (!user) {
                response
                    .status(ERROR_UNAUTHORIZED.status)
                    .end(ERROR_UNAUTHORIZED.message)

                return
            }

            user.password = password
            user.reset = getHash()

            await user.save()

            response
                .status(SUCCESS_SET_PASSWORD.status)
                .end(SUCCESS_SET_PASSWORD.message)
        } catch (error) {
            handleError(error)

            response
                .status(FATAL_SET_PASSWORD.status)
                .end(FATAL_SET_PASSWORD.message)
        }
    }
}

export default new RouteMiddleware({ limit: 100, time: 10 })
