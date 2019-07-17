import Service, { schema } from '../../services/validate'

export class Validate {
    static createSessionBody = Service({
        email: schema.string().required(),
        password: schema.string().required(),
    })
}

