import crypt from 'crypto-js'
import uuid from 'shortid'

import mongoose from '../libs/mongoose'
import { value as hashValue } from '../utils/random'

const sessionSchema = new mongoose.Schema({
    uuid: {
        default: uuid.generate,
        index: true,
        type: String,
    },
    source: String,
    token: String,
}, { timestamps: true, _id: false, id: false })

const userSchema = new mongoose.Schema({
    uuid: {
        default: uuid.generate,
        index: true,
        unique: true,
        type: String,
    },
    email: {
        index: true,
        required: true,
        unique: true,
        type: String,
    },
    hash: {
        default: hashValue,
        index: true,
        type: String,
    },
    name: String,
    sessions: [sessionSchema],
}, { timestamps: true, id: false })

userSchema.virtual('password').set(function(value) {
    this.hash = crypt.SHA512(value).toString()
})

export default mongoose.model('user', userSchema)
