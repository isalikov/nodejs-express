import moment from 'moment'

export class Status {
    static getStatus = async (_, response) => {
        await response.json({
            status: 'ok',
            time: moment().format(),
        })
    }
}
