var path = require('path');
var webpack = require('webpack');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var TransferWebpackPlugin = require('transfer-webpack-plugin');

var buildPath = path.resolve(__dirname, 'build');
var config = {
    devtool: 'inline-source-map',

    entry: 'mocha!./test/index.js',

    devServer: {
        contentBase: 'test',  //Relative directory for base of server
        devtool: 'inline-source-map',
        hot: true,        //Live-reload
        inline: true,
        port: 1337
    },

    output: {
        filename: 'test.build.js',
        path: buildPath
    },
    node: {
        fs: 'empty'
    },

    externals: {
        './config': 'cassioPosConfig',
        './cptable': 'var cptable',
        './jszip': 'jszip',
        'cheerio': 'window',
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true

    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify('development')
            }
        })
    ],

    
    resolve: {
        extensions: ['', '.js', '.jsx'],
    },

    module: {
        loaders: [
            { test: require.resolve("jquery"),
                loader: "expose?$!expose?jQuery"
            },

            {
                //React-hot loader and
                test: /\.(js|jsx)$/,  //All .js and .jsx files
                loaders: ['babel'], //react-hot is like browser sync and babel loads jsx and es6-7
                exclude: [nodeModulesPath]
            },
            // LESS
            {
                test: /\.less$/,
                loader: 'style!css!less'
            },
            // CSS
            {
                test: /\.css$/, // Only .css files
                loader: 'style!css' // Run both loaders
            },

            // Files
            {
                test: /\.(jpe?g|gif|png|svg|woff2|woff|ttf|eot)$/,
                loader: 'file'
            }
        ]
    }
};

module.exports = config;