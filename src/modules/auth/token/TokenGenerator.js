import jwt from 'jsonwebtoken';
//import config from '@config';

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
                    id: user._id
                }, this.secret, {
                    expiresIn: this.expires
                }, async function _sign(err, token) {
                    if (err)
                        reject(err);

                    const tokenData = jwt.decode(token);

                    resolve({
                        token,
                        expires: new Date(tokenData.exp * 1000)
                    });
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

    static TYPE = Object.freeze({
        VERIFY_EMAIL: "VERIFY_EMAIL",
        RESET_PASSWORD: 'RESET_PASSWORD'
    });

    // Provide instance access to the TYPE static property
    TYPE = EmailTokenGenerator.TYPE;

    constructor(secret, expires, genData) {
        super(secret, expires, genData);
    }

    sign(user, { type, data }) {
        // Check if type is valid
        if (!EmailTokenGenerator.TYPE[type])
            throw new TypeError("EmailTokenGenerator: sign(user,type): invalid type provided.");

        return super.sign(user, { type, ...data });
    }
}

export default TokenGenerator;

export {
    TokenGenerator,
    EmailTokenGenerator
};