const Web3 = require('web3');
const { PolyjuiceHttpProvider, PolyjuiceAccounts } = require("@polyjuice-provider/web3");

/**
 * BEFORE USING THIS SCRIPT MAKE SURE TO REPLACE:
 * - <YOUR_CONTRACT_ABI>
 * - <YOUR_CONTRACT_ADDRESS>
 * - CONTRACT_ADDRESS variable value
 * - YOUR_READ_FUNCTION_NAME method name
 * - YOUR_WRITE_FUNCTION_NAME method name
 */

const ACCOUNT_PRIVATE_KEY = '<YOUR_ETHEREUM_PRIVATE_KEY>'; // Replace this with your Ethereum private key with funds on Layer 2.
const CONTRACT_ABI = ['<YOUR_CONTRACT_ABI>']; // this should be an Array []
const CONTRACT_ADDRESS = '<YOUR_CONTRACT_ADDRESS>';

const GODWOKEN_RPC_URL = 'http://godwoken-testnet-web3-rpc.ckbapp.dev';
const polyjuiceConfig = {
    rollupTypeHash: '0x9b260161e003972c0b699939bc164cfdcfce7fd40eb9135835008dd7e09d3dae',
    ethAccountLockCodeHash: '0xfcf093a5f1df4037cea259d49df005e0e7258b4f63e67233eda5b376b7fd2290',
    web3Url: GODWOKEN_RPC_URL
};
  
const provider = new PolyjuiceHttpProvider(
    GODWOKEN_RPC_URL,
    polyjuiceConfig,
);

const web3 = new Web3(provider);

web3.eth.accounts = new PolyjuiceAccounts(polyjuiceConfig);
const account = web3.eth.accounts.wallet.add(ACCOUNT_PRIVATE_KEY);
web3.eth.Contract.setProvider(provider, web3.eth.accounts);

async function readCall() {
    const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    const callResult = await contract.methods.YOUR_READ_FUNCTION_NAME().call({
        from: account.address
    });

    console.log(`Read call result: ${callResult}`);
}

async function writeCall() {
    const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    const tx = contract.methods.YOUR_WRITE_FUNCTION_NAME().send(
        {
            from: account.address,
            to: '0x' + new Array(40).fill(0).join(''),
            gas: 6000000,
            gasPrice: '0',
        }
    );

    tx.on('transactionHash', hash => console.log(`Write call transaction hash: ${hash}`));

    const receipt = await tx;

    console.log('Write call transaction receipt: ', receipt);
}

(async () => {
    const balance = BigInt(await web3.eth.getBalance(account.address));

    if (balance === 0n) {
        console.log(`Insufficient balance. Can't issue a smart-contract call. Please deposit funds to your Ethereum address: ${account.address}`);
        return;
    }

    console.log('Calling contract...');

    // Check smart contract state after state change.
    await readCall();

    // Change smart contract state.
    await writeCall();

    // Check smart contract state after state change.
    await readCall();
})();