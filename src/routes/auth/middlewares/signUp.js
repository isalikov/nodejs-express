import Joi from '@hapi/joi'

import Route from '../../../services/route'
import User from '../../../models/user'

import config from '../../../config'
import getHash from '../../../services/hash'
import mail from '../../../services/mail'
import { createSession } from '../../../services/session'
import { handleError } from '../../../services/logger'

import {
    ERROR_EMAIL_EXIST,
    ERROR_USERNAME_EXIST,
    FATAL_CREATE_USER,
    FATAL_MAIL_PROVIDER,
} from '../../../constants'

const bodySchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2 })
        .required(),

    name: Joi.string()
        .required(),

    password: Joi.string()
        .min(8)
        .required(),

    username: Joi.string()
        .min(3)
        .required(),
})

class RouteMiddleware extends Route {
    constructor(props) {
        super(props)

        this.validate = this.getValidationMiddleware('body', bodySchema)
    }

    async handle(request, response) {
        const {
            email,
            name,
            password,
            username,
        } = request.body

        try {
            const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress || '0.0.0.0'

            const isEmailExist = await User.findOne({ 'email.value': email })
            const isUsernameExist = await User.findOne({ username })

            if (isEmailExist) {
                response
                    .status(ERROR_EMAIL_EXIST.status)
                    .end(ERROR_EMAIL_EXIST.message)

                return
            }

            if (isUsernameExist) {
                response
                    .status(ERROR_USERNAME_EXIST.status)
                    .end(ERROR_USERNAME_EXIST.message)

                return
            }

            const user = await User.create({
                name,
                password,
                username,

                email: {
                    value: email,
                    code: getHash(),
                },
            })

            const session = await createSession(user, request.useragent, ip)
            user.sessions.push(session)

            await user.save()

            try {
                const host = config.get('HOST')
                const token = user.email.code

                await mail.send(email, 'Confirm Email', 'confirm', { token, host })
            } catch (error) {
                await response
                    .status(FATAL_MAIL_PROVIDER.status)
                    .end(FATAL_MAIL_PROVIDER.message)

                return
            }

            response.json(session)
        } catch (error) {
            handleError(error)

            response
                .status(FATAL_CREATE_USER.status)
                .end(FATAL_CREATE_USER.message)
        }
    }
}

export default new RouteMiddleware({ limit: 100, time: 10 })
