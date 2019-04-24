import bodyParse from 'body-parser';
import helmet from 'helmet';
import { setupLoggers } from './Logger';
import cookiesMiddleware from 'universal-cookie-express';

function useMiddleware (app) {
    app.use(helmet());

    app.use(bodyParse.urlencoded({
        extended: true
    }));

    app.use(bodyParse.json());

    app.use(cookiesMiddleware());

    setupLoggers(app);
}

export default useMiddleware;