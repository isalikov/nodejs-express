import Route from '../../../services/route'
import User from '../../../models/user'

import { handleError } from '../../../services/logger'
import { getSession, removeSession } from '../../../services/session'
import { SELECT_USER } from '../../../schemas/user'

import {
    ERROR_FORBIDDEN,
    FATAL_GET_USER,
} from '../../../constants'

class RouteMiddleware extends Route {
    async handle({ session }, response) {
        try {
            const user = await User.findOne({ uuid: session.uuid })
                .select(`${SELECT_USER} sessions`)

            if (!user) {
                await removeSession(session.token)

                response
                    .status(ERROR_FORBIDDEN.status)
                    .end(ERROR_FORBIDDEN.message)

                return
            }

            const sessions = await Promise.all(
                user.sessions.map(getSession),
            )

            response.json({
                ...user.toJSON(),
                sessions,
            })
        } catch (error) {
            handleError(error)

            response
                .status(FATAL_GET_USER.status)
                .end(FATAL_GET_USER.message)
        }
    }
}

export default new RouteMiddleware({ limit: 100, time: 10 })
