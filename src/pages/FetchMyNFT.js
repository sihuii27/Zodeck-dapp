import React, { useState, useEffect, useCallback } from 'react';
import './Landing.js';
import config from '../abi/config.json';

const ethers = require('ethers');
require("dotenv").config();
//require('./Landing.css'); 


const CONTRACT_ADDRESS = config.NFTPLACE_CONTRACT_ADDRESS;

// For Hardhat 
const contract = require("../abi/NFTplace.json");

const priceTag = "0.0005";

const baseURI = "ipfs://bafybeict2kq6gt4ikgulypt7h7nwj4hmfi2kevrqvnx2osibfulyy5x3hu/";

const FetchMyNFT = ({ setMyNFT, setloading, account }) => {
  const fetchmyNFT = useCallback(async () => {
    try {
      //start loading when fetching
      setloading(true); 
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const nftMarketplaceContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
      
      const nft = await nftMarketplaceContract.fetchMyNFTs();
      // Store the fetched listings in state
      setMyNFT(nft);
    } catch (error) {
      console.error("Error in fetch listing", error);
    }
    finally {
      setloading(false); // Ensure loading is false after fetch
    }
  }, [setMyNFT, setloading, account]);

  useEffect(() => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const nftMarketplaceContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, provider);

    // fetch NFTs
    fetchmyNFT();

    // when transfer event is triggered by nft contract, fetch my nfts
    const handleNFTUpdate = async () => {
      console.log("NFT data changed, refreshing...");
      fetchmyNFT();
    };
    nftMarketplaceContract.on("Transfer", handleNFTUpdate);

    // remove event listeners so that previous listeners will not persist
    return () => {
      nftMarketplaceContract.off("Transfer", handleNFTUpdate);
    };
  }, [fetchmyNFT]);

  //no need display the logic, just the ui
  return (null);
};

export default FetchMyNFT;
