import { Router } from 'express';
import { findAll, findOne, updateOne, deleteOne } from './services';

function config(app) {
    const router = new Router();
    app.use('/users', router);

    router.route('/')
        .get(findAll);

    router.route('/:id')
        .get(findOne)
        .put(updateOne)
        .delete(deleteOne);
}

export default config;