import mongoose from 'mongoose'
import uuid from 'shortid'

import config from '../config'
import getHash from '../services/hash'

import email, { SELECT_EMAIL } from './email'

export const SELECT_USER = `
    -_id
    about
    icon
    name
    position
    username
    uuid

    ${SELECT_EMAIL}
`

export default new mongoose.Schema({
    about: String,
    name: String,

    icon: {
        type: String,
        default: config.get('ASSETS:ICON'),
    },

    email: {
        index: true,
        required: true,
        type: email,
    },

    hash: {
        default: getHash,
        index: true,
        type: String,
    },

    reset: {
        default: getHash,
        index: true,
        type: String,
    },

    sessions: {
        type: [String],
    },

    uuid: {
        default: uuid.generate,
        index: true,
        unique: true,
        type: String,
    },

    username: {
        index: true,
        required: true,
        unique: true,
        type: String,
    },
}, { timestamps: true, id: false })
