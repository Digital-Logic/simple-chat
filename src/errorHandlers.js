import logger from './Logger';

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

        logger.log({
            level: 'error',
            message: err.message
        });
        res.status(err.statusCode)
            .send({
                error: err.expose ? err.message : "Invalid Request."
            });
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

        // Log the error
        logger.log({
            level: 'error',
            message: `Path ${req.path} ${JSON.stringify(errorMessage)}`
        });

        // Sent message to client
        res.status(400)
            .send({
                //error: err.errors.subject.message
                error: errorMessage
            });
    } else {
        next(err);
    }
}

/**
 * Generic error handler
 */

 function genericErrorHandler(err, req, res, next) {
     logger.log({
         level: 'error',
         message: err.message
     });

     res.status(500)
        .send({ error: "Internal server error, Sorry for the inconvenience."});
 }

function setupErrorHandlers (app) {
    app.use(bodyParserHandler);
    app.use(modelValidation);

    // the genericErrorHandler must be the last errorHandler called
    app.use(genericErrorHandler);
}


export default setupErrorHandlers;