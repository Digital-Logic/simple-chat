import { Router } from 'express';
import { signIn, signUp, signOut,validateToken, getAuth, sendResetPasswordEmail,
        changePassword, sendEmailValidationCode, resetUserPassword } from './services';

import { accessToken, refreshToken } from './token';
import { model as User } from '../users/model';
import { defineAbilitiesFor } from './abilities';


function config(app) {

    const router = new Router();

    // Get authHeader, verify token, and generate acl for user.
    app.use(async function _getUserFromBearerToken (req, res, next) {

        // Validate tokens if they are present
        try {
            // if the access token is valid, take the user id and rules from it
            // to generate a acl list. Access rules are stored in the accessToken
            // Access tokens will have a short life span to mitigate token theft.
            const token = req.universalCookies.get('accessToken');

            // Verify token
            const { id, role} = await accessToken.verify(token);

            req.user = {
                id,
                _id: id,
                role
            };
            return next();

        } catch (e) {
            // access token is invalid
            try {
                // Check if the refresh token is valid
                const tokenName = 'refreshToken';

                const token = req.universalCookies.get(tokenName);
                const { id } = await refreshToken.verify(token);
                const user = await User.findById(id);

                // User account is active and user can access system
                if (user && user.accountVerified && !user.disabled) {

                    // Create a access token, and set a cookie to hold it
                    const { token, expires } = await accessToken.sign(user);
                    res.cookie('accessToken', token, {
                        httpOnly: true,
                        expires
                    });
                    // attach user to the request object
                    req.user = user;
                }

            } catch (e) {
                // refresh token is invalid
                // clear tokens from cookies
                req.universalCookies.remove('refreshToken');
                req.universalCookies.remove('accessToken');
                return next();
            }
        }
        return next();
    },
        // Setup user abilities to enforce access control
        function _createUserAbilities(req, res, next) {
        req.ability = defineAbilitiesFor(req.user);
        return next();
    });

    router.route('/sign-in')
        .get(getAuth)
        .post(signIn);


    router.route('/sign-up')
        .post(signUp);

    router.route('/validate-email')
        .post(sendEmailValidationCode);

    router.route('/validate-token')
        .post(validateToken);

    router.route('/reset-password-request')
        .post(sendResetPasswordEmail);

    router.route('/reset-password')
        .post(resetUserPassword);

    router.route('/sign-out')
        .get(signOut);

    router.route('/change-password')
        .post(changePassword);

    app.use('/api/auth', router);
}

export default config;

export { ROLES } from './abilities';