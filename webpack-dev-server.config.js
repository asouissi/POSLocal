var path = require('path');
var webpack = require('webpack');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var TransferWebpackPlugin = require('transfer-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
var buildPath = path.resolve(__dirname, 'build');
var WebpackMd5Hash = require('webpack-md5-hash');
var ManifestPlugin = require('webpack-manifest-plugin');
var config = {
    devtool: 'inline-source-map',

    entry: {
        app: path.join(__dirname, '/src/app/app'),
        vendor: [
            "axios",
            "babel-polyfill",
            "jquery",
            "bootstrap",
            "chart.js",
            "classnames",
            "clipboard-js",
            "griddle-react",
            "history",
            "intl",
            //"lodash",
            "moment",
            "moment-range",
            "react",
            "react-autocomplete",
            "react-bootstrap",
            "react-breadcrumbs",
            "react-chartjs-2",
            "react-dnd",
            "react-dnd-html5-backend",
            "react-dom",
            "react-flip-move",
            "react-gcaptcha",
            "react-input-calendar",
            "react-intl",
            "react-overlays",
            "react-redux",
            "react-router",
            "react-router-redux",
            "react-select",
            "react-time",
            "redux",
            "redux-batched-actions",
            "redux-form",
            "reselect",
            "seamless-immutable",
        ]
    },
    devServer: {
        contentBase: 'src/www',  //Relative directory for base of server
        devtool: 'inline-source-map',
        hot: true,        //Live-reload
        inline: true,
        port: 3000,
        host: '0.0.0.0'
    },

    output: {
        path: buildPath,
        filename: '[name].js'
    },
    node: {
        fs: 'empty'
    },

    externals: {
        './config': 'cassioPosConfig',
        './cptable': 'var cptable',
        './jszip': 'jszip'
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify('development')
            }
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            minChunks: Infinity,
        }),

        // new InlineManifestWebpackPlugin({
        //     name: 'webpackManifest'
        // }),
        new WebpackMd5Hash(),
        //new ManifestPlugin(),
        // new ChunkManifestPlugin({
        //     filename: "chunk-manifest.json"
        // }),
        new HtmlWebpackPlugin({template: 'src/www/index.ejs'}),
        new TransferWebpackPlugin([
            {from: 'www'}
        ], path.resolve(__dirname, "src")),

    ],


    module: {
        loaders: [
            {
                test: require.resolve("jquery"),
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