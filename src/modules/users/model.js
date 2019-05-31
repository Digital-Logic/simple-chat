import { Schema } from 'mongoose';
import { isEmail } from 'validator';
import bcrypt from 'bcrypt';
import config from '@config';
import { retrieveOrCreate } from '@utils';
import { ROLES } from '../auth/abilities';
import { Conflict } from 'http-errors';
import logger from '@src/Logger';

const modelName = "User";
const AUTH_TYPES = Object.freeze({
    PWD: 'PWD',
    GOOGLE: 'GOOGLE',
    FACEBOOK: 'FACEBOOK'
});

const schema = {
    email: {
        type: String,
        trim: true,
        validate: {
            validator(value) {
                return isEmail(String(value));
            },
            message: "Email address is not valid."
        },
        required: [true, "Email address is required."],
        unique: true
    },
    firstName: {
        type: String,
        trim: true,
        required: false
    },
    lastName: {
        type: String,
        trim: true,
        required: false
    },
    accountVerified: {
        type: Boolean,
        default: false,
        required: true
    },
    pwd: {
        type: String,
        minlength: [7, "Password must be at lest 7 characters."],
        select: false
    },
    authTypes: {
        type: []
    },
    role: {
        type: String,
        trim: true,
        enum: Object.values(ROLES),
        required: true,
        default: ROLES.USER
    },
    disabled: {
        type: Boolean,
        default: false,
        required: true
    }
}

const userSchema = new Schema(schema, { timestamps: true });

userSchema.pre('save', function() {
    return new Promise( (resolve, reject) => {
        if (this.isModified('pwd')) {
            bcrypt.hash(this.pwd, config.bcryptSalt)
                .then(encodedPwd => {
                    this.pwd = encodedPwd;
                    resolve();
                })
                .catch(e => reject(e));
        } else {
            resolve();
        }
    });
});

userSchema.post('save', function(err, doc, next) {
    if (err.name === 'MongoError' && err.code === 11000) {
        next(new Conflict('Email must be unique.'));
    } else {
        next(err);
    }
});

userSchema.methods.checkPassword = function(pwd) {
    return bcrypt.compare(pwd, this.pwd)
        .catch(e => {
            //logger.error('checkPassword error: ', e);
            return false;
        });
}

// If this model already exist, retrieve it, else create it.
const model = retrieveOrCreate(modelName, userSchema);

export {
    model,
    modelName,
    schema,
    AUTH_TYPES
};
