import { Schema } from 'mongoose';
import { isEmail } from 'validator';
import bcrypt from 'bcrypt';
import config from '@config';
import { retrieveOrCreate } from '@utils';

const modelName = "User";

const schema = {
    email: {
        type: String,
        validate: {
            validator(value) {
                return isEmail(String(value));
            },
            message: "Email address is not valid."
        },
        required: [true, "Email address is required."],
        unique: [true, "Email address is already used."]
    },
    pwd: {
        type: String,
        minlength: [7, "Password must be at lest 7 characters."],
        required: [true, "Password is required."],
        select: false
    },
    roles: {
        type: [String],
        required: true,
        default: ['User']
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

userSchema.methods.checkPassword = function(pwd) {
    return bcrypt.compare(pwd, this.pwd)
        .catch(e => false);
}

// If this model already exist, retrieve it, else create it.
const model = retrieveOrCreate(modelName, userSchema);

export {
    model,
    modelName,
    schema
};
