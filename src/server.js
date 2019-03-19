import express from 'express';
import setupMiddleware from './globalMiddleware';
import connect from './db';
import setupErrorHandlers from './errorHandlers';
import * as Modules from './modules';

const app = express();

// Setup database connection
connect();

// Setup Middleware
setupMiddleware(app);

// Setup modules
for(let [name, config] of Object.entries(Modules)) {
    console.log(`Configuring: ${name}`);
    config(app);
}

app.all('*', (req, res) => {
    res.json({ message: "Hello World!"});
});

setupErrorHandlers(app);

export default app;