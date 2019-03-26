import jwt from 'jsonwebtoken';
import config from '@config';

class TokenGenerator {
    constructor(secret, expires, genData=() => ({})) {
        this.secret = secret;
        this.expires = expires;

        if (typeof genData !== 'function')
            throw new TypeError('TokenGenerator: genData must be a function.');
        this.genData = genData;
    }

    sign(user, data) {
        return new Promise((resolve, reject) => {
            jwt.sign({
                    ...data,
                    ...this.genData(user), // generate data based on user
                    id: user.id
                }, this.secret, {
                    subject: user.email,
                    issuer: config.server.domainAddress,
                    expiresIn: this.expires
                }, function _sign(err, token) {
                    if (err)
                        reject(err);
                    resolve(token);
                });
        });
    }

    verify(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.secret, function _jwtVerify(err, decoded) {
                if (err)
                    reject(err);
                resolve(decoded);
            });
        });
    }
}

class EmailTokenGenerator extends TokenGenerator {

    static ACTIONS = Object.freeze({
        VERIFY_EMAIL: "VERIFY_EMAIL",
        RESET_PASSWORD: 'RESET_PASSWORD'
    });

    ACTIONS = EmailTokenGenerator.ACTIONS;

    constructor(secret, expires, genData) {
        super(secret, expires, genData);
    }

    sign(user, { action, data }) {
        // Check if action is valid
        if (!EmailTokenGenerator.ACTIONS[action])
            throw new TypeError("EmailTokenGenerator: sign(user,action): invalid action provided.");

        return super.sign(user, { action, ...data });
    }
}

export default TokenGenerator;

export {
    TokenGenerator,
    EmailTokenGenerator
};