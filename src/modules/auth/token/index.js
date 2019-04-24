import TokenGenerator from './TokenGenerator';
import defineAbilitiesFor from '../abilities';
import config from '@config';

const accessToken = new TokenGenerator(config.jwt.access.secret, config.jwt.access.exp, user => ({ role: user.role }));
const refreshToken = new TokenGenerator(config.jwt.refresh.secret, config.jwt.refresh.exp);

export { TokenGenerator, EmailTokenGenerator } from './TokenGenerator';
export { model as TokenModel } from './TokenModel';
export { accessToken, refreshToken };
