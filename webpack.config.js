const { resolve, join } = require('path');

const build = (entry, minimize, name, library) => ({
    entry: join(__dirname, entry),
    mode: minimize ? "production" : "development",
    devtool: minimize ? undefined : "inline-source-map",
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
        usedExports: true
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        modules: ['node_modules']
    },
    output: {
        library,
        libraryTarget: "umd",
        globalObject: "this",
        filename: name,
        path: resolve(__dirname, './dist'),
    }
});

const main = (entry, name, library) => [
    build(entry, false, `${name}.js`, library),
    build(entry, true, `${name}.min.js`, library)
];

module.exports = [
    ...main('./src/client-entry/index.ts', 'provider-client'),
    ...main('./src/provider/index.ts', 'storage-provider', 'storageProvider')
];
