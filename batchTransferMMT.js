var Web3 = require("web3"); //引入web3支持，我本地使用的是web3^0.18.4
var fs = require("fs"); //文件读写
var contract = require("truffle-contract");
var WalletProvider = require('truffle-wallet-provider');

var contractABI = JSON.parse(fs.readFileSync('./build/MarmotToken.json', 'utf-8'));

var from = "0xe9d42e59D3f8F8dC207f48a5C4C5C31444Fd7032";
var fromPrivateKey = "";

var contractAddress = "0x6147f2e4c6a363bB55b0e95af3E3a8Bec56e068A";
var IONCBatchAddress = "0xEdB15fDCeC8830af1Fdf1A634CD35a7A1840c00B";
// 通过ABI初始化合约对象
var MMTContract = contract({
    abi: contractABI
    // 如果要部署合约，还要指定合约代码：
    // unlinked_binary: ...
});


var Web3 = require("web3");
var web3 = new Web3();

// 连接到以太坊节点
var provider = new WalletProvider(fromPrivateKey, "https://ropsten.infura.io/JOEnl84Gm76oX0RMUrJB");

MMTContract.setProvider(provider);

MMTContract.at(contractAddress).then(function(instance){
    instance.approve(IONCBatchAddress, web3.toWei(10), {
        from: from,
        gas: 4463981,
        gasPrice: web3.toWei(0,'gwei')
        //gasPrice: gasPrice.totring()
    });
});
