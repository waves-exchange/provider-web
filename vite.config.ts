import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

export default defineConfig({
    plugins: [reactRefresh()],
    server: {
        port: 3000
    },
    optimizeDeps: {
        include: [
            '@waves/node-api-js/es/api-node/addresses',
            '@waves/node-api-js/es/api-node/alias',
            '@waves/node-api-js/es/api-node/assets',
            '@waves/node-api-js/es/api-node/transactions',
            '@waves/node-api-js/es/api-node/utils',
            '@waves/node-api-js/es/tools/adresses/availableSponsoredBalances',
            '@waves/node-api-js/es/tools/adresses/getAssetIdListByTx',
            '@waves/node-api-js/es/constants',
        ],
        exclude: [
            'node-fetch'
        ]
    },
    build: {
        commonjsOptions: {
            ignore: ['node-fetch']
        }
    }
});
