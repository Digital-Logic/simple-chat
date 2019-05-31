import config from '@config';
import axios from 'axios';
import Logger from '@src/Logger';
import { AUTH_TYPES } from '../users/model';

// const auth = {
//     "facebook_api_key": config.OAUTH2.facebook.clientID,
//     "facebook_api_secret": config.OAUTH2.facebook.secret,
//     "host": "localhost",
//     "scope": ['email']
// };

function createCallbackURL() {
    return `https://www.facebook.com/v3.3/dialog/oauth?` +
        `client_id=${config.OAUTH2.facebook.clientID}` +
        `&redirect_uri=${config.server.domainAddress}/auth/facebook`
}

function getFacebookAccount(code) {
    return axios.get('https://graph.facebook.com/v3.3/oauth/access_token', {
            params: {
                client_id: config.OAUTH2.facebook.clientID,
                redirect_uri: `${config.server.domainAddress}/auth/facebook`,
                client_secret: config.OAUTH2.facebook.secret,
                code
            },
            responseType: 'json'
        })
        .then(response => {
            // Store token on a session cookie, if you need to access it later on
            const token = response.data;
            /* token structure
            * {     access_token
            *       token_type
            *       expires_in  }
            */

            return axios.get('https://graph.facebook.com/me', {
                    params: {
                        fields: 'id,first_name,last_name,email',
                        access_token: token.access_token
                    },
                    responseType: 'json'
                })
                .then(({ data: { email, first_name, last_name, id} }) => {

                    return {
                        email,
                        firstName: first_name,
                        lastName: last_name,
                        authType: AUTH_TYPES.FACEBOOK,
                        email_verified: true
                    };
                });
        })
        .catch(e => {
            Logger.error('Facebook oauth error: ', e.response.data);
            throw e;
        });
}



export {
    createCallbackURL,
    getFacebookAccount
};

