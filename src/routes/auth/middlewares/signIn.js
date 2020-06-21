import Joi from '@hapi/joi'
import equal from 'fast-deep-equal'
import { SHA512 } from 'crypto-js'

import Route from '../../../services/route'
import User from '../../../models/user'

import { handleError } from '../../../services/logger'

import {
    createSession,
    getSession,
    removeSession,
} from '../../../services/session'

import {
    ERROR_EMAIL_NOT_FOUND,
    ERROR_UNAUTHORIZED,
    FATAL_CREATE_SESSION,
} from '../../../constants'

const bodySchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2 })
        .required(),

    password: Joi.string()
        .min(8)
        .required(),
})

async function prepareSession(user, useragent, ip) {
    const userSessions = await Promise.all(
        user.sessions.map(getSession),
    )

    /**
    * Replace sessions with same useragent and IP address
    */
    const sessionsToRemove = userSessions.filter((session) => {
        const isUserAgentEqual = !!session && equal(session.useragent, useragent)

        return isUserAgentEqual && session.ip === ip
    })

    await Promise.all(
        sessionsToRemove
            .map((session) => session.token)
            .map(removeSession),
    )

    const sessions = user.sessions
        .filter((token) => !sessionsToRemove.find((session) => session.token === token))

    const session = await createSession(user, useragent, ip)

    return { session, sessions }
}

class RouteMiddleware extends Route {
    constructor(props) {
        super(props)

        this.validate = this.getValidationMiddleware('body', bodySchema)
    }

    async handle(request, response) {
        try {
            const { email, password } = request.body
            const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress

            const user = await User.findOne({ 'email.value': email })

            if (!user) {
                response
                    .status(ERROR_EMAIL_NOT_FOUND.status)
                    .end(ERROR_EMAIL_NOT_FOUND.message)

                return
            }

            if (SHA512(password).toString() !== user.hash) {
                response
                    .status(ERROR_UNAUTHORIZED.status)
                    .end(ERROR_UNAUTHORIZED.message)

                return
            }

            const { session, sessions } = await prepareSession(user, request.useragent, ip)

            user.sessions = [...sessions, session]

            await user.save()

            response.json(session)
        } catch (error) {
            handleError(error)

            response
                .status(FATAL_CREATE_SESSION.status)
                .end(FATAL_CREATE_SESSION.message)
        }
    }
}

export default new RouteMiddleware({ limit: 100, time: 10 })
