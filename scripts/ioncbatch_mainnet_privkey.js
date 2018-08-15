var log = require('./helper.js');
var logger = log.getLogger("transfer");

var contract = require("truffle-contract");

var ERC20TokenData = require("../build/MarmotToken.json");
var ERC20Token = contract(ERC20TokenData);

var IONCBatchData = require("../build/MMTBatch.json");
var IONCBatch = contract(IONCBatchData);

var Web3 = require("web3");
var web3 = new Web3();


var WalletProvider = require('truffle-wallet-provider');
var provider;


var ERC20TokenAddress = "0x6147f2e4c6a363bB55b0e95af3E3a8Bec56e068A";
var ERC20TokenInstance;

var IONCBatchAddress = "0xEdB15fDCeC8830af1Fdf1A634CD35a7A1840c00B";
var IONCBatchInstance;

var senderAddress;

async function getERC20Instance() {
    ERC20TokenInstance = await
        ERC20Token.at(ERC20TokenAddress);
}


async function getIONCBatchInstance() {
    IONCBatchInstance = await
        IONCBatch.at(IONCBatchAddress);
}

// 授权给IONCBatchAddress IONC的数量
async function approve(amount) {
    await getIONCBatchInstance();
    await getERC20Instance();

    let gasPrice = web3.eth.gasPrice;
    console.info("gasPrice: " + gasPrice.toString());

    var balance = await ERC20TokenInstance.balanceOf(senderAddress);
    var decimal = await ERC20TokenInstance.decimals();

    console.info("balanceOf: " + balance / Math.pow(10, decimal));

    console.info("senderAddress: " + senderAddress);
    console.info("IONCBatchAddress: " + IONCBatchAddress);
    await ERC20TokenInstance.approve(IONCBatchAddress, web3.toWei(amount), {
        from: senderAddress,
        gas: 4463981,
        gasPrice: web3.toWei(1,'gwei')
        //gasPrice: gasPrice.totring()
    });
}

async function batchTransfer(receives, amounts) {
    await getIONCBatchInstance();
    await getERC20Instance();

    //estimate gasPrice
    let gasPrice = web3.eth.gasPrice*1.2;
    console.info("gasPrice: " + gasPrice.toString())

    //estimate gas
    let gas = await IONCBatchInstance.batchTransfer.estimateGas(ERC20TokenAddress, receives, amounts, {
        from: senderAddress
    });
    gas=gas * 1.5;
    console.info("gas: "+gas);
    for (var i =0;i<amounts.length;i++ ) {
        amounts[i] = web3.toWei(amounts[i]);
    }

    //5463981
    //7805800
    await IONCBatchInstance.batchTransfer(ERC20TokenAddress, receives, amounts, {
        from: senderAddress,
        gas: 4463981,
        gasPrice: web3.toWei(1,'gwei')
        //gasPrice: gasPrice
    }).then(function (tx) {
        logger.info(JSON.stringify(tx));
    });

}


function init(info) {
    web3.setProvider(new Web3.providers.HttpProvider(info.provider));
    provider = new WalletProvider(info.privateKey, info.provider);

    senderAddress = info.senderAddress;

    IONCBatchAddress = info.IONCBatchAddress;
    ERC20TokenAddress = info.ERC20TokenAddress;

    ERC20Token.setProvider(provider);
    IONCBatch.setProvider(provider);
}

exports.init = init;
exports.batchTransfer = batchTransfer;
exports.approve = approve;