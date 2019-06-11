import express from 'express';
import setupMiddleware from './globalMiddleware';
//import connect from './db';
import setupErrorHandlers from './errorHandlers';
//import * as Modules from './modules';
import path from 'path';

const app = express();

// Setup Middleware
setupMiddleware(app);




console.log('Running');

setupErrorHandlers(app);

export default app;