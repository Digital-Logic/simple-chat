import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

function connect() {
    return mongoose.connect(process.env.DB_URL + process.env.DB_NAME, {
        useNewUrlParser: true
    })
    // Handle initialization errors here
    .catch(console.log);
}

export default connect;