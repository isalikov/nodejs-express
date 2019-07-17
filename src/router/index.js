import { Router } from 'express'

import SessionRoute from './session'
import StatusRoute from './status'
import UserRoute from './user'

const router = Router()

router.use('/session', SessionRoute)
router.use('/status', StatusRoute)
router.use('/user', UserRoute)

router.use('*', async (_, response) => response.sendStatus(405))

export default router
