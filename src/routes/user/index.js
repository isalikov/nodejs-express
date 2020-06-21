import { Router } from 'express'

import getUser from './middlewares/getUser'
import getUserByUsername from './middlewares/getUserByUsername'
import patchUser from './middlewares/patchUser'

const router = Router()

router.get(
    '/',
    getUser.debounce,
    getUser.authorize,
    getUser.handle,
)

router.get(
    '/:username',
    getUserByUsername.debounce,
    getUserByUsername.validate,
    getUserByUsername.handle,
)

router.patch(
    '/',
    patchUser.debounce,
    patchUser.confirmed,
    patchUser.validate,
    patchUser.handle,
)

export default router
