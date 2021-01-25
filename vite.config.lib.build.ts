import * as path from 'path';
import { defineConfig, mergeConfig } from 'vite';
import commonConfig from './vite.config';
import pkg from './package.json';

export default mergeConfig(
    commonConfig,
    defineConfig({
        root: path.resolve(__dirname, 'src', 'provider'),
        build: {
            outDir: path.resolve(__dirname, 'dist'),
            lib: {
                entry: path.resolve(__dirname, 'src', 'provider', 'index.ts'),
                name: 'providerWeb',
            },
            rollupOptions: {
                output: [
                    {
                        entryFileNames: pkg.main.replace('dist/', ''),
                        format: 'cjs',
                    },
                    {
                        entryFileNames: pkg.module.replace('dist/', ''),
                        format: 'es',
                    },
                    {
                        entryFileNames: pkg.browser.replace('dist/', ''),
                        format: 'umd',
                    },
                ],
            },
            emptyOutDir: true,
            minify: false,
        },
    })
);
