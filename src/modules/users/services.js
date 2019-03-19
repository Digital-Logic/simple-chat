import { model, modelName } from './model';


function findAll(req, res, next) {
    model.find()
        .select('-updatedAt -disabled')
        .lean()
        .exec()
        .then(results => {
            req.ability.throwUnlessCan('read', modelName);
            res.json(results);
        })
        .catch(next);
}

function findOne(req, res, next) {

}

export {
    findAll,
    findOne
};