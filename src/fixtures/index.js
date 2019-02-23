import mongoose from 'mongoose';
import { connect } from '@src/db';

function cleanDB() {
    // return connect()
    //     .then(() => Promise.all(
    //             mongoose.modelNames()
    //                 .map(name => mongoose.model(name).deleteMany())
    //         ))
    return Promise.reject();
}

export {
    cleanDB
};