import { ACTIONS } from './theme.reducer';


function switchTheme() {
    return {
        type: ACTIONS.SWITCH_THEME
    };
}

export {
    switchTheme
};