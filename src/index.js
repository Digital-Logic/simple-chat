import http from 'http';
import app from './server';
import config from './config';

const server = http.createServer(app);
let curApp = app;

server.listen(config.server.PORT, () => {
    console.log(`Server listening on: ${config.server.PORT}`);
});

if(module.hot) {
    module.hot.accept('./server', () => {
        server.removeListener('request', curApp);
        server.on('request', app);
        curApp = app;

        // disconnect()
        //     .then(connect())
        //     .then(() => {

            // })
            // .catch(e => {
            // .catch(e => {
            //     console.log(e);
            // });
    });
}
