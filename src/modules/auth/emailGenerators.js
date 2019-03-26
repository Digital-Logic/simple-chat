import { mailers } from '@src/mailer';
import verifyEmailTemplate from '@views/auth/verify_email.pug';
import resetPasswordTemplate from '@views/auth/reset_password.pug';
import { EmailTokenGenerator } from './token';
import config from '@config';
import Logger from '@src/Logger';

const emailToken = new EmailTokenGenerator(config.jwt.reset.secret, config.jwt.reset.exp);

const verifyAccountEmail = generateEmailTemplate( (user, token) => ({
    to: user.email,
    subject: 'Please verify your email address.',
    html: verifyEmailTemplate({
        name: user.firstName ? user.firstName : '',
        domain: config.server.domainAddress,
        link: genTokenLink(token)
    })
}), EmailTokenGenerator.ACTIONS.VERIFY_EMAIL );


const resetPasswordEmail = generateEmailTemplate( (user, token) => ({
    to: user.email,
    subject: 'Reset your password',
    html: resetPasswordTemplate({
        name: user.firstName ? user.firstName : user.email,
        domain: config.server.domainAddress,
        link: genTokenLink(token)
    })
}), EmailTokenGenerator.ACTIONS.RESET_PASSWORD);


/**
 * @description Used to create a function that will generate an email template
 * @returns {Function}
 * @param {Function} generatorEmail
 * @param {String} action
 */
function generateEmailTemplate(generateEmail, action) {
    if (typeof generateEmail !== 'function') throw new TypeError("genAuthEmail: genTemplates: is not a function.");

    /**
     * This function can throw, make sure to catch it in the route handler.
     */
    return async function _Email(user, data) {
        const token = await emailToken.sign(user, { ...data, action });
        // send email
        const result = await mailers.auth.sendMail(generateEmail(user, token));

        Logger.info(result);
    }
}

function genTokenLink(token) {
    return `${config.server.domainAddress}/?token=${encodeURIComponent(token)}`;
}

export {
    verifyAccountEmail,
    resetPasswordEmail,
    generateEmailTemplate,
    emailToken
}