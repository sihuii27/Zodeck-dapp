import React from 'react';
import './Marketplace.css';
import config from '../abi/config.json';
const ethers = require('ethers');
require("dotenv").config();


const CONTRACT_ADDRESS = config.NFTPLACE_CONTRACT_ADDRESS;;


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
const PurchaseCard = ({ tokenId }) => {
    const buyCard = async () => {
        if (!window.ethereum) {
            alert("Please install MetaMask to interact with the dApp.");
            return;
        }

        try {
            // Request account access if needed
            await window.ethereum.request({ method: "eth_requestAccounts" });

            // Create a provider and signer
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const nftMarketplaceContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
            const cost = await nftMarketplaceContract.getListingPrice();
            console.log("The cost is: " + cost);
            const marketowner = await nftMarketplaceContract.getContractOwner();
            console.log("The market owner is: " + marketowner);

            const tx = await nftMarketplaceContract.purchaseCard(tokenId, {
                value: ethers.parseEther(priceTag), // cost to put listing
                gasLimit: 500000,
            });
            console.log(tx);
        }catch (error) {
            console.error("Error sending Ether:", error);
            alert("Transaction failed: " + error.message);
        }
    };
    return <button className="hover-link" onClick={buyCard}>Purchase NFT</button>;
};


export default PurchaseCard;
