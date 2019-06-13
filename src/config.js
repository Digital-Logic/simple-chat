/**
 * Validate and transform env injected variables.
 * export all envs as server config object.
 */

const db = Object.freeze({
    HOST: process.env.DB_HOST,
    NAME: process.env.DB_NAME,
    USER: process.env.DB_USER,
    PWD: process.env.DB_PWD,
});

const server = Object.freeze({
    PORT: Number(process.env.PORT),
    SSL: isTrue(process.env.SSL),
    env: process.env.NODE_ENV,
    domainName: process.env.DOMAIN_NAME || "User Auth App",
    domainAddress: isTrue(process.env.SSL) ? `https://${process.env.DOMAIN_ADDRESS}` : `http://${process.env.DOMAIN_ADDRESS}`
});

if (isNaN(server.PORT))
    throw new Error("ConfigError: PORT is not a valid number.");

if (server.env !== 'development' && server.env !== 'production' && server.env !== 'testing')
    throw new Error(`ConfigError: unknown NODE_ENV: ${server.env}`);


// const jwt = {
//     access: {
//         secret: process.env.JWT_ACCESS_SECRET,
//         exp: process.env.JWT_ACCESS_EXP
//     },
//     refresh: {
//         secret: process.env.JWT_REFRESH_SECRET,
//         exp: process.env.JWT_REFRESH_EXP
//     },
//     reset: {
//         secret: process.env.JWT_RESET_SECRET,
//         exp: process.env.JWT_RESET_EXP
//     },
//     claims: {
//         issuer: process.env.JWT_ISSUER
//     }
// };

// for (let [key, obj] of Object.entries(jwt)) {
//     if (obj.secret && obj.secret.length < 8) {
//         throw new Error(`JWT ${key} Secret is to short`);
//     }
// }

// const bcryptSalt = Number(process.env.BCRYPT_SALT);
// if(isNaN(bcryptSalt))
//     throw new Error("ConfigError: BCRYPT_SALT is not a valid number.");

// const OAUTH2 = {
//     google: {
//         clientID: process.env.GOOGLE_CLIENT_ID,
//         secret: process.env.GOOGLE_CLIENT_SECRET
//     },
//     facebook: {
//         clientID: process.env.FACEBOOK_CLIENT_ID,
//         secret: process.env.FACEBOOK_CLIENT_SECRET
//     }
// };

// const mailer = {
//     auth: {
//         host: process.env.AUTH_EMAIL_HOST,
//         port: Number(process.env.AUTH_EMAIL_PORT),
//         user: process.env.AUTH_EMAIL_USER,
//         pwd: process.env.AUTH_EMAIL_PWD,
//         requireTLS: process.env.AUTH_EMAIL_TLS,
//         fromAddress: process.env.AUTH_EMAIL_FROM_ADDRESS,
//     }
// };

// Object.entries(mailer)
//     .forEach(([mailerName, mailConfig]) => {
//         ['host','user','port','pwd','requireTLS','fromAddress']
//             .forEach( key => {
//                 if (key === 'port') {
//                     if (isNaN(mailConfig[key]))
//                         throw new Error(`mailer: ${mailerName}: '${key}' value is '${mailConfig[key]}'`);
//                 } else if (!mailConfig[key] || mailConfig[key] === '')
//                     throw new Error(`mailer: ${mailerName}: '${key}' value is '${mailConfig[key]}'`);
//             });
//     });


function isTrue(value) {
    if (typeof value === 'boolean')
        return value;
    else if (typeof value === 'string') {
        return value.trim().toLowerCase() === 'true' || value.trim().toLowerCase() === 'yes';
    }
    return false;
}


export default {

    db,
    server,
    // bcryptSalt,
    // mailer,
    // OAUTH2
};