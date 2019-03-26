import nodemailer from 'nodemailer';
import config from './config';

function createTransport({ host, port, user, pass, from, requireTLS }) {
    return nodemailer.createTransport({
        host,
        port,
        auth: {
            user,
            pass
        },
        requireTLS
    },{
        from
    });
}
/**
 * Construct mailers from configuration => ./config.js
 */
const mailers = Object.entries(config.mailer)
    .reduce( (_mailers, [mailerKey, mailerConfig]) => {
        _mailers[mailerKey] = createTransport({
                host: mailerConfig.host,
                port: mailerConfig.port,
                user: mailerConfig.user,
                pass: mailerConfig.pwd,
                requireTLS: mailerConfig.requireTLS,
                from : mailerConfig.fromAddress
        });
        return _mailers;
    },{});

export default mailers;

export {
    mailers,
    createTransport
};