const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.config.common');
const Dotenv = require('dotenv-webpack');

const config = merge.strategy({
    output: "replace"
})(common, {
    target: 'node',
    mode: 'development',
    output: {
        devtoolModuleFilenameTemplate: '[absolute-resource-path]',
        devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
    },
    devtool: "#inline-cheap-module-source-map",
    plugins: [
        new webpack.NamedModulesPlugin(),
        new Dotenv({
            path: '.env.testing',
            defaults: true
        }),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify('testing'),
            "process.env.DB_CONNECT_RETRY": JSON.stringify(false),
            "process.env.PORT": JSON.stringify(4040)
        })
    ]
});

module.exports = config;