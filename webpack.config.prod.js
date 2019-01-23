const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.config.common');
const path = require('path');

module.exports = merge(common, {
    mode: 'production',
    devtool: 'sourcemap',
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": 'production'
            }
        })
    ]
});