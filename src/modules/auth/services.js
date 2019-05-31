import { model, AUTH_TYPES } from '../users/model';
import Logger from '@src/Logger';
import { Unauthorized, Forbidden, BadRequest } from 'http-errors';
import { accessToken, refreshToken } from './token';
import { verifyAccountEmail, resetPasswordEmail, emailToken } from './emailGenerators';
import { defineAbilitiesFor } from './abilities';
import jwt from 'jsonwebtoken';
import config from '@config';
import { getConnection, getGoogleAccount } from './google-auth';
import { createCallbackURL, getFacebookAccount } from './facebook-auth';

async function getAuth(req, res, next) {
    return res.status(200).json({
        id: req.user && req.user.id,
        rules: req.ability && req.ability.rules || defineAbilitiesFor(req.user)
    });
}

function getOAuthURL(req, res, next) {

    res.status(200).json({
        googleUrl: getConnection(),
        facebookUrl: createCallbackURL()
    });
}

async function processOAuth(req, res, next) {
    const code = req.body.code;
    const path = req.body.path;

    try {
        let userAccount;

        if (/google/i.test(path)) {
            // google api call
            userAccount = await getGoogleAccount(code);

        } else if (/facebook/i.test(path)) {
            // facebook api call
            userAccount = await getFacebookAccount(code);
        }
        // Add other OAuth providers

        // does the account exist?
        let user = await model.findOne({ email: userAccount.email });

        if (user) {
            // The user account has not been verified
            if (!user.accountVerified) {
                user.accountVerified = userAccount.email_verified;
                await user.save();
            }

            if (user.authTypes.indexOf(userAccount.authType) === -1) {
                user.authTypes.push(userAccount.authType);
                await user.save();
            }
            // Compare differences in account information here

        } else {
            // create User account
            user = await model.create({
                email: userAccount.email,
                firstName: userAccount.firstName,
                lastName: userAccount.lastName,
                accountVerified: userAccount.email_verified,
                authTypes: [userAccount.authType]
            });
        }

        if (user.accountVerified && !user.disabled)
        {
            // Attach the user to the req object.
            req.user = user;
            req.ability = defineAbilitiesFor(user); // generate user abilities
            // Create tokens and send them to the end-user
            return sendTokens(req, res, next);

        } else {
            if (user.disabled) {
                Logger.info('User trying to login with disabled account: ', user.email);
                next(new Forbidden('User account has been disabled.'));
            } else {
                next(new Forbidden('User account must be verified before logging in.'));
            }
        }

    } catch (e) {
        Logger.error('OAuth Error: ', e.response.data);
        next(e.response.data.error);
    }
}

async function sendTokens(req, res, next) {
    try {
        const user = req.user;
        const access = await accessToken.sign(user);
        const refresh = await refreshToken.sign(user);

        // Create cookies
        res.cookie('accessToken', access.token , {
            httpOnly: true,
            expires: access.expires,
            secure: config.server.SSL
        });

        res.cookie('refreshToken', refresh.token, {
            httpOnly: true,
            expires: refresh.expires,
            secure: config.server.SSL
        });

        Logger.info(`User signed in: ${user.email}`);

        res.status(200).json({
            id: user.id,
            rules: defineAbilitiesFor(user).rules
        });

    } catch (e) {
        // Unable to generate token, or an unknown error occurred.
        Logger.error('OAuth token generation error: ', e); // Move into logger
        next(e);
    }
}

async function signIn(req, res, next) {

    const user = await model.findOne({ email: req.body.email }).select('+pwd');

    if (user && await user.checkPassword(req.body.pwd)) {
        if (user.accountVerified) {
            req.user = user;
            req.ability = defineAbilitiesFor(user);

            sendTokens(req, res, next);
        } else {
            next(new Forbidden("User account must be verified before login."));
        }
    } else {
        next(new Unauthorized('Invalid username or password.'));
    }
}


const signUp = signUpRouteGenerator(verifyAccountEmail);
/**
 *
 * @param { Function } action Define the action that will occur after a user signs-up
 * @returns { Function }
 */
function signUpRouteGenerator(action) {
    return async (req, res, next) => {
        try {
            const filteredInput =
                model.accessibleFieldsBy(req.ability, 'create')
                    .reduce( (filtered, key) => {
                        filtered[key] = req.body[key] || undefined;
                        return filtered;
                    }, {
                        authTypes: [AUTH_TYPES.PWD]
                    });

            const user = await model.create(filteredInput);

            if (!user)
                throw new BadRequest();

            await action(user);

            res.status(201).json({
                message: `User created: ${user.email}`
            });

            return Promise.resolve();

        } catch(e) {
            next(e);
        }
    };
}

