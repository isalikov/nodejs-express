import Joi from '@hapi/joi'

import Route from '../../../services/route'
import User from '../../../models/user'

import { handleError } from '../../../services/logger'
import { removeSession } from '../../../services/session'

import {
    ERROR_FORBIDDEN,
    ERROR_NOT_FOUND,
    FATAL_REMOVE_SESSION,
    SUCCESS_REMOVE_SESSION,
} from '../../../constants'

const paramsSchema = Joi.object({
    token: Joi.string()
        .min(120)
        .required(),
})

class RouteMiddleware extends Route {
    constructor(props) {
        super(props)

        this.validate = this.getValidationMiddleware('params', paramsSchema)
    }

    async handle({ params, session }, response) {
        try {
            await removeSession(params.token)

            const user = await User.findOne({ uuid: session.uuid })

            if (!user) {
                response
                    .status(ERROR_FORBIDDEN.status)
                    .end(ERROR_FORBIDDEN.message)

                return
            }

            if (!user.sessions.includes(params.token)) {
                response
                    .status(ERROR_NOT_FOUND.status)
                    .end(ERROR_NOT_FOUND.message)

                return
            }

            const sessions = user.sessions.filter((token) => token !== params.token)
            user.sessions = sessions

            await user.save()

            response
                .status(SUCCESS_REMOVE_SESSION.status)
                .end(SUCCESS_REMOVE_SESSION.message)
        } catch (error) {
            handleError(error)

            response
                .status(FATAL_REMOVE_SESSION.status)
                .end(FATAL_REMOVE_SESSION.message)
        }
    }
}

export default new RouteMiddleware({ limit: 100, time: 10 })
