import logger from './Logger';
import { Unauthorized, Forbidden, BadRequest, Conflict } from 'http-errors';
import { ForbiddenError } from '@casl/ability';
import config from './config';

/**
 * Handles body parser errors
 *
 */

function bodyParserHandler (err, req, res, next) {
    if (err.type === 'entity.parse.failed' ||
    err.type === 'encoding.unsupported' ||
    err.type === 'request.aborted' ||
    err.type === 'entity.too.large' ||
    err.type === 'request.size.invalid' ||
    err.type === 'stream.encoding.set' ||
    err.type === 'parameters.too.many' ||
    err.type === 'charset.unsupported' )
    {
        next(new BadRequest(err.message));
    } else {
        next(err);
    }
}

/**
 * Handles model validation errors
 *
 */
function modelValidation (err, req, res, next) {

    if (err.name === 'ValidationError') {

        const errorMessage = Object.entries(err.errors).reduce( (acc, [key, value]) => {
            acc[key] = value.message;
            return acc;
        },{});

        next(new BadRequest(JSON.stringify(errorMessage)));
    } else {
        next(err);
    }
}

/**
 * Token validation errors errors
 */
function TokenValidationErrors (err, req, res, next) {
    if (err.name) {
        switch (err.name) {
            case 'TokenExpiredError':
                next(new Unauthorized(err.message))
            break;

            case 'JsonWebTokenError':
                next(new Unauthorized(err.message))
            break;

            case 'NotBeforeError':
                next(new Unauthorized(err.message))
            break;

            default:
                next(err);
        }
    } else {
        next(err);
    }
}

function aclErrors(err, req, res, next) {
    if (err instanceof ForbiddenError) {
        next(new Forbidden(err.message));
    } else {
        next(err);
    }
}

/**
 * Generic error handler
 */
 function genericErrorHandler(err, req, res, next) {

    const serverErrorMessage = "Internal server error.";

    if (err.status) {
        switch(err.status) {
            case Conflict.statusCode:
            case BadRequest.statusCode:
            case Unauthorized.statusCode:
            case Forbidden.statusCode:
                logger.log({level: 'info', message: err.message})
            break;

            default:
                logger.log({level: 'error', message: err.message });
        }

        // Send a formated response
        res.status(err.status)
            .json(config.server.env !== 'production' || err.expose ? err.message : serverErrorMessage );

    } else {
        logger.log({
            level: 'error',
            message: err.message
        });

        res.status(500)
            .json(serverErrorMessage);
    }
 }

function setupErrorHandlers (app) {
    app.use(bodyParserHandler);
    app.use(modelValidation);
    app.use(TokenValidationErrors);
    app.use(aclErrors);

    // the genericErrorHandler must be the last errorHandler called
    app.use(genericErrorHandler);
}


export default setupErrorHandlers;