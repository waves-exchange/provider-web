import * as path from 'path';
import { defineConfig, mergeConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import commonConfig from './vite.config';

export default mergeConfig(
    commonConfig,
    defineConfig({
        base: '/signer-cloud/',
        root: path.resolve(__dirname, 'src', 'iframe-entry'),
        build: {
            outDir: path.resolve(__dirname, 'iframe-entry', 'dist'),
            emptyOutDir: true,
        },
        plugins: [legacy()]
    })
);
