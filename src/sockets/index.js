import io from 'socket.io'

import { log } from '../utils'

import onDisconnect from './handlers/onDisconnect'
import useAuth from './middlewares/useAuth'

export let connection
export let socket = io()

export const listen = http => {
    socket = io(http)

    socket.on('connection', connection => {
        log(`ws: ID <${connection.id}> - connected`)

        useAuth(connection)

        onDisconnect(connection)
    })
}
