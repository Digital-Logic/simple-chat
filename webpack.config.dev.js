const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.config.common');
const StartServerPlugin = require('start-server-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const path = require('path');

module.exports = merge.strategy({
    output: "replace"
})(common, {
    entry: ['webpack/hot/poll?1000'],
    output: {
        path: path.resolve(__dirname, './.hmr'),
        filename: 'server.js',
        publicPath: '/'
    },
    mode: "development",
    devtool: 'sourcemap',
    watch: true,
    plugins: [
        new StartServerPlugin('server.js'),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new Dotenv({
            defaults: true
        }),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: 'development'
            }
        })
    ]
});