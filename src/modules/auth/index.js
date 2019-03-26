import { Router } from 'express';
import { signIn, signUp, signOut, verifyEmailAddress, changePassword,
        sendResetPasswordEmail, resetPassword, getAccessToken } from './services';
import { accessToken } from './token';
import { model as User } from '../users/model';
import { defineAbilitiesFor } from './abilities';

function config(app) {
    const router = new Router();

    // Get authHeader, verify token, and generate acl for user.
    app.use(async function _getUserFromBearerToken (req, res, next){

        const authHeader = req.get('authorization');

        if (authHeader) {
            try {
                // Get Bearer token and validate it.
                const tokenData = await accessToken
                    .verify( authHeader.split('Bearer ')[1] );

                const user = await User.findById(tokenData.id);

                // Attach user to the req object.
                if (user) {
                    req.user = user;
                }
            } catch(e) {
                return next(e);
            }
        }

        return next();
    },
    // Setup access control
    async function _createUserAbilities(req, res, next) {
        req.ability = defineAbilitiesFor(req.user);
        next();
    });

    router.route('/sign-in')
        .post(signIn);

    router.route('/sign-up')
        .post(signUp);

    router.route('/send-reset-password')
        .post(sendResetPasswordEmail);

    router.route('/reset-password')
        .post(resetPassword);

    router.route('/change-password')
        .post(changePassword);

    router.route('/verify-email-address')
        .post(verifyEmailAddress);

    router.route('/sign-out')
        .post(signOut);

    router.route('/access-token')
        .post(getAccessToken);

    app.use('/user', router);
}

export default config;

export { ROLES } from './abilities';