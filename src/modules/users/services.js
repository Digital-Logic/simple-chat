import { model } from './model';
import { BadRequest, Forbidden } from 'http-errors';

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
                return res.status(204).send();

            req.ability.throwUnlessCan('update', doc);
            const updatableFields = model.accessibleFieldsBy(req.ability, 'update');
            // console.log(updatableFields);
            // console.log(req.body);
            // filter data that the user does not have access to update
            Object.entries(req.body).forEach(([key, value]) => {
                if (updatableFields.indexOf(key) !== -1){
                    doc[key] = value;
                }
            });

            //console.log(doc);

            return doc.save({ validateBeforeSave: true });
        })
        .then(doc => {
            // collect fields that user can view.
            //console.log(doc);
            const readableFields = model.accessibleFieldsBy(req.ability, 'read');

            const responseObj = readableFields.reduce((obj, key) => {
                obj[key] = doc[key];
                return obj;
            },{ });
            console.log(responseObj);

            res.json(responseObj);
        })
        .catch(e => {
            console.log(e);
            next(e);
        });
}

function deleteOne(req, res, next) {
    if (!req.params.id) {
        console.log('Sending error');
        return next(new BadRequest("Invalid user id."));
    }

    model.findById(req.params.id)
        .then(doc => {
            req.ability.throwUnlessCan('delete', doc);
            return doc.remove();
        })
        .then(result => {
            if (req.user.id === req.params.id) {
                // are we deleting the currently logged in user?
                // Remove auth cookies
                req.universalCookies.remove('accessToken');
                req.universalCookies.remove('refreshToken');
            }
            res.status(204).send("User deleted.");
        })
        .catch(err => {
            next(err);
        });
}

export {
    findAll,
    findOne,
    updateOne,
    deleteOne
};