const ethers = require('ethers');
require("dotenv").config();

const config = require('../abi/config.json');

const CONTRACT_ADDRESS = config.MINT_CONTRACT_ADDRESS;

const contract = require("../abi/CardCollectingNFT.json");

//console.log(JSON.stringify(contract.abi));

// Provider
const provider = new ethers.JsonRpcProvider(process.env.API_URL);
// Signer
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
// Contract
const packContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

async function main() {
  // const requestId = await packContract.requestRandomWords();
  // console.log(requestId);

  const tx = await packContract.batchMint(49749116328078637181964321242244027284933942356633488110649535225646153539245n)
  console.log(tx);
}
main();
