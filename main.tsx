import React, { useEffect, useMemo } from 'react';
import { render } from 'react-dom';
import { Signer } from '@waves/signer';
import { ProviderWeb } from './packages/provider-web/src';
import * as wt from '@waves/waves-transactions';

const url = location.href.includes('provider=exchange')
    ? 'https://waves.exchange/signer'
    : location.origin + '/packages/provider-web-ui/index.html';

const node = location.href.includes('mainnet')
    ? 'https://nodes.wavesplatform.com'
    : 'https://nodes-testnet.wavesnodes.com';


const testSignMessage = async (signer: Signer, setValue) => {
    const chain_code = location.href.includes('mainnet') ? "W" : "T";
    const client_id = "waves.exchange";
    const seconds = Math.round((Date.now() + 1000 * 60 * 60 * 24 * 7) / 1000);
    const message = `${chain_code}:${client_id}:${seconds}`;

    const { publicKey } = await signer.login();
    const signature = await signer.signMessage(message);
    const url = `https://api${chain_code === 'T' ? '-testnet' : ''}.waves.exchange/v1/oauth2/token`;
    const data = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        body: [
            "grant_type=password",
            "scope=general",
            `username=${encodeURIComponent(publicKey)}`,
            "password=" + encodeURIComponent(`${seconds}:${signature}`),
            `client_id=${client_id}`
        ].join('&')
    }).then(result => result.json());
    setValue(data.access_token);
};

