import http from 'http';
import app from './server';
import { server as serverConfig } from './config';

const server = http.createServer(app);
let curApp = app;

server.listen(serverConfig.PORT, () => {
    console.log(`Server listening on: ${serverConfig.PORT}`);
});

if(module.hot) {
    module.hot.accept('./server', () => {
        server.removeListener('request', curApp);
        server.on('request', app);
        curApp = app;
    });
}
