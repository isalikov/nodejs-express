import { Router } from 'express'

import deleteToken from './middlewares/deleteToken'
import emailConfirm from './middlewares/emailConfirm'
import passwordReset from './middlewares/passwordReset'
import passwordSet from './middlewares/passwordSet'
import signIn from './middlewares/signIn'
import signOut from './middlewares/signOut'
import signUp from './middlewares/signUp'

const router = Router()

router.put(
    '/email/confirm',
    emailConfirm.debounce,
    emailConfirm.handle,
)

router.delete(
    '/token/:token',
    deleteToken.debounce,
    deleteToken.confirmed,
    deleteToken.validate,
    deleteToken.handle,
)

router.put(
    '/password/reset',
    passwordReset.debounce,
    passwordReset.validate,
    passwordReset.handle,
)

router.put(
    '/password/set',
    passwordSet.debounce,
    passwordSet.validate,
    passwordSet.handle,
)

router.post(
    '/sign/in',
    signIn.debounce,
    signIn.validate,
    signIn.handle,
)

router.delete(
    '/sign/out',
    signOut.authorize,
    signOut.handle,
)


router.put(
    '/sign/up',
    signUp.debounce,
    signUp.validate,
    signUp.handle,
)

export default router
