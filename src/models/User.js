import mongoose from 'mongoose'
import { SHA512 } from 'crypto-js'

import userSchema from '../schemas/user'

export function setPassword(value) {
    this.hash = SHA512(value).toString()
}

userSchema.virtual('password').set(setPassword)

export default mongoose.model('user', userSchema)
