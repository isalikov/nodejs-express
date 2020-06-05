import CryptoJS from 'crypto-js'
import { inspect } from 'util'

export function log(data, depth = 4) {
    const value = inspect(data, {
        depth,
        colors: true,
        sorted: true,
    })

    process.stdout.write(`${value}\n`)
}

export function random(length = 10) {
    return CryptoJS.lib.WordArray.random(length / 8).toString()
}
