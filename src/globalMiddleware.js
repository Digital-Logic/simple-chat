import bodyParse from 'body-parser';
import helmet from 'helmet';
import { setupLoggers } from './Logger';

function useMiddleware (app) {
    app.use(helmet());

    app.use(bodyParse.urlencoded({
        extended: true
    }));
    app.use(bodyParse.json());

    setupLoggers(app);
}

export default useMiddleware;