import { AbilityBuilder, Ability } from '@casl/ability';
import { model as User } from '../users/model';

const ROLES = Object.freeze({
    USER: 'USER',
    MODERATOR: 'MODERATOR',
    ADMIN: 'ADMIN'
});


function defineAbilitiesFor(user) {

    return AbilityBuilder.define((can, cannot) => {

        // Role based abilities
        if (user) {
            // Global user abilities
            can('delete', User, { _id: user.id });
            can('read', User, ['email', 'firstName', 'lastName', '_id']);
            can('read', User, ['email', 'firstName', 'lastName', 'role', 'createdAt', 'updatedAt', 'disabled', 'accountVerified', '_id'], { _id: user.id});
            can('update', User, ['email', 'firstName', 'lastName', 'password'], { _id: user.id });

            switch(user.role) {

                case ROLES.USER:
                break;
                case ROLES.MODERATOR:
                    // can disabled a Users account
                    can(['update'], User, ['disabled', 'accountVerified'], { role: ROLE.USER });

                break;
                case ROLES.ADMIN:
                    // Admin has full control of all user accounts.
                    can('manage', User);
                break;
            }
        } else {
            // Anonymous and all accounts
            can('create', User, ['email', 'firstName', 'lastName', 'pwd']);
            can('read', User, ['firstName', 'lastName', '_id']);
        }
    });
}
export default defineAbilitiesFor;

export {
    ROLES,
    defineAbilitiesFor
};