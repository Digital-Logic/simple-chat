import { Router } from 'express';
import { findAll, findOne, updateOne, deleteOne } from './services';

function config(app) {
    const router = new Router();

    router.route('/')
        .get(findAll);

    router.route('/:id')
        .get(findOne)
        .put(updateOne)
        .delete(deleteOne);

    app.use('/api/users', router);
}

export default config;