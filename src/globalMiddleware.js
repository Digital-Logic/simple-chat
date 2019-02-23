import bodyParse from 'body-parser';
import { setupLoggers } from './Logger';

function useMiddleware (app) {
    app.use(bodyParse.urlencoded({
        extended: true
    }));
    app.use(bodyParse.json());

    setupLoggers(app);
}

export default useMiddleware;