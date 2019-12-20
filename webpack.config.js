const { resolve, join } = require('path');

const build = (entry, minimize, name, library, out) => ({
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
        path: out ? out : resolve(__dirname, 'dist'),
    }
});

const main = (entry, name, library, out) => [
    build(entry, false, `${name}.js`, library, out),
    build(entry, true, `${name}.min.js`, library, out)
];

module.exports = [
    ...main('./src/client-entry/index.ts', 'provider-client', undefined, join(__dirname, 'iframe-entry', 'dist')),
    ...main('./src/provider/index.ts', 'storage-provider', 'storageProvider')
];
