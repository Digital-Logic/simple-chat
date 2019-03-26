import { model } from '../users/model';
import Logger from '@src/Logger';
import { Unauthorized, Forbidden, BadRequest } from 'http-errors';
import { TokenModel, accessToken, refreshToken, EmailTokenGenerator } from './token';
import { verifyAccountEmail, resetPasswordEmail, emailToken } from './emailGenerators';

async function signIn(req, res, next) {
    const user = await model.findOne({ email: req.body.email }).select('+pwd');

    if (user && await user.checkPassword(req.body.pwd)) {
        if (user.accountVerified) {
            try {
                const aToken = await accessToken.sign(user);
                const rToken = await refreshToken.sign(user);

                Logger.info(`User signed in: ${user.email}`);

                res.status(200).send({
                    tokenType: "bearer",
                    accessToken: aToken,
                    refreshToken: rToken
                });

            } catch (e) {
                // Unable to generate token, or an unknown error occurred.
                next(e);
            }
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
                    }, {});

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

async function verifyEmailAddress(req, res, next) {
    try {
        const tokenData = await emailToken.verify(req.body.token);
        // Is this token being used correctly?
        if (tokenData.action !== emailToken.ACTIONS.VERIFY_EMAIL)
            throw new BadRequest();

        const user = await model.findById(tokenData.id);
        if (user.accountVerified)
            throw new BadRequest('Your account has already been verified, please log in.');

        user.accountVerified = true;
        await user.save({
                validateBeforeSave: true
            });

        // generate tokens for the user
        const aToken = await accessToken.sign(user);
        const rToken = await refreshToken.sign(user);

        res.status(200).json({
            tokenType: "bearer",
            accessToken: aToken,
            refreshToken: rToken
        });

    } catch (e) {
        next(e);
    }
}

const sendResetPasswordEmail = sendResetPasswordGenerator(resetPasswordEmail);
function sendResetPasswordGenerator(action) {
    return async (req, res, next) => {
        try {
            const user = await model.findOne({ email: req.body.email }).lean().exec();

            if (user)
                await action(user);

            res.status(200)
                .json({
                    message: "Password reset email sent."
                });

        } catch (e) {
            next(e);
        }
    }
}

async function resetPassword(req, res, next) {
    try {
        const tokenData = await emailToken.verify(req.body.token);
        if (tokenData.action !== EmailTokenGenerator.ACTIONS.RESET_PASSWORD)
            throw new BadRequest();

        const user = await model.findById(tokenData.id);

        user.pwd = req.body.pwd;

        await user.save({
            validateBeforeSave: true
        });

        res.status(200).json({ message: 'Password has been update.'});
    } catch(e) {
        next(e);
    }
}


async function changePassword(req, res, next) {
    try {
        if (!req.user)
            throw new Unauthorized();

        req.ability.throwUnlessCan('update', req.user);

        req.user.pwd = req.body.pwd;

        await req.user.save({
                validateBeforeSave: true
            });
    } catch (e) {
        next(e);
    }
}

async function getAccessToken(req,res,next) {
    try {
        // verify the token is valid.
        const tokenData = await refreshToken.verify(req.body.refreshToken);

        // Is token blacklisted?
        const isBlackListed = await TokenModel.findOne({ token: String(refreshToken) });
        if (isBlackListed)
            throw new Forbidden();

        // Can user login?
        const user = await model.findById(tokenData.id);


        if (!user || !user.accountVerified && user.disabled)
            throw new Forbidden();

        const token = await accessToken.sign(user);

        res.status(200)
            .json({
                accessToken: token
            });
    } catch (e) {
        next(e);
    }
}

async function signOut(req, res, next) {
    const token = req.body.refreshToken;
    try {
        const tokenData = await refreshToken.verify(token);
        const foundToken = await TokenModel.findOne({ token });
        if (!foundToken)
        {
            await TokenModel.create({
                token,
                exp: Date(tokenData.exp)
            });
        }

        res.status(204).send();

    } catch (e) {
        next(e);
    }
}


export {
    signIn,
    signUp,
    signOut,
    changePassword,
    verifyEmailAddress,
    signUpRouteGenerator,
    getAccessToken,
    resetPassword,
    sendResetPasswordEmail,
    sendResetPasswordGenerator
};
