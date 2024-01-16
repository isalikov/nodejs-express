import 'dotenv/config'

import bodyParser from 'body-parser'
import express from 'express'
import useragent from 'express-useragent'
import morgan from 'morgan'

import routes from './routes'
import pkg from '../package.json'
import http from 'http'
;(function main() {
    const isDevelop = process.env.NODE_ENV !== 'production'

    const app = express()
    const server = http.createServer(app)

    app.use(bodyParser.json())
    app.use(useragent.express())
    app.use(morgan(isDevelop ? 'dev' : 'common'))
    app.use(routes)
    server.listen(process.env.PORT)
    console.log(`${pkg.name}: is running on`, Number(process.env.PORT))
})()
