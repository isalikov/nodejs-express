import { Router } from 'express'

import { Authorize as authorize } from '../../services/authorize'
import { Session as service } from './service'
import { Validate } from './validate'

const router = Router()

router.put('/create', Validate.createSessionBody, service.create)
router.delete('/destroy', authorize, service.destroy)
router.delete('/destroy/:UUID', authorize, service.destroyByUUID)

export default router
