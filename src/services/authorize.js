import User from '../models/User'

export const Authorize = async (request, response, next) => {
    const token = request.headers.authorization

    if (!token || token.length < 60) {
        return response.sendStatus(403)
    }

    const user = await User.findOne({ 'sessions.token': token })
        .select('-hash -inviteHash -_id -__v -sessions.token')

    if (!user) {
        return response.sendStatus(403)
    }

    request.user = user

    next()
}
