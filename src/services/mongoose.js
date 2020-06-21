import mongoose from 'mongoose'
import { promisifyAll } from 'bluebird'

import config from '../config'

import { handleError, handleLog } from './logger'

promisifyAll(mongoose)

const URL = `mongodb://${config.get('MONGODB:HOST')}:${config.get('MONGODB:PORT')}/${config.get('MONGODB:COLLECTION')}`

let retryes = 100
let connected = false

function connect() {
    handleLog(`MONGODB :: connecting to: ${URL}`)

    mongoose.set('useUnifiedTopology', true)

    mongoose.connect(URL, {
        connectTimeoutMS: 10000,
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
    }).then(() => {
        connected = true
        handleLog(`MONGODB :: successful connected to: ${URL}`)
    }).catch((error) => {
        handleError(error)

        /* eslint-disable no-plusplus */
        retryes--

        if (retryes > 0) {
            setTimeout(() => { connect() }, 1000)
        }
    })
}

export default async function () {
    if (!connected) {
        connect()
    }

    return mongoose
}
