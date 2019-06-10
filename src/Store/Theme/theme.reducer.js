
const THEME_TYPE = Object.freeze({
    LIGHT: 'LIGHT_THEME',
    DARK: 'DARK_THEME'
});

const initialState = {
    style: THEME_TYPE.DARK
}

function reducer(state=initialState, { type }) {
    switch(type) {
        case THEME_TYPE.LIGHT:
            return {
                ...state,
                theme: THEME_TYPE.LIGHT
            };
        case THEME_TYPE.DARK:
            return {
                ...state,
                theme: THEME_TYPE.DARK
            };
        default:
            return state;
    }
}

export {
    THEME_TYPE,
    reducer
};
