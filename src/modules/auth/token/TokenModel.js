import { Schema } from 'mongoose';
import { retrieveOrCreate } from '@utils';

const modelName = "Token";

const schema = {
    token: {
        type: String,
        required: [true, "token is a required field."],
        unique: true
    },
    exp: {
        type: Date,
        required: [true, "exp is a required field."]
    }
};

const tokenSchema = new Schema(schema);

const model = retrieveOrCreate(modelName, tokenSchema);

export {
    model,
    modelName,
    schema
};
