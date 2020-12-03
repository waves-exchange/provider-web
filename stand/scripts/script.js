var url = location.href.includes('provider=exchange') ?
    'https://waves.exchange/signer' :
    location.origin + '/iframe-entry';
var node = location.href.includes('mainnet') ?
    'https://nodes.wavesplatform.com' :
    'https://nodes-testnet.wavesnodes.com';
var provider = new providerWeb.ProviderWeb(url);
var waves = new signer.Signer({
    NODE_URL: node
});
waves.setProvider(provider);
var getByElement = function(element, key, defaultValue) {
    return element.getAttribute(`data-${key}`) || defaultValue;
};
var getFromInput = function(elementId) {
    return document.getElementById(elementId).value;
}
var setElementValue = function(elementId, value) {
    document.getElementById(elementId).value = value;
}
var setElementHTML = function(elementId, value) {
    document.getElementById(elementId).innerHTML = value;
}
var transferTx = function(amount, recipient, assetId, feeAssetId, fee, attachment) {

    if (feeAssetId) {
        feeAssetId=='WAVES' ? feeAssetId = null : null;
    } else {
        feeAssetId = undefined;
    }

    return waves
        .transfer({
            amount: amount,
            recipient: recipient,
            assetId: assetId || null,
            feeAssetId: feeAssetId,
            fee: fee || undefined,
            attachment: attachment,
        })
        .broadcast();
}
var getNodeTxLink = function(txId) {
    link = waves._options.NODE_URL + '/transactions/info/' + txId;
    return `<a href="${link}">${link}</a>`
}

var invokeTx = function(dapp, fee, feeAssetId, payment, call) {
    payment = JSON.parse(payment || '[]');
    call ? call = JSON.parse(call) : call = null;

    if (feeAssetId) {
        feeAssetId=='WAVES' ? feeAssetId = null : null;
    } else {
        feeAssetId = undefined;
    }

    return waves.invoke({
            dApp: dapp,
            fee: fee || undefined,
            feeAssetId: feeAssetId,
            payment: payment,
            call: call,
        })
        .broadcast();
}

var dataTx = function(data, fee, feeAssetId) {
    data ? data = JSON.parse(data) : data = null;

    return waves.data({
            data: data,
            fee: fee || undefined
        })
        .broadcast();
}

var copyText = function(containerid) {
    if (document.selection) { // IE
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementById(containerid));
        range.select();
    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(document.getElementById(containerid));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }

    document.execCommand('copy');
}

var signMessage = function(message) {
	console.log(message);
	return waves.signMessage(message);
}

var signCustomData = function(data) {
	return waves.signTypedData(JSON.parse(data || '[]'));
}

var startLease = function(amount, recipient, fee) {
    return waves.lease({
            amount: amount,
            recipient: recipient,
            fee: fee || null
        })
        .broadcast();
}

var issueAsset = function(name, decimals, quantity, reissuable, description, script) {
    return waves.issue({
            name: name,
            decimals: parseInt(decimals),
            quantity: quantity,
            reissuable: reissuable, 
            description: description,
            script: script || null
        })
        .broadcast();
}

var burnAsset = function(assetId, quantity, fee) {
    return waves.burn({
            assetId: assetId,
            quantity: quantity,
            fee: fee || null
        })
        .broadcast();
}

var cancelLease = function(leaseId, fee) {
    return waves.cancelLease({
            leaseId: leaseId,
            fee: fee || null
        })
        .broadcast();
}

var setSponsorship = function(assetId, rate, fee) {
    return waves.sponsorship({
            assetId: assetId,
            minSponsoredAssetFee: rate || 0,
            fee: fee || null
        })
        .broadcast();
}

var setAssetScript = function(assetId, script, fee) {
    return waves.setAssetScript({
            assetId: assetId,
            script: script || null,
            fee: fee || null
        })
        .broadcast();
}

var newAlias = function(alias, fee) {
    return waves.alias({
            alias: alias,
            fee: fee || null
        })
        .broadcast();
}

var setScript = function(script, fee) {
    return waves.setScript({
            script: script || null,
            fee: fee || null
        })
        .broadcast();
}

var reissueAsset = function(assetId, quantity, reissuable, fee) {
    return waves.reissue({
            assetId: assetId,
            quantity: quantity,
            reissuable: reissuable,
            fee: fee || null
        })
        .broadcast();
}

var massTransfer = function(assetId, transfers, attachment, fee) {
    transfers = JSON.parse(transfers || '[]');
    
    return waves.massTransfer({
        assetId: assetId || null,
        transfers: transfers,
        attachment: attachment || null,
        fee: fee || null
    })
    .broadcast();
}