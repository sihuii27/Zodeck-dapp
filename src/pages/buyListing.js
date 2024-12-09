import React from 'react';
import './Marketplace.css';
import config from '../abi/config.json';
import Swal from 'sweetalert2';
const ethers = require('ethers');
require("dotenv").config();


const CONTRACT_ADDRESS = config.NFTPLACE_CONTRACT_ADDRESS;


// For Hardhat 
const contract = require("../abi/CardMintPack.json");

const uri = "https://localhost:3000/Images/Images/"

const priceTag = "0.0005";

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

            // fetch all listings in marketplace
            const listings = await nftMarketplaceContract.fetchListingMarketplace();
            // find listing that matches the selected tokenId
            const thisListing = listings.find(result => result[0] === tokenId);
            const priceTag = thisListing[3]; // price tag for buying the card in wei

            const tx = await nftMarketplaceContract.purchaseCard(tokenId, {
                value: priceTag, // pay price tag 
                gasLimit: 500000,
            });
            console.log(tx);
            Swal.fire({
                title: "Please wait for transaction to be confirmed...",
                text: "You clicked the button!",
                icon: "info",
                html: `
                <a href="https://sepolia.etherscan.io/tx/${tx.hash}" target="_blank">
                View your Transaction Id: ${tx.hash}
                </a>
            `,
            });

            const receipt = await tx.wait();

            Swal.fire({
                title: "Transaction Confirmed",
                icon: "success",
            });

        } catch (error) {
            console.error("Error sending Ether:", error);
            alert("Transaction failed: " + error.message);
        }
    };
    return <button className="hover-link" onClick={buyCard}>Purchase Card</button>;
};


export default PurchaseCard;