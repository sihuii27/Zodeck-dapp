const ethers = require('ethers');
require("dotenv").config();
const cardcss = require('./Landing.css'); 

const CONTRACT_ADDRESS = "0x617D607f74b5F17D50a2356521a1b25574Cf667c";

// For Hardhat 
const contract = require("../abi/NFTplace.json");

const uri = "https://localhost:3000/Images/Images/"

const priceTag = "0.0005" ;

//console.log(JSON.stringify(contract.abi));

// Provider
// const provider = new ethers.JsonRpcProvider(process.env.API_URL);
// Signer
// const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
// Contract
//const nftMarketplaceContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

const FetchMyListing = () => {
    const listings = async () => {
        const myListings = await nftMarketplaceContract.fetchItemsListed();
    };
    // const listings = async () => {
    //     // Create a provider and signer
    //     const provider = new ethers.BrowserProvider(window.ethereum);
    //     const signer = await provider.getSigner();
    //     const nftMarketplaceContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
    //     const listings = await nftMarketplaceContract.fetchListingMarketplace();
    //     console.log("Lisitings: " + listings)
    // }
    // // const purchase = await nftMarketplaceContract.purchaseCard(1, {
    // //         value: ethers.parseUnits(priceTag,'ether'), // cost to put listing
    // //     });
    // // console.log("The transaction is: " + purchase);
    // const mynft = await nftMarketplaceContract.fetchMyNFTs();
    // console.log("My NFT" + mynft)
    // const myListings = await nftMarketplaceContract.fetchItemsListed();
    // console.log("My Listings" + myListings)
    return listings;
};

export default NftMarketPlace;
