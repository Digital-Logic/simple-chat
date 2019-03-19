import { AbilityBuilder, Ability } from '@casl/ability';
import { modelName as UserModelName } from '../users/model';

const ROLES = Object.freeze({
    USER: 'User',
    MODERATOR: 'Moderator',
    ADMIN: 'Admin'
})


function defineAbilitiesFor(user) {
    const { rules, can } = AbilityBuilder.extract();
    // Anonymous_abilities


    // Role based abilities
    if (user) {
        switch(user.roles) {
            case ROLES.USER:
                can('read', UserModelName);

            break;
            case ROLES.MODERATOR:

            break;
            case ROLES.ADMIN:
                can('manage', UserModelName);
            break;
        }
    }

    return new Ability(rules);
}

export {
    ROLES,
    defineAbilitiesFor
};