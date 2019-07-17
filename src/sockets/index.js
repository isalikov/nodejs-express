import io from 'socket.io'

import inspect from '../utils/inspect'

import onDisconnect from './handlers/onDisconnect'
import useAuth from './middlewares/useAuth'

export let connection
export let socket = io()

export const listen = http => {
    socket = io(http)

    socket.on('connection', connection => {
        inspect(`ws: ID <${connection.id}> - connected`)

        useAuth(connection)

        onDisconnect(connection)
    })
}
