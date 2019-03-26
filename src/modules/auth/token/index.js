import TokenGenerator from './TokenGenerator';
import config from '@config';

const accessToken = new TokenGenerator(config.jwt.access.secret, config.jwt.access.exp);
const refreshToken = new TokenGenerator(config.jwt.refresh.secret, config.jwt.refresh.exp, user => ({ roles: user.roles }));

export { TokenGenerator, EmailTokenGenerator } from './TokenGenerator';
export { model as TokenModel } from './TokenModel';
export { accessToken, refreshToken };
