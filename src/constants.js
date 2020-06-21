export const FATAL_MAIL_PROVIDER = { status: 500, message: 'MAIL PROVIDER EXCEPTION' }
export const FATAL_MONGODB_PROVIDER = { status: 500, message: 'DATABASE EXCEPTION' }
export const FATAL_SESSION_PROVIDER = { status: 500, message: 'SESSION EXCEPTION' }

export const FATAL_CREATE_SESSION = { status: 500, message: 'CREATE SESSION EXCEPTION' }
export const FATAL_CREATE_USER = { status: 500, message: 'CREATE USER EXCEPTION' }
export const FATAL_GET_USER = { status: 500, message: 'GET USER EXCEPTION' }
export const FATAL_PATCH_USER = { status: 500, message: 'PATCH USER EXCEPTION' }
export const FATAL_REMOVE_SESSION = { status: 500, message: 'REMOVE SESSION EXCEPTION' }
export const FATAL_RESET_PASSWORD = { status: 500, message: 'RESET PASSWORD EXCEPTION' }
export const FATAL_SET_PASSWORD = { status: 500, message: 'SET PASSWORD EXCEPTION' }

export const ERROR_EMAIL_EXIST = { status: 409, message: 'EMAIL TAKEN' }
export const ERROR_EMAIL_NOT_FOUND = { status: 404, message: 'EMAIL NOT FOUND' }
export const ERROR_FORBIDDEN = { status: 403, message: 'FORBIDDEN' }
export const ERROR_INVALID_CONFIRMATION_TOKEN = { status: 400, message: 'INVALID CONFIRMATION TOKEN' }
export const ERROR_LOCKED = { status: 423, message: 'LOCKED' }
export const ERROR_NOT_ALLOWED = { status: 423, message: 'NOT ALLOWED' }
export const ERROR_NOT_FOUND = { status: 404, message: 'RESOURCE NOT FOUND' }
export const ERROR_REQUEST_VALIDATION = { status: 400, message: 'REQUEST BODY INVALID' }
export const ERROR_TO_MANY_REQUESTS = { status: 429, message: 'TO MANY REQUESTS' }
export const ERROR_UNAUTHORIZED = { status: 401, message: 'UNAUTHORIZED' }
export const ERROR_USERNAME_EXIST = { status: 409, message: 'USERNAME TAKEN' }

export const SUCCESS_EMAIL_AVAILABLE = { status: 200, message: 'EMAIL AVAILABLE' }
export const SUCCESS_EMAIL_CONFIRMED = { status: 200, message: 'EMAIL CONFIRMED' }
export const SUCCESS_NEW_PASSWORD = { status: 200, message: 'PASSWORD SET' }
export const SUCCESS_REMOVE_SESSION = { status: 200, message: 'SESSION REMOVED' }
export const SUCCESS_RESET_PASSWORD = { status: 200, message: 'RESET PASSWORD' }
export const SUCCESS_SET_PASSWORD = { status: 200, message: 'SET PASSWORD' }
export const SUCCESS_USERNAME_AVAILABLE = { status: 200, message: 'USERNAME AVAILABLE' }

export default { }
