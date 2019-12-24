const { resolve, join } = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const build = (entry, minimize, name, library, out) => ({
    entry: join(__dirname, entry),
    mode: minimize ? "production" : "development",
    devtool: minimize ? undefined : "inline-source-map",
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: join(__dirname, 'src', 'index.html'),
            filename: join(__dirname, 'iframe-entry', 'index.html')
        }),
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
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
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        modules: ['node_modules']
    },
    output: {
        library,
        libraryTarget: "umd",
        globalObject: "this",
        filename: minimize ? `[name].[contenthash].min.js` : `[name].[contenthash].js`,
        path: out ? out : resolve(__dirname, 'dist'),
    }
});

const main = (entry, name, library, out) => [
    build(entry, true, name, library, out)
];

module.exports = [
    ...main('./src/client-entry/index.ts', 'provider-client', undefined, join(__dirname, 'iframe-entry', 'dist')),
    // ...main('./src/provider/index.ts', 'storage-provider', 'storageProvider')
];
