export class User {
    static getUser = async (request, response) => {
        response.json(request.user)
    }
}
