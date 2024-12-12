const ethers = require('ethers');
require("dotenv").config();
//require('./Landing.css'); 

const config = require('../abi/config.json');

const CONTRACT_ADDRESS = config.NFTPLACE_CONTRACT_ADDRESS;

// For Hardhat 
const contract = require("../abi/CardMintPack.json");

const uri = "https://apricot-cheerful-alpaca-636.mypinata.cloud/ipfs/bafybeicgkoz5at4c2tdu7odbytswwqw4wdgmkt6h6sdocmwfatydyq4o3e/Card1.png"

// const priceTag = "0.0005" ;

//console.log(JSON.stringify(contract.abi));

// Provider
const provider = new ethers.JsonRpcProvider(process.env.API_URL);
// Signer
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
// Contract
const nftMarketplaceContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

async function main() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const nftMarketplaceContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

  // fetch all listings in marketplace
  // const listings = await nftMarketplaceContract.fetchListingMarketplace();
  // // find listing that matches the selected tokenId
  // const thisListing = listings.find(result => result[0] === tokenId);
  // const priceTag = thisListing[3];
  // console.log(priceTag);
  const tokenId = nftMarketplaceContract.createToken("https://green-manual-badger-37.mypinata.cloud/ipfs/bafkreihgqsrjemcnnekx54egf7nh5vpn5ipcqlcie6us5tfqinogm5jaqu", "0x41E213C12B77A2B265A19f20c786634Edb4F2Fdb", 1);
  console.log(tokenId);
  // const myitems = await nftMarketplaceContract.listCard(2,ethers.parseEther(priceTag), {
  //     value: cost, // cost to put listing
  //     gasLimit: 500000,
  //   });
  // console.log(myitems);
  // const itemlist = await nftMarketplaceContract.fetchItemsListed();
  // const listings = await nftMarketplaceContract.fetchListingMarketplace();
  // const tokenId = 7n;
  // const thisListing = listings.find(result => result[0] === tokenId);
  // console.log(listings);
  // const priceTag = thisListing[3];
  // console.log(priceTag);
  // console.log("The priceTag is: " + priceTag);
  // const marketowner = await nftMarketplaceContract.getContractOwner();
  // console.log("The market owner is: " + marketowner);

  // const tx = await nftMarketplaceContract.purchaseCard(tokenId, {
  //     value: ethers.parseEther(priceTag, "ether"), // price tag for buying the card
  //     gasLimit: 500000,
  // });
}
main();
