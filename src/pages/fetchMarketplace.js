import React, { useEffect, useCallback } from 'react';
import config from '../abi/config.json';
const ethers = require('ethers');
require("dotenv").config();


const CONTRACT_ADDRESS = config.CONTRACT_ADDRESS;

// For Hardhat 
const contract = require("../abi/CardMintPack.json");

const uri = "https://localhost:3000/Images/Images/"

const priceTag = "0.0005";

const FetchAllListing = ({ setAllListings, setloading }) => {
    const fetchAllList = useCallback(async () => {
        try {
            setloading(true);
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const nftMarketplaceContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

            const myListings = await nftMarketplaceContract.fetchListingMarketplace();
            setAllListings(myListings);

        } catch (error) {
            console.error("Error fetching all listings", error);

        }
        finally {
            // Ensure loading is false after fetch
            setloading(false); 
        }
    }, [setAllListings, setloading]);

    useEffect(() => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const nftMarketplaceContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, provider);

        // fetch all listings
        fetchAllList();

        // when transfer event is triggered by nft contract, fetch my listings
        const handleListingsUpdate = async () => {
            console.log("Listing data changed, refreshing...");
            fetchAllList();
        };
        nftMarketplaceContract.on("Transfer", handleListingsUpdate);

        // remove event listeners so that previous listeners will not persist
        return () => {
            nftMarketplaceContract.off("Transfer", handleListingsUpdate);
        };
    }, [fetchAllList]);

    // No UI rendering
    return null; 
};

export default FetchAllListing;
