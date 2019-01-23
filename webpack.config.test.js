const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.config.common');
const Dotenv = require('dotenv-webpack');
const path = require('path');

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
            "process.env": {
                "NODE_ENV": 'testing'
            }
        })
    ]
});

module.exports = config;