const sendEmailValidationCode = sendEmailValidationCodeGenerator(verifyAccountEmail);
function sendEmailValidationCodeGenerator(action) {
    return async (req, res, next) => {
        try {
            let user;
            if ( req.body.email )
                user = await model.findOne({ email: req.body.email });
            else if (req.body.id)
                user = await model.findById(req.body.id);


            if (user && !user.accountVerified) {
                // generate token
                await action(user);
            }
            // Send a response regardless of result
            res.status(204).send();
        } catch (e) {
            next(e)
        };
    };
}



async function validateToken(req, res, next) {
    try {
        const { id, type } = await emailToken.verify(req.body.token);

        if (type === emailToken.TYPE.VERIFY_EMAIL) {

            const user = await model.findById(id);
            if (user && !user.accountVerified && !user.disabled) {
                user.accountVerified = true;

                await user.save({
                    validateBeforeSave: true
                });
                // Notify the user that there account is now active.
                return res.status(200).send("Account Activated");
            }
            /**
             * TODO: The account cannot be activated, user account has been deleted, already verified or disabled.
             */
            return res.status(204).send();

        } else if (type === emailToken.TYPE.RESET_PASSWORD) {
            // Inform the front-end that the token is valid
            res.status(200).json({ id, type});
        }
    } catch (e) {
        return next(e);
    }
}

const sendResetPasswordEmail = sendResetPasswordGenerator(resetPasswordEmail);
function sendResetPasswordGenerator(action) {
    return async (req, res, next) => {
        try {
            let user;
            if (req.body.email)
                user = await model.findOne({ email: req.body.email }).lean().exec();
            else if (req.body.id)
                user = await model.findById(req.body.id).lean().exec();

            if (user && user.accountVerified && !user.disabled)
            {
                await action(user);

                res.status(200)
                    .json({
                        message: "Password reset email sent."
                    });
            } else {
                if (!user)
                    throw new BadRequest("Invalid user account.");
                else if (!user.accountVerified)
                    throw new BadRequest("User account has not been activated");
                else throw new BadRequest("User account disabled.");
            }

        } catch (e) {
            next(e);
        }
    }
}

async function resetUserPassword(req, res, next) {
    try {
        const pwd = req.body.pwd;
        const { id, type} = await emailToken.verify(req.body.token);

        if (type !== emailToken.TYPE.RESET_PASSWORD)
            throw new BadRequest();

        const user = await model.findById(id).select('+pwd');
        user.pwd = pwd;

        await user.save({
            validateBeforeSave: true,
            authTypes: user.authTypes.indexOf(AUTH_TYPES.PWD) === -1 ? user.authTypes.push(AUTH_TYPES.PWD) : user.authTypes
        });

        // Send auth tokens to user if you want to...

        res.status(200).send();

    } catch(e) {
        next(e);
    }
}

async function changePassword(req, res, next) {
    try {

        if (!req.user)
            throw new Unauthorized();

        const user = await model.findById(req.user._id).select('+pwd');

        if (user.id !== req.user._id)
            return next(new Unauthorized());

        if (await user.checkPassword(req.body.password))
        {
            // update password
            user.pwd = req.body.newPassword;

            await user.save({
                validateBeforeSave: true
            });

            return res.status(200).send();
        }

        return next(new Unauthorized());

    } catch (e) {
        next(e);
    }
}

function signOut(req, res, next) {

    try {
        const tokens = ['refreshToken', 'accessToken'].map( cookie => [cookie, req.cookies[cookie]]);

        tokens.forEach( ([name, token]) => {
            const { id, exp } = jwt.decode(token);
            res.clearCookie(name, {
                httpOnly: true,
                expires: new Date(exp * 1000),
                secure: config.server.SSL
            });
        });

        res.status(204).send();
    } catch (e) {
        Logger.error('SignOut error: ', e);
        next(e);
    }
}


export {
    signIn,
    signUp,
    signOut,
    getAuth,
    changePassword,
    sendEmailValidationCode,
    signUpRouteGenerator,
    sendResetPasswordEmail,
    sendResetPasswordGenerator,
    validateToken,
    resetUserPassword,
    getOAuthURL,
    processOAuth
};