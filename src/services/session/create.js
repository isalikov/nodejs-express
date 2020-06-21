import moment from 'moment'

import Redis from '../redis'
import getHash from '../hash'

export default async function (user, useragent, ip) {
    const redis = await Redis()
    const token = getHash()

    return new Promise((resolve, reject) => {
        let payload = ''

        try {
            payload = JSON.stringify({
                ip,
                useragent,
                uuid: user.uuid,
                createdAt: moment().format(),
            })
        } catch (error) {
            reject(error)

            return
        }

        redis.hmset(token, ['source', payload], (error) => {
            if (error) {
                reject(error)

                return
            }

            resolve(token)
        })
    })
}
