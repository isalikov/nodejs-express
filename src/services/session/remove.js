import Redis from '../redis'

export default async function (token) {
    const redis = await Redis()

    return new Promise((resolve, reject) => {
        redis.hdel(token, 'source', (error) => {
            if (error) {
                reject(error)

                return
            }

            resolve()
        })
    })
}
