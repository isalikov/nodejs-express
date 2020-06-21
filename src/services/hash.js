import { SHA512 } from 'crypto-js'

export default function (pow = 25) {
    const rValue = (Math.random() * (pow ** pow))
        .toString(32)
        .replace('.', '')

    return SHA512(rValue).toString()
}
