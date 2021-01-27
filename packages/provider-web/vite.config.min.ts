import { defineConfig, mergeConfig } from 'vite';
import commonConfig from '../../vite.config';
import pkg from './package.json';

export default mergeConfig(
    commonConfig,
    defineConfig({
        build: {
            lib: {
                entry: './src/index.ts',
                name: 'providerWeb',
            },
            rollupOptions: {
                output: [
                    {
                        entryFileNames: pkg.main.replace('dist/', '').replace('.cjs', '.min'),
                        format: 'umd',
                    },
                ],
            },
            minify: true,
            emptyOutDir: false,
        },
    })
);
