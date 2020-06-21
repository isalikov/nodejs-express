import Redis from '../redis'

export default async function (token) {
    const redis = await Redis()

    return new Promise((resolve, reject) => {
        redis.hgetall(token, (error, result) => {
            if (error) {
                reject(error)

                return
            }

            const payload = result && JSON.parse(result.source)

            resolve(
                payload ? { ...payload, token } : null,
            )
        })
    })
}
