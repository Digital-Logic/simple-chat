import bodyParse from 'body-parser';
import helmet from 'helmet';
import { setupLoggers } from './Logger';
import cookieParse from 'cookie-parser';

function useMiddleware (app) {
    app.use(helmet());

    app.use(bodyParse.urlencoded({
        extended: true
    }));

    app.use(bodyParse.json());

    app.use(cookieParse());

    setupLoggers(app);
}

export default useMiddleware;