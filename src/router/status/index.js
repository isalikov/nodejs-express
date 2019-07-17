import { Router } from 'express'

import { Status as service } from './service'

const router = Router()

router.get('/', service.getStatus)

export default router
