const ethers = require('ethers');
require("dotenv").config();

const CONTRACT_ADDRESS = "0x7b17Bf1909F4c0BB08b621D46E7f6ff51F1E5922";

// For Hardhat 
const contract = require("./mintCardNFT.json");

const uri = "https://localhost:3000/Images/Images/"

const priceTag = "0.0005" ;
// const cost = "0.0001" ;

//console.log(JSON.stringify(contract.abi));

// Provider
const provider = new ethers.JsonRpcProvider(process.env.API_URL);
// Signer
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
// Contract
const mintCardContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

async function main() {
    const tx = await mintCardContract.requestRandomWords(0);
    console.log(tx);
    // const listings = await nftMarketplaceContract.fetchListingMarketplace();
    // console.log("Lisitings: " + listings)
    // const purchase = await nftMarketplaceContract.purchaseCard(1, {
    //         value: ethers.parseUnits(priceTag,'ether'), 
    //     });
    // console.log("The transaction is: " + purchase);
    // const mynft = await nftMarketplaceContract.fetchMyNFTs();
    // console.log("My NFT" + mynft)
    // const myListings = await nftMarketplaceContract.fetchItemsListed();
    // console.log("My Listings" + myListings)

}

main();