
import Joi from 'joi'

export const schema = Joi

export default schema => async (request, response, next) => {
    try {
        await Joi.validate(request?.body, schema)

        next()
    } catch(error) {
        const message = error?.details
            ?.reduce((result, error) => `${result + error.message}\n`, '')

        return response.status(400).send(message)
    }
}
