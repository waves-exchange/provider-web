import { Signer } from '@waves/signer';
import ProviderWeb from '../src/provider';

const IFRAME_URL = location.href.includes('provider=exchange')
    ? 'https://waves.exchange/signer'
    : `${location.origin}/iframe-entry`;

const NODE_URL = location.href.includes('mainnet')
    ? 'https://nodes.waves.exchange'
    : 'https://nodes-testnet.wavesnodes.com';

const provider = new ProviderWeb(IFRAME_URL, true);
const waves = new Signer({ NODE_URL, LOG_LEVEL: 'verbose' });

waves.setProvider(provider as any).catch(console.error);

Object.assign(window, {
    waves,
    provider,
});
