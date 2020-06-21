import { Router } from 'express'

import email from './middlewares/email'
import username from './middlewares/username'

const router = Router()

router.get(
    '/email/:email',
    email.debounce,
    email.validate,
    email.handle,
)

router.get(
    '/username/:username',
    username.debounce,
    username.validate,
    username.handle,
)

export default router
