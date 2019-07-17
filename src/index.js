import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import http from 'http'
import logger from 'morgan'
import userAgent from 'express-useragent'

import config from './config'
import router from './router'
import * as sockets from './sockets'

import init from './scripts/init'

const app = new express()
const port = config.get('PORT') || 3000

const develop = process.env.NODE_ENV !== 'production'

app.use(cors({
    allowedHeaders: [
        'Authorization',
        'Content-Type',
    ],
    methods: [
        'GET',
        'POST',
        'PUT',
        'DELETE',
        'PATCH',
    ],
    origin: '*',
}))

if (develop) {
    app.use(logger('dev'))
}

app.use(userAgent.express())

app.use(bodyParser.urlencoded({
    extended: true,
    limit: '5mb',
}))

app.use(bodyParser.json({
    limit: '5mb',
}))

app.use(router)

const server = http.createServer(app)

sockets.listen(server)
server.listen(port)

init()