function TestApp(): React.ReactElement {
    const provider = useMemo(() => new ProviderWeb(url, true), []);
    const signer = useMemo(() => new Signer({ NODE_URL: node }), []);

    const [ token, setToken ] = React.useState('');

    useEffect(() => {
        signer.setProvider(provider);
    }, [provider, signer]);

    return (
        <div>
            <div>
                <h1>Login</h1>
                <button
                    onClick={() => {
                        signer.login();
                    }}
                >
                    Login
                </button>
            </div>

            <div>
                <h2>Sign Set Asset Script</h2>
                <button
                    onClick={() => {
                        signer
                            .setAssetScript({
                                assetId:
                                    '9FKPH2PVQXpe8cuHHJkMKJMxdCmFZrPZftZTkPzhYXtj',
                                script: '12345678',
                            })
                            .broadcast();
                    }}
                >
                    Set asset script
                </button>
            </div>

            <div>
                <h2>Sign Burn</h2>
                <button
                    onClick={() => {
                        signer
                            .burn({
                                assetId:
                                    '9FKPH2PVQXpe8cuHHJkMKJMxdCmFZrPZftZTkPzhYXtj',
                                amount: 1,
                            })
                            .broadcast();
                    }}
                >
                    Burn
                </button>
            </div>

            <div>
                <h2>Sign Issue</h2>
                <button
                    onClick={() => {
                        signer
                            .issue({
                                name: 'Name of Token',
                                decimals: 2,
                                quantity: 1000,
                                reissuable: false,
                                description: 'Description of token',
                                script:
                                    'base64:AAIDAAAAAAAAAAQIARIAAAAAAAAAAAEAAAABaQEAAAADZm9vAAAAAAkBAAAACFdyaXRlU2V0AAAAAQUAAAADbmlsAAAAACvwfcA=',
                            })
                            .broadcast();
                    }}
                >
                    Sign issue
                </button>
            </div>

            <div>
                <h2>Sign massTransfer</h2>
                <button
                    onClick={() => {
                        signer
                            .massTransfer({
                                assetId:
                                    'BC2RVCn2NzoWM8s5MVr2Tns9EmcxL6guMgnDWy3Uj8nA',
                                transfers: [
                                    {
                                        amount: 10,
                                        recipient: 'merry',
                                    },
                                    {
                                        amount: 20,
                                        recipient:
                                            '3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj',
                                    },
                                ],
                                attachment: '72k1xXWG59fYdzSNoA',
                            })
                            .broadcast();
                    }}
                >
                    massTransfer
                </button>
            </div>

            <div>
                <h2>Transfer 0.1 Tether USD Waves to Merry</h2>
                <div>
                    <button
                        onClick={() => {
                            signer
                                .transfer({
                                    amount: 100000,
                                    assetId: '5Sh9KghfkZyhjwuodovDhB6PghDUGBHiAPZ4MkrPgKtX',
                                    recipient: 'merry',
                                    attachment: null,
                                })
                                .broadcast();
                        }}
                    >
                        Basic
                    </button>
                </div>

                <div>
                    <button
                        onClick={() => {
                            signer
                                .transfer({
                                    amount: 10000000,
                                    recipient: 'merry',
                                    feeAssetId:
                                        'WAVES',
                                    attachment: null,
                                })
                                .broadcast();
                        }}
                    >
                        With custom Fee feeAssetId
                    </button>
                </div>

                <div>
                    <button
                        onClick={() => {
                            signer
                                .transfer({
                                    amount: 10000000,
                                    recipient:
                                        '3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj',
                                    attachment: null,
                                    fee: 676767,
                                })
                                .broadcast();
                        }}
                    >
                        With custom Fee amount
                    </button>
                </div>

                <div>
                    <button
                        onClick={() => {
                            signer
                                .transfer({
                                    amount: 10000000,
                                    recipient:
                                        '3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj',
                                    attachment: '72k1xXWG59fYdzSNoA',
                                })
                                .broadcast();
                        }}
                    >
                        By address With attachment
                    </button>
                </div>
            </div>

            <div>
                <h2>Invoke</h2>
                <button
                    onClick={() => {
                        signer
                            .invoke({
                                dApp: 'alias:T:merry',
                                payment: [{ assetId: 'WAVES', amount: 1 }],
                                call: {
                                    function: 'test',
                                    args: [
                                        { type: 'string', value: 'string' },
                                        { type: 'integer', value: 123123123 },
                                        { type: 'boolean', value: true },
                                        {
                                            type: 'binary',
                                            value:
                                                'base64:AAIDAAAAAAAAAAQIARIAAAAAAAAAAAEAAAABaQEAAAADZm9vAAAAAAkBAAAACFdyaXRlU2V0AAAAAQUAAAADbmlsAAAAACvwfcA=',
                                        },
                                    ],
                                },
                                fee: 1000,
                            })
                            .broadcast();
                    }}
                >
                    Invoke
                </button>
            </div>

            <div>
                <h2>Data</h2>
                <button
                    onClick={() => {
                        signer
                            .data({
                                data: [
                                    {
                                        key: 'key1',
                                        value: 'world',
                                        type: 'string',
                                    },
                                    {
                                        key: 'key2',
                                        value: 'world',
                                        type: 'string',
                                    },
                                    {
                                        key: 'key3',
                                        value: 'world',
                                        type: 'string',
                                    },
                                    {
                                        key: 'AAAAAAAAAAAEAAAABaQEAAAADZm9v',
                                        value: 'world',
                                        type: 'string',
                                    },
                                    {
                                        key: 'key4',
                                        value: 123123123,
                                        type: 'integer',
                                    },
                                    {
                                        key: 'key5',
                                        value: true,
                                        type: 'boolean',
                                    },
                                ],
                            })
                            .broadcast();
                    }}
                >
                    Data
                </button>
            </div>

            <div>
                <h2>Sign Message</h2>
                <button
                    onClick={() => {
                        signer.signMessage(
                            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et lacinia augue. Nulla eu diam orci. Suspendisse dapibus porttitor tellus id mattis. Phasellus vitae condimentum justo. Maecenas et ultricies libero. Donec vitae lacus lectus. Cras sem felis, pretium sed lacinia ac, congue quis ipsum. Etiam eget auctor sapien, vel accumsan nisi. Aenean ac risus sit amet nulla lacinia ullamcorper ut ac nunc. Suspendisse potenti. Donec dolor diam, hendrerit in ligula cursus, vestibulum tristique mauris. Vestibulum vitae congue risus, quis placerat est.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et lacinia augue. Nulla eu diam orci. Suspendisse dapibus porttitor tellus id mattis. Phasellus vitae condimentum justo. Maecenas et ultricies libero. Donec vitae lacus lectus. Cras sem felis, pretium sed lacinia ac, congue quis ipsum. Etiam eget auctor sapien, vel accumsan nisi. Aenean ac risus sit amet nulla lacinia ullamcorper ut ac nunc. Suspendisse potenti. Donec dolor diam, hendrerit in ligula cursus, vestibulum tristique mauris. Vestibulum vitae congue risus, quis placerat est.'
                        );
                    }}
                >
                    Sign Lorem ipsum dolor sit amet...
                </button>
            </div>

            <div>
                <h2>Sign Message2</h2>
                <div style={{
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    width: '200px',
                    display: 'inline-block'
                }}>Token: { token }</div>
                <div>
                <button
                    onClick={() => testSignMessage(signer, setToken)}
                >
                    Get token
                </button>
                </div>
            </div>

            <div>
                <h2>Sign Data</h2>
                <button
                    onClick={() => {
                        signer.signTypedData([
                            {
                                key: 'BackChat',
                                value: 'base64:BzWHaQUaGVsd29AAAAAAAA',
                                type: 'string',
                            },
                            {
                                key: 'CallingAllGirls',
                                value: 'false',
                                type: 'string',
                            },
                            { key: 'Jealousy', value: 'world', type: 'string' },
                            {
                                key: 'AAAAAAAAAAAEAAAABaQEAAAADZm9v',
                                value: 'Oh Waves, Waves!',
                                type: 'string',
                            },
                            { key: 'key', value: 123123123, type: 'integer' },
                            { key: 'key', value: true, type: 'boolean' },
                        ]);
                    }}
                >
                    Sign Data
                </button>
            </div>

            <div>
                <h2>Lease</h2>
                <button
                    onClick={() => {
                        signer
                            .lease({
                                amount: 677728840,
                                recipient:
                                    '3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj',
                            })
                            .broadcast();
                    }}
                >
                    Lease
                </button>
                <button
                    onClick={() => {
                        signer
                            .lease({
                                amount: 677728840,
                                recipient: 'alias:T:merry',
                            })
                            .broadcast();
                    }}
                >
                    Lease to Merry by alias
                </button>
            </div>

            <div>
                <h2>Sponsorship</h2>
                <button
                    onClick={() => {
                        signer
                            .sponsorship({
                                assetId:
                                    '8BrF9fVo2tDPGMdcx91EdTZLmwUDX7K7h1zs6txCpAAA',
                                minSponsoredAssetFee: 123,
                            })
                            .broadcast();
                    }}
                >
                    Sign Sponsorship Enable
                </button>

                <button
                    onClick={() => {
                        signer
                            .sponsorship({
                                assetId:
                                    '8BrF9fVo2tDPGMdcx91EdTZLmwUDX7K7h1zs6txCpAAA',
                                minSponsoredAssetFee: 0,
                            })
                            .broadcast();
                    }}
                >
                    Sign Sponsorship Disable
                </button>
            </div>

            <div>
                <h2>Cancel Lease</h2>
                <button
                    onClick={() => {
                        signer
                            .cancelLease({
                                leaseId:
                                    'FUQasynBUELMXc9T1hrphfFwJvU2ENBiUfnJPci7jq4w',
                            })
                            .broadcast();
                    }}
                >
                    Cancel Lease
                </button>
            </div>

            <div>
                <h2>Alias</h2>
                <button
                    onClick={() => {
                        signer.alias({ alias: 'new_alias' }).broadcast();
                    }}
                >
                    Sign Alias
                </button>
            </div>

            <div>
                <h2>Reissue</h2>
                <button
                    onClick={() => {
                        signer
                            .reissue({
                                assetId:
                                    '6RHh59Tbt17QPvgaEu79DQsC5XyTqhBzpfB2FLV59ABU',
                                quantity: 100000000000,
                                reissuable: true,
                            })
                            .broadcast();
                    }}
                >
                    Sign Reissue
                </button>
            </div>

            <div>
                <h2>Account Script</h2>
                <button
                    onClick={() => {
                        signer
                            .setScript({
                                script:
                                    'AgQAAAAEdGhpcwkBAAAAB2V4dHJhY3QAAAABCAUAAAACdHgAAAAGc2VuZGVyBAAAAAckbWF0Y2gwBQAAAAJ0eAMJAAABAAAAAgUAAAAHJG1hdGNoMAIAAAATVHJhbnNmZXJUcmFuc2FjdGlvbgQAAAABdAUAAAAHJG1hdGNoMAQAAAANY29ycmVjdEFuc3dlcgkBAAAAB2V4dHJhY3QAAAABCQAEHAAAAAIFAAAABHRoaXMCAAAADWhhc2hlZCBhbnN3ZXIEAAAABmFuc3dlcgkAAfUAAAABCAUAAAABdAAAAAphdHRhY2htZW50AwkAAAAAAAACBQAAAA1jb3JyZWN0QW5zd2VyBQAAAAZhbnN3ZXIJAQAAAAEhAAAAAQkBAAAACWlzRGVmaW5lZAAAAAEIBQAAAAF0AAAAB2Fzc2V0SWQHAwMJAAABAAAAAgUAAAAHJG1hdGNoMAIAAAAPRGF0YVRyYW5zYWN0aW9uBgkAAAEAAAACBQAAAAckbWF0Y2gwAgAAABRTZXRTY3JpcHRUcmFuc2FjdGlvbgQAAAABcwUAAAAHJG1hdGNoMAkAAfQAAAADCAUAAAABcwAAAAlib2R5Qnl0ZXMJAAGRAAAAAggFAAAAAXMAAAAGcHJvb2ZzAAAAAAAAAAAACAUAAAABcwAAAA9zZW5kZXJQdWJsaWNLZXkHnYrj7g==',
                            })
                            .broadcast();
                    }}
                >
                    Set Script
                </button>
            </div>

            <div>
                <h2>Logout</h2>
                <button
                    onClick={() => {
                        signer.logout();
                    }}
                >
                    Logout
                </button>
            </div>

            <div>
                <h1>Clear</h1>
                <button
                    onClick={() => {
                        localStorage.clear();
                    }}
                >
                    Clear storage
                </button>
            </div>
        </div>
    );
}

render(<TestApp />, document.getElementById('root'));
