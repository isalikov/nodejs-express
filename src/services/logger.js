import * as sentry from '@sentry/node'
import bunyan from 'bunyan'
import bunyanFormat from 'bunyan-format'
import fs from 'fs'
import touch from 'touch'
import { createLogger, transports, format } from 'winston'

import config from '../config'

const accessLogsPath = `${config.get('LOGS:PATH')}/${config.get('LOGS:ACCESS')}`
const errorLogsPath = `${config.get('LOGS:PATH')}/${config.get('LOGS:ERROR')}`
const logsPath = config.get('LOGS:PATH')
const sentryDsn = config.get('SENTRY:DSN')

if (!fs.existsSync(logsPath)) {
    fs.mkdirSync(logsPath)
}

touch(accessLogsPath)
touch(errorLogsPath)

const outStream = bunyanFormat({ outputMode: 'short' })

const logger = bunyan.createLogger({
    name: config.get('NAME'),
    src: true,
    streams: [
        {
            level: 'debug',
            stream: outStream,
        },
        {
            count: 3,
            level: 'error',
            path: errorLogsPath,
            period: '1d',
            type: 'rotating-file',
        },
    ],
})

export const handleRequest = createLogger({
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
        format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
    ),
    transports: [
        new transports.File({
            filename: accessLogsPath,
            json: false,
            maxsize: 5242880,
            maxFiles: 5,
        }),
    ],
})

if (sentryDsn) {
    sentry.init({ dsn: sentryDsn })
}

handleRequest.stream = {
    write: (message) => {
        handleRequest.info(message.substring(0, message.lastIndexOf('\n')))
        logger.info(message.substring(0, message.lastIndexOf('\n')))
    },
}

export function handleLog(message) {
    logger.info(message)
}

export function handleMessage(message) {
    logger.debug(message)

    if (sentryDsn) {
        sentry.captureMessage(message)
    }
}

export function handleError(message) {
    logger.error(message)

    if (sentryDsn) {
        sentry.captureException(message)
    }
}

export default {
    handleError,
    handleLog,
    handleMessage,
    handleRequest,
}
