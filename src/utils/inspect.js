import { inspect } from 'util'

export default (data, depth = 4) => {
    const value = inspect(data, {
        depth,
        colors: true,
        sorted: true,
    })

    process.stdout.write(`${value}\n`)
}
