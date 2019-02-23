import { Router } from 'express';

function routeGenerator(controller) {
    const router = Router();

    router.param("id", controller.findByParam);

    router.route('/')
        .get(controller.getAll)
        .post(controller.createOne);

    router.route('/:id')
        .get(controller.getOne)
        .put(controller.updateOne)
        .delete(controller.deleteOne);

    return router;
}

export default routeGenerator;