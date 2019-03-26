import mongoose from 'mongoose';
import logger from './Logger';
import config from './config';
import { accessibleFieldsPlugin, accessibleRecordsPlugin } from '@casl/mongoose';

mongoose.plugin(accessibleRecordsPlugin);
mongoose.plugin(accessibleFieldsPlugin);

function connect() {

    return _connect();

    function _connect() {
        return mongoose.connect(`mongodb://${config.db.HOST}:27017/${config.db.NAME}?authSource=${config.db.NAME}`, {
            useNewUrlParser: true,
            useCreateIndex: true,
            autoIndex: config.server.env === 'production' ? false : true,
            user: config.db.USER,
            pass: config.db.PWD
        })
        // Handle DB initialization errors here
        .catch(e => {
            logger.error("Unable to connect to database: ", e.message);

            // Auto retry?
            if (config.db.RETRY_ON_FAILURE) {
                setTimeout(() => {
                    return _connect();
                }, 2000);
            }

            // re-throw only in development and if retry is not set to true
            if (config.server.env === 'development' && config.db.RETRY_ON_FAILURE)
                throw new Error(e);
        });
    }
}

function disconnect() {
    return mongoose.disconnect();
}

export default connect;

export {
    connect,
    disconnect
};