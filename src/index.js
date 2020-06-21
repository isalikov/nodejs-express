import mongoose from './services/mongoose'
import redis from './services/redis'

import config from './config'
import server from './server'

(async function main() {
    await mongoose()
    await redis()

    server.listen(config.get('PORT'))
}())
