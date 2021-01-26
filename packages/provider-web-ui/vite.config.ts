import { defineConfig, mergeConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import commonConfig from '../../vite.config';

export default mergeConfig(
    commonConfig,
    defineConfig({
        base: './',
        plugins: [legacy()]
    })
);
