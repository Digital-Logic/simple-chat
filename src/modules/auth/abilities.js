import { AbilityBuilder } from '@casl/ability';
import { model as User } from '../users/model';

const ROLES = Object.freeze({
    USER: 'USER',
    MODERATOR: 'MODERATOR',
    ADMIN: 'ADMIN'
});


function defineAbilitiesFor(user) {
    return AbilityBuilder.define((can, cannot) => {
        // Anonymous and all accounts
        can('create', User, ['email', 'firstName', 'lastName', 'pwd']);
        can('read', User, ['email']);

        // Role based abilities
        if (user) {
            // Global user abilities
            can('read', User, ['email', 'firstName', 'lastName', 'roles']);
            can('read', User, ['email', 'firstName', 'lastName', 'roles', 'createdAt', 'updatedAt', 'disabled', 'accountVerified'], { _id: user.id});
            can('update', User, ['email', 'firstName', 'lastName'], { _id: user.id });

            switch(user.roles) {

                case ROLES.USER:
                break;
                case ROLES.MODERATOR:
                    // can update, delete own account info
                    // can update others account info
                    can(['update'], User);
                    cannot(['update'], User, { role: ROLES.ADMIN });

                break;
                case ROLES.ADMIN:
                    can('manage', User);
                break;
            }
        }
    });
}
export default defineAbilitiesFor;

export {
    ROLES,
    defineAbilitiesFor
};