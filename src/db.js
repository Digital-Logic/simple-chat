import mongoose from 'mongoose';
import logger from './Logger';

function connect() {

    return _connect();

    function _connect() {
        return mongoose.connect(`mongodb://${process.env.DB_HOST}:27017/${process.env.DB_NAME}?authSource=${process.env.DB_NAME}`, {
            useNewUrlParser: true,
            promiseLibrary: global.Promise,
            user: process.env.DB_USER,
            pass: process.env.DB_PWD
        })
        // Handle DB initialization errors here
        .catch(e => {
            logger.error("Unable to connect to database: ", e.message);

            const retry = (process.env.DB_CONNECT_RETRY || '').toLowerCase();
            const env = (process.env.NODE_ENV || '').toLowerCase();

            // Auto retry?
            if (retry === 'true' || retry === 'yes') {
                setTimeout(() => {
                    return _connect();
                }, 2000);
            }

            // re-throw only in development and if retry is not set to true
            if (env === 'development' && ( retry !== 'true' || retry !== 'yes'))
                throw new Error(e);

        });
    }
}

export default connect;