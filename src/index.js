import http from 'http';
import app from './server';

const server = http.createServer(app);
let curApp = app;

server.listen(process.env.PORT, () => {
    console.log(`Server listening on: ${process.env.PORT}`);
});

if(module.hot) {
    module.hot.accept('./server', () => {
        server.removeListener('request', curApp);
        server.on('request', app);
        curApp = app;
    });
}
