import morgan from 'morgan';
import winston, { format } from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

const env = process.env.NODE_ENV;

const logger = winston.createLogger({
    format: format.combine( format.prettyPrint(), format.timestamp()),
    transports: [
        new winstonDaily({
            filename: 'error.log',
            dirname: 'logs',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: false,
            maxFiles: '14d',
            level: 'error',
            handleExceptions: true
        }),
        new winstonDaily({
            filename: 'access.log',
            dirname: 'logs',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: false,
            maxFiles: '14d',
            level: 'info',
            handleExceptions: true
        })
    ]
});

if (env === 'development')
    logger.add(new winston.transports.Console({
        format: format.combine( format.colorize(), format.simple())
    }));

logger.accessLogger = {
    write: function(message, encoding) {
        logger.info(message);
    }
};

logger.errorLogger = {
    write: function(message, encoding) {
        logger.error(message);
    }
};

function setupLoggers(app) {
    app.use(morgan('common', {
        skip: (res, req) => req.statusCode >= 400,
        stream: logger.accessLogger
    }));

    app.use(morgan('common', {
        skip: (res, req) => req.statusCode < 400,
        stream: logger.errorLogger
    }));
}

export default logger;

export {
    setupLoggers,
    logger
};