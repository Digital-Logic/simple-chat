import { model } from 'mongoose';

function retrieveOrCreate(modelName, schema) {
    let mod;
    try {
        mod = model(modelName);
    } catch (e) {
        mod = model(modelName, schema);
    }
    return mod;
}

export {
    retrieveOrCreate
};