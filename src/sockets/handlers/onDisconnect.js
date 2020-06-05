import { log } from '../../utils'

export default connection => {
    connection.on('disconnect', reason => {
        log(`ws: ID <${connection.id}> - disconnected | reason: ${reason}`)
    })
}
