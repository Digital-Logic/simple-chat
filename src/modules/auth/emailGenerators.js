import { mailers } from '@src/mailer';
import verifyEmailTemplate from '@views/auth/verify_email.pug';
import resetPasswordTemplate from '@views/auth/reset_password.pug';
import { EmailTokenGenerator } from './token';
import config from '@config';
import Logger from '@src/Logger';

const emailToken = new EmailTokenGenerator(config.jwt.reset.secret,
        config.jwt.reset.exp, user => ({ id: user.id }));

/**
 * @returns {function} verifyAccountEmail(user, data)
 * @description Generates a validation token, and send the token and an email to the end user
 */
const verifyAccountEmail = generateEmailTemplate( (user, token) => ({
    to: user.email,
    subject: 'Please verify your email address.',
    html: verifyEmailTemplate({
        name: user.firstName || '',
        domain: config.server.domainAddress,
        link: genTokenLink(token)
    })
}), EmailTokenGenerator.TYPE.VERIFY_EMAIL );
/**
 * See verifyAccountEmail
 */

const resetPasswordEmail = generateEmailTemplate( (user, token) => ({
    to: user.email,
    subject: 'Reset your password',
    html: resetPasswordTemplate({
        name: user.firstName ? user.firstName : user.email,
        domain: config.server.domainAddress,
        link: genTokenLink(token)
    })
}), EmailTokenGenerator.TYPE.RESET_PASSWORD);


/**
 * @description Used to create a function that will generate an email template
 * @returns {Function}
 * @param {Function} generatorEmail
 * @param {String} type - token type
 */
function generateEmailTemplate(generateEmail, type) {
    if (typeof generateEmail !== 'function') throw new TypeError("generateEmailTemplate: generateEmail: is not a function.");
    /**
     * This function can throw, make sure to catch it in the route handler.
     */
    return async function _Email(user, data) {

        const token = await emailToken.sign(user, { ...data, type });
        // send email
        const result = await mailers.auth.sendMail(generateEmail(user, token.token));

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