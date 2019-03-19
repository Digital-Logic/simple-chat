const db = Object.freeze({
    HOST: process.env.DB_HOST,
    NAME: process.env.DB_NAME,
    USER: process.env.DB_USER,
    PWD: process.env.DB_PWD,
    RETRY_ON_FAILURE: process.env.DB_CONNECT_RETRY.trim().toLowerCase() === 'true' ||
            process.env.DB_CONNECT_RETRY.trim().toLowerCase() === 'yes' ? true : false
})

const server = Object.freeze({
    PORT: Number(process.env.PORT),
    env: process.env.NODE_ENV
});

if (isNaN(server.PORT))
    throw new Error("ConfigError: PORT is not a valid number.");

if (server.env !== 'development' && server.env !== 'production' && server.env !== 'testing')
    throw new Error(`ConfigError: unknown NODE_ENV: ${server.env}`);

const jwtExp = process.env.JWT_EXP;
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret.length < 8)
    throw new Error("JWT Secret is too short.");

const bcryptSalt = Number(process.env.BCRYPT_SALT);
if(isNaN(bcryptSalt))
    throw new Error("ConfigError: BCRYPT_SALT is not a valid number.");


export {
    jwtExp,
    jwtSecret,
    bcryptSalt,
    db,
    server
};