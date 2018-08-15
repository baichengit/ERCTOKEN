var Web3 = require("web3"); //引入web3支持，我本地使用的是web3^0.18.4
var fs = require("fs"); //文件读写
var Tx = require("ethereumjs-tx"); //引入以太坊js交易支持


//初始化web3
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io"));
}

var contractABI = JSON.parse(fs.readFileSync('./build/MarmotTokenAbi_web3^0.18.4.json', 'utf-8'));
//var contractABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_initialAmount","type":"uint256"},{"name":"_tokenName","type":"string"},{"name":"_decimalUnits","type":"uint8"},{"name":"_tokenSymbol","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}];
var from = "0xe9d42e59D3f8F8dC207f48a5C4C5C31444Fd7032";
var fromPrivateKey = "";

var to = "0x01b09833245bf407dfe129fe8ffa7071bee2a9ac";
//var toPrivateKey = "";
var contractAddress = "0x6147f2e4c6a363bB55b0e95af3E3a8Bec56e068A";
var tokenValue = 1;

//单位转换示例
var balance = web3.eth.getBalance(from);
console.info("balance of holder in wei is : " + balance.toString());
console.info("balance of holder in gwei is : " + web3.fromWei(balance, 'gwei'));
console.info("balance of holder in finney is : " + web3.fromWei(balance, 'finney'));
console.info("balance of holder in ether is : " + web3.fromWei(balance, 'ether'));

//当前的gas价格。这个值由最近几个块的gas价格的中值决定
var gasPrice = web3.eth.gasPrice;
//console.logs("gasPrice in wei is : " +gasPrice.toString(10)); // "10000000000000"
//console.logs("gasPrice in gwei is : " + web3.fromWei(gasPrice.toString(10), 'gwei'));
var gasLimit = 60000;

//获取nonce
var count = web3.eth.getTransactionCount(from);
//console.logs("transaction count of holder is : " + count); // 1


var MMTContract = web3.eth.contract(contractABI).at(contractAddress)
var decimal = MMTContract.decimals();
var balance = MMTContract.balanceOf(from);
var adjustedBalance = balance / Math.pow(10, decimal);
var tokenName = MMTContract.name();
var tokenSymbol = MMTContract.symbol();
console.info("tokenSymbol: " + tokenSymbol);
console.info("tokenName: " + tokenName);
console.info("balance in wei: " + balance);
console.info("adjustedBalance: " + adjustedBalance);
console.info("decimal: " + decimal);


//私钥
var privKey = new Buffer(fromPrivateKey, 'hex');
//交易信息
var rawTransaction = {
    "from": from,
    "nonce": web3.toHex(count),
    "gasPrice": web3.toHex(gasPrice),
    "gasLimit": web3.toHex(gasLimit),
    "to": contractAddress,
    "value": "0x0",
    "data": MMTContract.transfer.getData(to, tokenValue*(10**decimal)),
    "chainId": 0x03
};
//实例交易
var tx = new Tx(rawTransaction);
//私钥交易签名
tx.sign(privKey);
//交易发送前实例化
var serializedTx = tx.serialize();
//发送交易，留下hash
web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
    if (!err){
        console.log(hash);
    } else {
        console.log(err);
    }
});



