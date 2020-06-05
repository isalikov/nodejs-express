import crypt from 'crypto-js'

import User from '../../models/User'
import { log, random } from '../../utils'

export class Session {
    static create = async (request, response) => {
        const { email, password } = request.body

        const user = await User.findOne({ email })

        if (!user) {
            return response.sendStatus(401)
        }

        if (crypt.SHA512(password).toString() !== user.hash) {
            return response.sendStatus(401)
        }

        const sessionIndex = user.sessions
            ?.findIndex(session => session.source === request.useragent?.source)

        if (sessionIndex !== -1) {
            user.sessions?.splice(sessionIndex, 1)
        }

        const newSession = {
            source: request.useragent?.source,
            token: random(),
        }

        user.sessions?.unshift(newSession)

        try {
            await user.save()

            return response.status(200).send(newSession.token)
        } catch (error) {
            log(error)

            return response.sendStatus(500)
        }
    }

    static destroy = async (request, response) => {
        const user = await User.findOne({ email: request.user?.email })

        if (!user) {
            return response.sendStatus(403)
        }

        const sessionIndex = user.sessions
            ?.findIndex(session => session.token === request.headers?.authorization)

        if (sessionIndex !== -1) {
            user.sessions?.splice(sessionIndex, 1)
        }

        try {
            await user.save()

            response.sendStatus(204)
        } catch (error) {
            log(error)

            return response.sendStatus(500)
        }
    }

    static destroyByUUID = async (request, response) => {
        const user = await User.findOne({ email: request.user?.email })

        if (!user) {
            return response.sendStatus(403)
        }

        const sessionIndex = user.sessions
            ?.findIndex(session => session.uuid === request.params?.UUID)

        if (sessionIndex === -1) {
            return response.status(404)
                .send(`session ${request.params?.UUID} not found`)
        }

        user.sessions?.splice(sessionIndex, 1)

        try {
            await user.save()

            return response.sendStatus(204)
        } catch (error) {
            log(error)

            return response.sendStatus(500)
        }
    }
}
