import { MD5 } from 'crypto-js'

import Redis from './redis'

export default class Cache {
    static async get(key) {
        const redis = await Redis()
        const getter = MD5(key).toString()

        return new Promise((resolve, reject) => {
            redis.hgetall(getter, (error, result) => {
                if (error) {
                    reject(error)

                    return
                }

                const payload = result && result.cache && JSON.parse(result.cache)

                resolve(payload)
            })
        })
    }

    static async set(key, value) {
        const redis = await Redis()
        const setter = MD5(key).toString()

        return new Promise((resolve, reject) => {
            let payload = ''

            try {
                payload = JSON.stringify(value)
            } catch (error) {
                reject(error)

                return
            }

            redis.hmset(setter, ['cache', payload], (error) => {
                if (error) {
                    reject(error)

                    return
                }

                resolve(setter)
            })
        })
    }

    static async remove(key) {
        const redis = await Redis()
        const getter = MD5(key).toString()

        return new Promise((resolve, reject) => {
            redis.hdel(getter, 'cache', (error) => {
                if (error) {
                    reject(error)

                    return
                }

                resolve()
            })
        })
    }
}
