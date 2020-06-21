import redis from 'redis'
import bluebird from 'bluebird'

import { handleError, handleLog } from './logger'

import config from '../config'

const host = config.get('REDIS:HOST')
const port = config.get('REDIS:PORT')

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

let client = null

export default async function () {
    if (!client) {
        client = redis.createClient({ host, port })

        handleLog(`REDIS :: connecting to redis://${host}:${port}`)

        client.on('error', (error) => {
            handleError(error)
        })

        client.on('connect', () => {
            handleLog(`REDIS :: successful connected to redis://${host}:${port}`)
        })
    }

    return client
}
