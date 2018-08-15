var transfer = require('./scripts/ioncbatch_mainnet_privkey');

//两个批量转账合约
//0xEdB15fDCeC8830af1Fdf1A634CD35a7A1840c00B
transfer.init({
    senderAddress: "0x01b09833245bf407dfe129fe8ffa7071bee2a9ac",
    privateKey: "",
    IONCBatchAddress:"0xEdB15fDCeC8830af1Fdf1A634CD35a7A1840c00B",
    ERC20TokenAddress:"0x6147f2e4c6a363bB55b0e95af3E3a8Bec56e068A",
    provider: "https://ropsten.infura.io"
});

// 这个方法只需要执行一次，执行完后将这个方法注释
//transfer.approve(0)
//transfer.approve(5);


//这里是 接受地址 最多100个
transfer.batchTransfer(
    [
        "0xe9d42e59D3f8F8dC207f48a5C4C5C31444Fd7032",
    ],
    [
        1,
    ]);
