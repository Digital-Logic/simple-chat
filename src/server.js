import express from 'express';
import setupMiddleware from './globalMiddleware';
import setupErrorHandlers from './errorHandlers';

const app = express();

// Setup Middleware
setupMiddleware(app);

console.log('Running');

setupErrorHandlers(app);

export default app;