import React from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { connect } from 'react-redux';
import { THEME_TYPE } from './Store/Theme';

const common = {
    typography: {
        useNextVariants: true,
        h1: {
            fontWeight: 500,
            fontSize: '5rem'
        },
        h2: {
            fontWeight: 500,
            fontSize: '4rem'
        },
        h3: {
            fontWeight: 500,
            fontSize: '3.5rem'
        }
    },
};

const themes = {
    [THEME_TYPE.DARK]: createMuiTheme({
        ...common,
        palette: {
            type: 'dark',
            primary: {
                main: "rgb(36, 126, 176)"
            },
            error: {
                main: "#ff5d5d",
                dark: "#ff6459"
            }
        }
    }),
    [THEME_TYPE.LIGHT]: createMuiTheme({
        ...common,
        palette: {
            type: 'light',
            primary: {
                main: '#4f68f2'
            }
        }
    })
};


function applyTheme(WrappedComponent) {
    function ApplyTheme({ style, ...props }) {

        return (
            <MuiThemeProvider theme={themes[style]}>
                <CssBaseline />
                <WrappedComponent {...props} />
            </MuiThemeProvider>
        );
    }

    function mapDispatch(dispatch) {
        return {

        };
    }
    function mapState(state) {
        return {
            style: state.theme.style
        };
    }

    return connect(mapState, mapDispatch)(ApplyTheme);
}

export default applyTheme;
