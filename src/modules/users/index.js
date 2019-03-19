import { Router } from 'express';
import { findAll } from './services';

function config(app) {
    const router = new Router();
    app.use('/users', router);

    router.route('/')
        .get(findAll);
}

export default config;