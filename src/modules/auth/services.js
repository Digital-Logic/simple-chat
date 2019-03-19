import { model } from '../users/model';
import { Unauthorized } from 'http-errors';
import config from '@config';
import jwt from 'jsonwebtoken';

const authToken = tokenGenerator(config.jwt.auth.secret, config.jwt.auth.exp);
const resetToken = tokenGenerator(config.jwt.reset.secret, config.jwt.reset.exp);
const refreshToken = tokenGenerator(config.jwt.refresh.secret, config.jwt.refresh.exp);

async function signIn(req, res, next) {
    const user = await model.findOne({ email: req.body.email });

    if (user && user.checkPassword(req.body.pwd)) {
        const token = await authToken.create(user);
        res.status(201).send(token);
    } else {
        next(new Unauthorized('Invalid username or password.'));
    }
}

function signUp(req, res, next) {
    model.create(req.body)
        .then(authToken.create)
        .then(token => res.send(token))
        .catch(next);
}


function tokenGenerator(secret, expires) {
    return {
        create(user) {
            return new Promise((resolve, reject) => {
                jwt.sign({
                        id: user.id
                    }, secret, {
                        expiresIn: expires
                    }, function _sign(err, token) {
                        if (err)
                            reject(err);
                        resolve(token);
                    });
            });
        },
        verify(token) {
            return new Promise((resolve, reject) => {
                jwt.verify(token, secret, function _jwtVerify(err, decoded) {
                    if (err)
                        reject(err);
                    resolve(decoded);
                });
            });
        }
    };
}

export {
    signIn,
    signUp,
    authToken,
    resetToken,
    refreshToken
};