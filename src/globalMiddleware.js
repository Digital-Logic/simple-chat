import bodyParse from 'body-parser';

function useMiddleware (app) {
    app.use(bodyParse.urlencoded({
        extended: true
    }));
    app.use(bodyParse.json());
}

export default useMiddleware;