import inspect from '../../utils/inspect'

export default socket => {
    return new Promise(resolve => {
        try {
            socket.on('connection', connection => {
                inspect(`ws: ID <${connection.id}> - connected`)

                resolve(connection)
            })
        } catch (error) {
            inspect(error)
        }
    })
}
