import React, { useEffect } from 'react';
import './Landing.js';
import config from '../abi/config.json';
import nfts from '../abi/NFTs.json';
const ethers = require('ethers');
require("dotenv").config();
//require('./Landing.css'); 


const CONTRACT_ADDRESS = config.NFTPLACE_CONTRACT_ADDRESS;;

// For Hardhat 
const contract = require("../abi/NFTplace.json");

const uri = "https://localhost:3000/Images/Images/"

const priceTag = "0.0005" ;


const images = nfts.image;
const cards = nfts.cards;

cards.map((cardNumber) => {
  const imageUrl = `${images}Card${cardNumber}.png`;
  console.log(imageUrl); 
});


//console.log(JSON.stringify(contract.abi));

// Provider
//const provider = new ethers.JsonRpcProvider(process.env.API_URL);
// Signer
//const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
// Contract
//const nftMarketplaceContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

const FetchMyNFT = ({ setMyNFT }) => {
    useEffect(() => {
        const fetchmyNFT = async () => {
          try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const nftMarketplaceContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
            const nft = await nftMarketplaceContract.fetchMyNFTs(); 
            // Store the fetched listings in state
            setMyNFT(nft); 
          } catch (error) {
            console.error("Error in fetch listing", error);
          }
    };
      fetchmyNFT();
    }, [setMyNFT]);
    //no need display the logic, just the ui
    return ( null );
};

export default FetchMyNFT;

// async function main() {
//   const cost = await nftMarketplaceContract.getListingPrice();
//   const tx = await nftMarketplaceContract.createToken(uri), {
//     value: cost, // cost to put listing
//     gasLimit: 500000,
// });
// console.log(tx);
// }
// main();
