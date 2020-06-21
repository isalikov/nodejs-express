import Joi from '@hapi/joi'

import Route from '../../../services/route'
import User from '../../../models/user'

import cache from '../../../services/cache'
import { handleError } from '../../../services/logger'
import { SELECT_USER } from '../../../schemas/user'

import {
    FATAL_PATCH_USER,
} from '../../../constants'

const bodySchema = Joi.object({
    about: Joi.string(),
    links: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            url: Joi.string().required(),
        }),
    ),
    icon: Joi.string(),
    position: Joi.string(),
    projects: Joi.array().items(
        Joi.object({
            date: Joi.string(),
            description: Joi.string(),
            links: Joi.array().items(
                Joi.object({
                    name: Joi.string().required(),
                    url: Joi.string().required(),
                }),
            ),
            name: Joi.string().required(),
            stack: Joi.array().items(
                Joi.string(),
            ),
        }),
    ),
    skills: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            props: Joi.array().items(
                Joi.string(),
            ),
        }),
    ),
})

class RouteMiddleware extends Route {
    constructor(props) {
        super(props)

        this.validate = this.getValidationMiddleware('body', bodySchema)
    }

    async handle({ body, session }, response) {
        try {
            const user = await User.findOneAndUpdate(
                { uuid: session.uuid },
                body,
                {
                    new: true,
                    fields: SELECT_USER,
                },
            )

            await cache.remove(user.username)

            response.json(user)
        } catch (error) {
            handleError(error)

            response
                .status(FATAL_PATCH_USER.status)
                .end(FATAL_PATCH_USER.message)
        }
    }
}

export default new RouteMiddleware({ limit: 100, time: 10 })
