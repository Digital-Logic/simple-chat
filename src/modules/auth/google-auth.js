import { google } from 'googleapis';
import config from '@config';
import { decode } from 'jsonwebtoken';
import { AUTH_TYPES } from '../users/model';


const scope = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
];

const auth = new google.auth.OAuth2(
    config.OAUTH2.google.clientID,
    config.OAUTH2.google.secret,
    `${config.server.domainAddress}/auth/google`
);

function getConnection() {
    return auth.generateAuthUrl({
        prompt: 'consent',
        scope
    });
}

async function getGoogleAccount(code) {
    const { tokens } = await auth.getToken(code);
    auth.setCredentials(tokens);
    const {
        email,
        email_verified,
        name,
        given_name,
        family_name,
        locale,
    } = decode(tokens.id_token);

    // Transform data shape
    return {
        email,
        firstName: given_name,
        lastName: family_name,
        email_verified,
        authType: AUTH_TYPES.GOOGLE
    };
}

export {
    getConnection,
    getGoogleAccount
};