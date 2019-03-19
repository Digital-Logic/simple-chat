import { Router } from 'express';
import { signIn, signUp } from './services';

function config(app) {
    const router = new Router();
    app.use('/', router);

    router.route('/sign-in')
        .post(signIn);

    router.route('/sign-up')
        .post(signUp);
}

export default config;