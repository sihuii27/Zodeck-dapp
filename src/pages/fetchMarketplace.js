import React, { useEffect } from 'react';
const ethers = require('ethers');
require("dotenv").config();

// const CONTRACT_ADDRESS = process.env.NFTPLACE_CONTRACT_ADDRESS;
const CONTRACT_ADDRESS = "0x76E79e0fbfa0C3811f88111aE3169E59793010a2";

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
const FetchAllListing = ({ setAllListings }) => {
    useEffect(() => {
        const fetchAllList = async () => {
          try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const nftMarketplaceContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
            const allListings = await nftMarketplaceContract.fetchListingMarketplace(); 
            setAllListings(allListings); 
          } catch (error) {
            console.error("Error fetching listings", error);
          }
        };

        const setupEventListener = async () => {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const nftMarketplaceContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

            // Listen for the ListingCreated event
            nftMarketplaceContract.on('ListingCreated', async (tokenId, seller, price) => {
                console.log(`New listing created: TokenId ${tokenId}, Seller ${seller}, Price ${price}`);
                // Refresh the listings when a new one is created
                fetchAllList();
            });
        };

        // Fetch initial listings 
        fetchAllList();

        // Setup the event listener for new listings
        setupEventListener();

        // Removing the event listener
        return () => {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = provider.getSigner();
            const nftMarketplaceContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
            nftMarketplaceContract.removeAllListeners('ListingCreated');
        };
        
    }, [setAllListings]);

    return null; // No UI rendering
};

export default FetchAllListing;
