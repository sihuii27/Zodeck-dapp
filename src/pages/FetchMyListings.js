import React, { useEffect } from 'react';
import config from '../abi/config.json';
const ethers = require('ethers');
require("dotenv").config();


const CONTRACT_ADDRESS = config.NFTPLACE_CONTRACT_ADDRESS;
const contract = require("../abi/NFTplace.json"); // Assuming the ABI is properly imported

const FetchMyListing = ({ setListings }) => {
    useEffect(() => {
        const fetchListings = async () => {
          try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const nftMarketplaceContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
            const myListings = await nftMarketplaceContract.fetchItemsListed(); 
            setListings(myListings); 
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
                fetchListings();
            });
        };

        // Fetch initial listings
        fetchListings();

        // Setup the event listener for new listings
        setupEventListener();

        // Removing the event listener
        return () => {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = provider.getSigner();
            const nftMarketplaceContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
            nftMarketplaceContract.removeAllListeners('ListingCreated');
        };
        
    }, [setListings]);

    return null; // No UI rendering
};

export default FetchMyListing;
