const ethers = require('ethers');
require("dotenv").config();
//require('./Landing.css'); 
 

const CONTRACT_ADDRESS = "0x617D607f74b5F17D50a2356521a1b25574Cf667c";

// For Hardhat 
const contract = require("../abi/NFTplace.json");

const uri = "https://localhost:3000/Images/Images/"

const priceTag = "0.0005" ;

//console.log(JSON.stringify(contract.abi));

// Provider
const provider = new ethers.JsonRpcProvider(process.env.API_URL);
// Signer
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
// Contract
const nftMarketplaceContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

async function main() {
  const cost = await nftMarketplaceContract.getListingPrice();
  const tx = await nftMarketplaceContract.createToken(uri, ethers.parseUnits(priceTag,'ether'), {
    value: cost, // cost to put listing
    gasLimit: 500000,
});
console.log(tx);
}
main();
