import Route from '../../../services/route'
import User from '../../../models/user'

import { handleError } from '../../../services/logger'
import { removeSession } from '../../../services/session'

import {
    ERROR_FORBIDDEN,
    FATAL_REMOVE_SESSION,
    SUCCESS_REMOVE_SESSION,
} from '../../../constants'

class RouteMiddleware extends Route {
    async handle({ headers, session }, response) {
        try {
            const { authorization } = headers

            await removeSession(authorization)

            const user = await User.findOne({ uuid: session.uuid })

            if (!user) {
                response
                    .status(ERROR_FORBIDDEN.status)
                    .end(ERROR_FORBIDDEN.message)

                return
            }

            const sessions = user.sessions.filter((token) => token !== authorization)
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
