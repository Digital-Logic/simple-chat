import { Router } from 'express';
import { signIn, signUp, authToken } from './services';
import { model as userModel } from '../users/model';
import { defineAbilitiesFor } from './abilities';

function config(app) {
    const router = new Router();
    app.use('/', router);

    app.use(async function _getUserFromBearerToken (req, res, next){
        const authHeader = req.get('authorization');
        if (authHeader) {
            try {
                const tokenData = await authToken.verify(
                    authHeader.split('Bearer ')[1]
                );

                const user = await userModel.findById(tokenData.id);

                if (user) {
                    req.user = user;
                }

            } catch(e) {
                return next(e);
            }
        }
        return next();
    }, async function _createUserAbilities(req, res, next) {
        req.ability = defineAbilitiesFor(req.user);
        next();
    });

    router.route('/sign-in')
        .post(signIn);

    router.route('/sign-up')
        .post(signUp);
}

export default config;