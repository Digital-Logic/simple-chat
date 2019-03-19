import { AbilityBuilder, Ability } from '@casl/ability';



function defineAbilitiesFor(user) {
    const { rules, can } = AbilityBuilder.extract();

    // Anonymous_abilities


    // Role based abilities
    if (user) {

    }

    return new Ability(rules);
}