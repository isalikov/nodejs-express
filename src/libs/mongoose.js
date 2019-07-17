import mongoose from 'mongoose'

import double from 'mongoose-double'
import { promisifyAll } from 'bluebird'

import config from '../config'
import inspect from '../utils/inspect'

double(mongoose)
promisifyAll(mongoose)

const __URL__ = config.get('MONGODB:URL')

let retryes = 100

function connect() {
    mongoose.connect(__URL__, {
        connectTimeoutMS: 10000,
        reconnectInterval: 500,
        reconnectTries: Number.MAX_VALUE,
        useCreateIndex: true,
        useNewUrlParser: true,
    }).catch(error => {
        inspect(error)

        retryes--

        if (retryes > 0) {
            setTimeout(() => { connect() }, 1000)
        }
    })
}

connect()

export default mongoose
