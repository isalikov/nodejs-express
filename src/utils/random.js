import crypt from 'crypto-js'

export const value = (length = 256) =>
    crypt.lib.WordArray.random(length / 8).toString()
