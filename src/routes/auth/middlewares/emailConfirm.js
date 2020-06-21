import Route from '../../../services/route'
import User from '../../../models/user'

import getHash from '../../../services/hash'
import { handleError } from '../../../services/logger'

import {
    ERROR_INVALID_CONFIRMATION_TOKEN,
    FATAL_MONGODB_PROVIDER,
    SUCCESS_EMAIL_CONFIRMED,
} from '../../../constants'

class RouteMiddleware extends Route {
    async handle(request, response) {
        try {
            const token = request.headers['confirm-token']

            if (!token || token.length < 120) {
                response
                    .status(ERROR_INVALID_CONFIRMATION_TOKEN.status)
                    .end(ERROR_INVALID_CONFIRMATION_TOKEN.message)

                return
            }

            const user = await User.findOne({ 'email.code': token })

            if (!user) {
                response
                    .status(ERROR_INVALID_CONFIRMATION_TOKEN.status)
                    .end(ERROR_INVALID_CONFIRMATION_TOKEN.message)

                return
            }

            user.email.confirmed = true
            user.email.code = getHash()

            await user.save()

            response
                .status(SUCCESS_EMAIL_CONFIRMED.status)
                .end(SUCCESS_EMAIL_CONFIRMED.message)
        } catch (error) {
            handleError(error)

            response
                .status(FATAL_MONGODB_PROVIDER.status)
                .end(FATAL_MONGODB_PROVIDER.message)
        }
    }
}

export default new RouteMiddleware({ limit: 100, time: 10 })
