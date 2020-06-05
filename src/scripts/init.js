import config from '../config'
import mongoose from '../libs/mongoose'
import { log } from '../utils'

import User from '../models/User'

const __EMAIL__ = config.get('USER:EMAIL')
const __PASSWORD__ = config.get('USER:PASSWORD')

export function create(user) {
    if (!user) {
        User.create({
            email: __EMAIL__,
            password: __PASSWORD__,
        })
    }
}

export default () => {
    mongoose.connection.once('open', () => {
        const { host, name } = mongoose.connection

        log(`mongodb: <${host}/${name}> - connected`)

        User.findOne({ email: __EMAIL__ }).then(create)
    })
}
