const webpack = require('webpack');
const { resolve, join } = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const getGeneralConfig = (minimize) => ({
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: resolve('tsconfig.build.json')
                    }
                },
                exclude: /node_modules/,
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader', // creates style nodes from JS strings
                    },
                    {
                        loader: 'css-loader', // translates CSS into CommonJS
                    },
                    {
                        loader: 'less-loader', // compiles Less to CSS
                    },
                ]
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        modules: ['node_modules']
    },
    mode: minimize ? "production" : "development",
    devtool: minimize ? undefined : "inline-source-map",
})

const buildIframeEntry = (minimize) => ({
    ...getGeneralConfig(minimize),
    entry: join(__dirname, 'src/iframe-entry/index.ts'),
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: join(__dirname, 'src', 'index.html'),
            filename: join(__dirname, 'iframe-entry', 'index.html')
        }),
        new webpack.NodeEnvironmentPlugin(['NODE_ENV'])
    ],
    optimization: {
        minimize,
        usedExports: true,
        moduleIds: 'hashed',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                }
            }
        }
    },
    output: {
        libraryTarget: "umd",
        globalObject: "this",
        filename: minimize ? '[name].[contenthash].min.js' : '[name].[contenthash].js',
        path: resolve(__dirname, 'iframe-entry/dist'),
    }
});

const buildLibrary = (minimize) => ({
    ...getGeneralConfig(minimize),
    entry: join(__dirname, 'src/provider/index.ts'),
    optimization: {
        minimize,
        usedExports: true,
    },
    output: {
        library: 'providerWeb',
        libraryTarget: "umd",
        globalObject: "this",
        filename: minimize ? 'provider-web.min.js' : 'provider-web.js',
        path: resolve(__dirname, 'dist'),
    }
});

module.exports = [
    buildIframeEntry(true),
    buildLibrary(true),
    buildLibrary(false)
];
