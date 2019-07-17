import config from 'nconf'
import path from 'path'

const options = {
    file: path.join(__dirname, 'options.json'),
}

config.argv()
    ?.env('_')
    ?.file(options)

export default config
