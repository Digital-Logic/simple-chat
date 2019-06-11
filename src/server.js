import express from 'express';
import setupMiddleware from './globalMiddleware';
//import connect from './db';
import setupErrorHandlers from './errorHandlers';
//import * as Modules from './modules';
import path from 'path';

const app = express();

// Setup database connection
//connect();

// Setup Middleware
setupMiddleware(app);

// Setup modules
// for(let [name, config] of Object.entries(Modules)) {
//     console.log(`Configuring: ${name}`);
//     config(app);
// }

// app.use(express.static('./public'));

// app.get('*', (req, res) => {

//     res.sendFile(path.resolve('./public/index.html'));
// });
console.log('Running');

setupErrorHandlers(app);

export default app;