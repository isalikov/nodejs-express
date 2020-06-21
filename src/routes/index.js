import { Router } from 'express'

import AuthRoute from './auth'
import ErrorRoute from './error'
import TouchRoute from './touch'
import UserRoute from './user'

const router = Router()

router.use('/auth', AuthRoute)
router.use('/touch', TouchRoute)
router.use('/user', UserRoute)
router.use('*', ErrorRoute)

export default router
