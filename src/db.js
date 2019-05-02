import mongoose from 'mongoose';
import logger from './Logger';
import config from './config';
import { accessibleFieldsPlugin, accessibleRecordsPlugin } from '@casl/mongoose';

mongoose.plugin(accessibleRecordsPlugin);
mongoose.plugin(accessibleFieldsPlugin);

function connect() {

    return mongoose.connect(`mongodb://${config.db.HOST}:27017/${config.db.NAME}?authSource=${config.db.NAME}`, {
        useNewUrlParser: true,
        useCreateIndex: true,
        autoIndex: true, //config.server.env === 'production' ? false : true,
        user: config.db.USER,
        pass: config.db.PWD
    })
    // Handle DB initialization errors here
    .catch(e => {
        logger.error("Unable to connect to database: ", e);
    });
}

function disconnect() {
    return mongoose.disconnect();
}

export default connect;

export {
    connect,
    disconnect
};