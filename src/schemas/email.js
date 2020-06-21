import mongoose from 'mongoose'

export const SELECT_EMAIL = `
    email.confirmed
    email.value
`

export default new mongoose.Schema({
    code: {
        required: true,
        type: String,
    },

    confirmed: {
        type: Boolean,
        default: false,
    },

    value: {
        index: true,
        type: String,
        unique: true,
        required: true,
    },
}, { id: false, timestamps: true })
