
const ACTIONS = Object.freeze({
    SWITCH_THEME: 'SWITCH_THEME',
});

const THEME_TYPE = Object.freeze({
    LIGHT: 'LIGHT_THEME',
    DARK: 'DARK_THEME'
});

const initialState = {
    style: THEME_TYPE.DARK
}

function reducer(state=initialState, { type }) {
    switch(type) {
        case ACTIONS.SWITCH_THEME:
            return {
                ...state,
                style: state.style === THEME_TYPE.DARK ?
                    THEME_TYPE.LIGHT : THEME_TYPE.DARK
            };
        default:
            return state;
    }
}

export {
    THEME_TYPE,
    reducer,
    ACTIONS
};
