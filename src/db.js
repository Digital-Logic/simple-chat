import mongoose from 'mongoose';
import logger from './Logger';
import { db } from './config';
import { accessibleRecordsPlugin } from '@casl/mongoose';

function connect() {

    // mongoose acl plugin
    mongoose.plugin(accessibleRecordsPlugin);

    return _connect();

    function _connect() {
        return mongoose.connect(`mongodb://${db.HOST}:27017/${db.NAME}?authSource=${db.NAME}`, {
            useNewUrlParser: true,
            user: db.USER,
            pass: db.PWD
        })
        // Handle DB initialization errors here
        .catch(e => {
            logger.error("Unable to connect to database: ", e.message);

            // Auto retry?
            if (db.RETRY_ON_FAILURE) {
                setTimeout(() => {
                    return _connect();
                }, 2000);
            }

            // re-throw only in development and if retry is not set to true
            if (server.env === 'development' && db.RETRY_ON_FAILURE)
                throw new Error(e);

        });
    }
}

export default connect;