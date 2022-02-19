import { Router } from 'express';

import NotFound from '../middlewares/NotFound';

const routes = Router();

routes.use('*', NotFound);

export default routes;
