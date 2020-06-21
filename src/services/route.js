import RateLimit from 'express-rate-limit'

import User from '../models/user'

import {
    ERROR_FORBIDDEN,
    ERROR_LOCKED,
    ERROR_REQUEST_VALIDATION,
    ERROR_TO_MANY_REQUESTS,
    FATAL_GET_USER,
    FATAL_SESSION_PROVIDER,
} from '../constants'

import { getSession } from './session'
import { handleError } from './logger'

export default class RouteMiddleware {
    constructor(options = { limit: 1000, time: 1 }) {
        this.debounce = RateLimit({
            windowMs: options.time * 1000,
            max: options.limit,
            message: ERROR_TO_MANY_REQUESTS.message,
            statusCode: ERROR_TO_MANY_REQUESTS.status,
        })
    }

    async authorize(request, response, next) {
        const { authorization } = request.headers

        if (!authorization || authorization.length < 120) {
            response
                .status(ERROR_FORBIDDEN.status)
                .end(ERROR_FORBIDDEN.message)

            return
        }


        try {
            const session = await getSession(authorization)

            if (!session) {
                response
                    .status(ERROR_FORBIDDEN.status)
                    .end(ERROR_FORBIDDEN.message)

                return
            }

            request.session = session

            next()
        } catch (error) {
            handleError(error)

            response
                .status(FATAL_SESSION_PROVIDER.status)
                .end(FATAL_SESSION_PROVIDER.message)
        }
    }

    async confirmed(request, response, next) {
        const { authorization } = request.headers

        if (!authorization || authorization.length < 120) {
            response
                .status(ERROR_FORBIDDEN.status)
                .end(ERROR_FORBIDDEN.message)

            return
        }


        try {
            const session = await getSession(authorization)

            if (!session) {
                response
                    .status(ERROR_FORBIDDEN.status)
                    .end(ERROR_FORBIDDEN.message)

                return
            }

            try {
                const user = await User.findOne({ uuid: session.uuid })

                if (!user.email.confirmed) {
                    response
                        .status(ERROR_LOCKED.status)
                        .end(ERROR_LOCKED.message)

                    return
                }
            } catch (error) {
                handleError(error)

                response
                    .status(FATAL_GET_USER.status)
                    .end(FATAL_GET_USER.message)

                return
            }

            request.session = session

            next()
        } catch (error) {
            handleError(error)

            response
                .status(FATAL_SESSION_PROVIDER.status)
                .end(FATAL_SESSION_PROVIDER.message)
        }
    }

    getValidationMessage(error) {
        return error.details.map((detail) => detail.message).join('\n')
    }

    getValidationMiddleware(key, schema) {
        return async (request, response, next) => {
            try {
                await schema.validateAsync(request[key])

                next()
            } catch (error) {
                const message = this.getValidationMessage(error)

                response
                    .status(ERROR_REQUEST_VALIDATION.status)
                    .end(message)
            }
        }
    }
}
