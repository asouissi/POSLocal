var webpack = require('webpack');
var path = require('path');
var buildPath = path.resolve(__dirname, 'build');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var TransferWebpackPlugin = require('transfer-webpack-plugin');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
var WebpackMd5Hash = require('webpack-md5-hash');
var ManifestPlugin = require('webpack-manifest-plugin');
var config = {
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
            "lodash",
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
    resolve: {
        //When require, do not have to add these extensions to file's name
        extensions: ["", ".js", ".jsx"],
    },
    //Render source-map file for final build

    //output config
    output: {
        path: buildPath,    //Path of output file
        filename: '[name]-[chunkhash].js' //Name of output file
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
        //Minify the bundle
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                //supresses warnings, usually from module minification
                warnings: false
            }
        }),
        //Allows error warnings but does not stop compiling. Will remove when eslint is added
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            minChunks: Infinity,
        }),

        // new InlineManifestWebpackPlugin({
        //     name: 'webpackManifest'
        // }),
        new WebpackMd5Hash(),
        // new ManifestPlugin(),
        // new ChunkManifestPlugin({
        //     filename: "chunk-manifest.json",
        //     manifestVariable: "webpackManifest"
        // }),
        new HtmlWebpackPlugin({template: 'src/www/index.ejs'}),
        //Transfer Files
        new TransferWebpackPlugin([
            {from: 'www'}
        ], path.resolve(__dirname, "src"))
    ],
    module: {
        loaders: [
            {
                test: require.resolve("jquery"),
                loader: "expose?$!expose?jQuery"
            },
            {
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
