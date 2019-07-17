import inspect from '../../utils/inspect'

export default connection => {
    connection.on('disconnect', reason => {
        inspect(`ws: ID <${connection.id}> - disconnected | reason: ${reason}`)
    })
}
