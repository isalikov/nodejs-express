import io from 'socket.io'

import onConnect from './handlers/onConnect'
import onDisconnect from './handlers/onDisconnect'

export let connection
export let socket = io()

export const listen = async http => {
    socket = io(http)

    connection = await onConnect(socket)
    onDisconnect(connection)
}
