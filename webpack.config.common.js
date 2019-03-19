const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: ['./src/index'],
    target: 'node',
    node: {
        __filename: true,
        __dirname: true
    },
    output: {
        path: path.resolve(__dirname, "./build"),
        filename: 'server.js',
        publicPath: '/'
    },
    externals: [nodeExternals({ whitelist: ['webpack/hot/poll?1000']})],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [
                    { loader: 'babel-loader' }
                ],
                exclude: /node_modules/
            },{
                test: /\.pug$/,
                use: [
                    { loader: 'pug-loader' }
                ]
            }
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            "process.env.BUILD_TARGET": JSON.stringify('server')
        })
    ],
    resolve: {
        alias: {
            '@src': path.resolve(__dirname, 'src'),
            '@views': path.resolve(__dirname, 'src/views'),
            '@config': path.resolve(__dirname, 'src/config.js'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@fixtures': path.resolve(__dirname, 'src/__test__/fixtures')
        }
    }
}