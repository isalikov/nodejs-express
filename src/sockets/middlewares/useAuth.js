import User from '../../models/User'

export default connection => {
    connection.use(async (packet, next) => {
        const [, data] = packet

        if (!data?.token || data?.token.length < 60) {
            connection.emit('unauthorized', 403)

            return connection.disconnect()
        }

        const user = await User.findOne({ 'sessions.token': data?.token })
            .select('-hash -inviteHash -_id -__v -sessions.token')

        if (!user) {
            connection.emit('unauthorized', 403)

            return connection.disconnect()
        }

        next()
    })
}
