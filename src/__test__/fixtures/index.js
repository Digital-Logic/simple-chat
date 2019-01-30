import connect from '@src/db';
import mongoose from 'mongoose';


function cleanDB() {
    return connect()
        .then(() =>
            Promise.all(
                mongoose.modelNames()
                    .map(modelName =>
                        mongoose.model(modelName)
                            .deleteMany().exec()
                    )
                )
        )
        .catch(console.log);
}



export {
    cleanDB
};