import { google } from 'googleapis';
import config from '@config';
import { decode } from 'jsonwebtoken';


const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
];

const auth = new google.auth.OAuth2(
    config.OAUTH2.clientID,
    config.OAUTH2.secret,
    `http://localhost:3000`
);

// auth.on('tokens', tokens => {
//     if (tokens.refresh_token) {
//         console.log(tokens.refresh_token);
//     }
//     console.log(tokens.access_token);
// });

function getConnection() {
    return auth.generateAuthUrl({
        prompt: 'consent',
        scope: scopes
    });
}

function createUrl() {
    const url = getConnection(auth);
    return url;
}

async function getGoogleAccount(code) {
    const { tokens } = await auth.getToken(code);
    auth.setCredentials(tokens);
    return decode(tokens.id_token);
}

export {
    createUrl,
    getConnection,
    getGoogleAccount
};