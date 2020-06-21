import Joi from '@hapi/joi'

import Route from '../../../services/route'
import User from '../../../models/user'

import config from '../../../config'
import getHash from '../../../services/hash'
import mail from '../../../services/mail'
import { handleError } from '../../../services/logger'

import {
    ERROR_EMAIL_NOT_FOUND,
    FATAL_MAIL_PROVIDER,
    FATAL_RESET_PASSWORD,
    SUCCESS_RESET_PASSWORD,
} from '../../../constants'

const bodySchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2 })
        .required(),
})

class RouteMiddleware extends Route {
    constructor(props) {
        super(props)

        this.validate = this.getValidationMiddleware('body', bodySchema)
    }

    async handle(request, response) {
        try {
            const { email } = request.body

            const user = await User.findOne({ 'email.value': email })

            if (!user) {
                response
                    .status(ERROR_EMAIL_NOT_FOUND.status)
                    .end(ERROR_EMAIL_NOT_FOUND.message)

                return
            }

            const token = getHash()
            const host = config.get('HOST')
            user.reset = token

            await user.save()
            try {
                await mail.send(email, 'Reset password link', 'reset', { token, host })
            } catch (error) {
                response
                    .status(FATAL_MAIL_PROVIDER.status)
                    .end(FATAL_MAIL_PROVIDER.message)

                return
            }

            response
                .status(SUCCESS_RESET_PASSWORD.status)
                .end(SUCCESS_RESET_PASSWORD.message)
        } catch (error) {
            handleError(error)

            response
                .status(FATAL_RESET_PASSWORD.status)
                .end(FATAL_RESET_PASSWORD.message)
        }
    }
}

export default new RouteMiddleware({ limit: 100, time: 10 })
