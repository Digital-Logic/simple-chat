import express from 'express';
import setupMiddleware from './globalMiddleware';
import connect from './db';

const app = express();

// Setup database connection
connect();

// Setup Middleware
setupMiddleware(app);

app.all('*', (req, res) => {
    res.json({ message: "Hello World!"});
});

export default app;