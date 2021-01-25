import { fetchDataKey } from '@waves/node-api-js/es/api-node/addresses';
import { TAssetDetails } from '@waves/node-api-js/es/api-node/assets';
import { DataTransactionEntryString, Long } from '@waves/ts-types';
import { curry } from 'ramda';
import { DetailsWithLogo } from '../../interface';

const BETTER_TOKENS_MAP = {
    W: '3P6t5mKGwVDkyjFhtUqw4NnecyC3DRpLfkw',
    T: '3N5net4nzSeeqxPfGZrvVvnGavsinipQHbE',
};

const GATEWAYS_MAP = {
    W: {
        DG2xFkPdDwKUoBkzGAhQtLpSGzfXLiCYPEzeKH2Ad24p:
            'https://waves.exchange/img/assets/usdn.svg',
        '34N9YcEETLWn93qYQ64EsP1x89tSruJU44RrEMSXXEPJ':
            'https://waves.exchange/img/assets/usdt.svg',
        '8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS':
            'https://waves.exchange/img/assets/bitcoin.svg',
        zMFqXuoyrn5w17PFurTqxB7GsS71fp9dfk6XFwxbPCy:
            'https://waves.exchange/img/assets/bitcoin-cash.svg',
        '62LyMjcr2DtiyF5yVXFhoQ2q414VPPJXjsNYp72SuDCH':
            'https://waves.exchange/img/assets/bitcoin-cash-sv.svg',
        '474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu':
            'https://waves.exchange/img/assets/ethereum.svg',
        Gtb1WRznfchDnTh37ezoDTJ4wcoKaRsKqKjJjy7nm2zU:
            'https://waves.exchange/img/assets/euro.svg',
        Ft8X1v1LTa1ABafufpaCWyVj8KkaxUWE6xBhW6sNFJck:
            'https://waves.exchange/img/assets/usd.svg',
        '2mX5DzVKWrAJw8iwdJnV2qtoeVG9h5nTDpTqC1wb1WEN':
            'https://waves.exchange/img/assets/try.svg',
        HZk1mbfuJpmxU1Fs4AX5MWLVYtctsNcg6e2C6VKqK8zk:
            'https://waves.exchange/img/assets/ltc.svg',
        BrjUWjndUanm5VsJkbUip8VRYy6LWJePtxya3FNv4TQa:
            'https://waves.exchange/img/assets/zec.svg',
        '5WvPKSJXzVE2orvbkJ8wsQmmQKqTv9sGBPksV4adViw3':
            'https://waves.exchange/img/assets/xmr.svg',
        B3uGHFRpSUuGEDWjqB9LWWxafQj8VTvpMucEyoxzws5H:
            'https://waves.exchange/img/assets/dash.svg',
        F81SdfzBZr5ce8JArRWLPJEDg1V8yT257ohbcHk75yCp:
            'https://waves.exchange/img/assets/bnt.svg',
        '5dJj4Hn9t2Ve3tRpNGirUHy4yBK6qdJRAJYV21yPPuGz':
            'https://waves.exchange/img/assets/ergo.svg',
        '4LHHvYGNKJUg5hj65aGD5vgScvCBmLpdRFtjokvCjSL8':
            'https://waves.exchange/img/assets/west.svg',
        DHgwrRvVyqJsepd32YbBqUeDH4GJ1N984X8QoekjgH8J:
            'https://waves.exchangeundefined',
        AxAmJaro7BJ4KasYiZhw7HkjwgYtt2nekPuF2CN9LMym:
            'https://waves.exchange/img/assets/wnet.svg',
        '725Yv9oceWsB4GsYwyy4A52kEwyVrL5avubkeChSnL46':
            'https://waves.exchange/img/assets/efyt.svg',
    },
    T: {
        '3KFXBGGLCjA5Z2DuW4Dq9fDDrHjJJP1ZEkaoajSzuKsC':
            'https://waves.exchange/img/assets/usdn.svg',
        '5Sh9KghfkZyhjwuodovDhB6PghDUGBHiAPZ4MkrPgKtX':
            'https://waves.exchange/img/assets/usdt.svg',
        DWgwcZTMhSvnyYCoWLRUXXSH1RSkzThXLJhww9gwkqdn:
            'https://waves.exchange/img/assets/bitcoin.svg',
        '8HT8tXwrXAYqwm8XrZ2hywWWTUAXxobHB5DakVC1y6jn':
            'https://waves.exchange/img/assets/bitcoin-cash.svg',
        '6KSUNALdYEd1EVTE4dTcSHzNw1dA3Q6ieokSRVuEcALV':
            'https://waves.exchange/img/assets/bitcoin-cash-sv.svg',
        BrmjyAWT5jjr3Wpsiyivyvg5vDuzoX2s93WgiexXetB3:
            'https://waves.exchange/img/assets/ethereum.svg',
        AsuWyM9MUUsMmWkK7jS48L3ky6gA1pxx7QtEYPbfLjAJ:
            'https://waves.exchange/img/assets/euro.svg',
        D6N2rAqWN6ZCWnCeNFWLGqqjS6nJLeK4m19XiuhdDenr:
            'https://waves.exchange/img/assets/usd.svg',
        '7itsmgdmomeTXvZzaaxqF3346h4FhciRoWceEw9asNV3':
            'https://waves.exchange/img/assets/try.svg',
        BNdAstuFogzSyN2rY3beJbnBYwYcu7RzTHFjW88g8roK:
            'https://waves.exchange/img/assets/ltc.svg',
        CFg2KQfkUgUVM2jFCMC5Xh8T8zrebvPc4HjHPfAugU1S:
            'https://waves.exchange/img/assets/zec.svg',
        '8oPbSCKFHkXBy1hCGSg9pJkSARE7zhTQTLpc8KZwdtr7':
            'https://waves.exchange/img/assets/xmr.svg',
        DGgBtwVoXKAKKvV2ayUpSoPzTJxt7jo9KiXMJRzTH2ET:
            'https://waves.exchange/img/assets/dash.svg',
        B6pP4SJY1aCXfVneF9P2hmBeQBPhNTVTGPDPZ57VGYQp:
            'https://waves.exchange/img/assets/bnt.svg',
        AvxDjVat8ErppBRxM56KewbQq3RMv8QibBNssqn6P7Fd:
            'https://waves.exchange/img/assets/ergo.svg',
        AMFteLfPzPhTsFc3NfvHG7fSRUnsp3tJXPH88G1PCisT:
            'https://waves.exchange/img/assets/west.svg',
        EmcmfM27TPaemhuREZGD8WLvsuLCdqx8WovMrDQKbXS1:
            'https://waves.exchangeundefined',
        '3P8gkhcLhFQvBkDzMnWeqqwvq3qxkpTNQPs4LUQ95tKD':
            'https://waves.exchange/img/assets/wnet.svg',
        FvKx3cerSVYGfXKFvUgp7koNuTAcLs8DmtmwRrFVCqJv:
            'https://waves.exchange/img/assets/efyt.svg',
    },
};

const getBetterTokensAddress = (networkByte: number): string | null => {
    const chainId = String.fromCharCode(networkByte);

    if (BETTER_TOKENS_MAP[chainId] !== null) {
        return BETTER_TOKENS_MAP[chainId];
    } else {
        return null;
    }
};

export const loadLogoInfo = curry(
    (
        base: string,
        networkByte: number,
        data: Array<TAssetDetails<Long>>
    ): Promise<Array<DetailsWithLogo>> =>
        Promise.all(
            data.map((asset) => {
                const address = getBetterTokensAddress(networkByte);
                const MAP =
                    GATEWAYS_MAP[String.fromCharCode(networkByte)] || {};
                const logo = MAP[asset.assetId];

                if (logo != null) {
                    return Promise.resolve({ ...asset, logo });
                }

                return address != null
                    ? fetchDataKey(base, address, `logo_<${asset.assetId}>`)
                          .then((entry) => ({
                              ...asset,
                              logo: (entry as DataTransactionEntryString).value,
                          }))
                          .catch(() => asset)
                    : asset;
            })
        )
);
