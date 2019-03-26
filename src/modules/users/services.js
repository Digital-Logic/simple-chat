import { model } from './model';
import { BadRequest, Forbidden } from 'http-errors';
import { read } from 'fs';

function findAll(req, res, next) {
    model.accessibleBy(req.ability, 'read')
        .select(model.accessibleFieldsBy(req.ability, 'read'))
        .then(result => {
            res.json(result);
        })
        .catch(next);
}

function findOne(req, res, next) {

    model.findById(req.params.id)
        .accessibleBy(req.ability, 'read')
        .select(model.accessibleFieldsBy(req.ability, 'read'))
        .then(result => {
            res.json(result);
        })
        .catch(next);
}

function updateOne(req, res, next) {

    model.findById(req.params.id)
        .accessibleBy(req.ability, 'update')
        .then(doc => {
            if (!doc)
                res.status(204).send();

            req.ability.throwUnlessCan('update', doc);

            const updatableFields = model.accessibleFieldsBy(req.ability, 'update');
            // apply updates
            Object.entries(req.body).forEach(([key, value]) => {
                if (updatableFields.indexOf(key) !== -1){
                    doc[key] = value;
                }
            });

            return doc.save({ validateBeforeSave: true });
        })
        .then(savedDoc => {
            // collect fields that logged in user can view.
            const readableFields = model.accessibleFieldsBy(req.ability, 'read');
            const responseObj = readableFields.reduce((obj, key) => {
                obj[key] = savedDoc[key];
                return obj;
            },{});

            res.json(responseObj);
        })
        .catch(e => {
            next(e);
        });
}

function deleteOne(req, res, next) {

}

export {
    findAll,
    findOne,
    updateOne,
    deleteOne
};