import 'dotenv/config'

import bodyParser from 'body-parser'
import express from 'express'
import useragent from 'express-useragent'
import morgan from 'morgan'

import routes from './routes'

import http from 'http'

const main = async () => {
    const isDevelop = process.env.NODE_ENV !== 'production'

    const app = express()
    const server = http.createServer(app)

    app.use(bodyParser.json())
    app.use(useragent.express())
    app.use(morgan(isDevelop ? 'dev' : 'common'))
    app.use(routes)
    server.listen(process.env.PORT)
}

main().catch(console.error)
