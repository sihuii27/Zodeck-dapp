import nfts from '../abi/NFTs.json';
// const contract = require("../abi/NFTplace.json");
const ethers = require('ethers');
require("dotenv").config();

const baseURI = nfts.image; 


// Provider
const provider = new ethers.JsonRpcProvider(process.env.API_URL);
// Signer
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
// Contract
const minting = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

async function main() {
    const cost = await minting.getListingPrice();
    // const tx = await nftMarketplaceContract.createToken(uri, {
    //   value: cost, // cost to put listing
    //   gasLimit: 500000,
    // });
    // const myitems = await nftMarketplaceContract.listCard(2,ethers.parseEther(priceTag), {
    //     value: cost, // cost to put listing
    //     gasLimit: 500000,
    //   });
    // console.log(myitems);
    // const itemlist = await nftMarketplaceContract.fetchItemsListed();
    console.log(cost);
  }
main();

