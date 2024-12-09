import React, { useEffect, useCallback } from 'react';
import config from '../abi/config.json';
const ethers = require('ethers');
require("dotenv").config();


const CONTRACT_ADDRESS = config.NFTPLACE_CONTRACT_ADDRESS;
const contract = require("../abi/NFTplace.json"); // Assuming the ABI is properly imported

const FetchMyListing = ({ setListings, setloading, account }) => {
  const fetchListings = useCallback(async () => {
    try {
      setloading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const nftMarketplaceContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
      
      const myListings = await nftMarketplaceContract.fetchItemsListed();
      setListings(myListings);

    } catch (error) {
      console.error("Error fetching listings", error);
      
    }
    finally {
      setloading(false); // Ensure loading is false after fetch
    }
  }, [setListings,setloading, account]);

  useEffect(() => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const nftMarketplaceContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, provider);

    // fetch listings
    fetchListings();

    // when transfer event is triggered by nft contract, fetch my listings
    const handleListingUpdate = async () => {
      console.log("Listing data changed, refreshing...");
      fetchListings();
    };
    nftMarketplaceContract.on("Transfer", handleListingUpdate);

    // remove event listeners so that previous listeners will not persist
    return () => {
      nftMarketplaceContract.off("Transfer", handleListingUpdate);
    };
  }, [fetchListings]);

  // No UI rendering
  return null; 
};

export default FetchMyListing;
