function generateController( model, overrides) {
    const defaults = {
        findByParam: findByParam(model),
        getOne: getOne(model),
        getAll: getAll(model),
        createOne: createOne(model),
        deleteOne: deleteOne(model),
        updateOne: updateOne(model)
    }
    return Object.assign(defaults, overrides);
}

function getAll(model) {
    return function _getAll(req, res, next) {
        return model.find()
            .then(res.json)
            .catch(next);
    }
}

function getOne(model) {
    return function _getOne(req, res, next) {
        return Promise.resolve(req.resource)
            .then(res.json);
    }
}

function createOne(model) {
    return function _createOne(req, res, next) {
        return model.create(req.body)
            .then(res.status(201).json)
            .catch(next);
    }
}

function deleteOne(model) {
    return function _deleteOne(req, res, next) {
        return req.resource.remove()
            .then(res.status(202).json)
            .catch(next);
    }
}

function updateOne(model) {
    return function _updateOne(req, res, next) {
        return req.resource
                .updateOne(req.body, { runValidators: true }).exec()
                    // update was successful, get the new document
                .then(result => model.findById(req.resource.id).exec())
                    // send the updated document back to the user
                .then(res.json)
                    // send errors to the global error processor
                .catch(next);
    }
}

function findByParam(model) {
    return function _findByParam(req, res, next, id, propName) {
        return model
                    .findById(id).exec()
                .then(doc => {
                    if (!doc) {
                        next(new Error('Resource not found'))
                    } else {
                        req.resource = doc;
                        next();
                    }
                })
                .catch(next);
    }
}

export default generateController;