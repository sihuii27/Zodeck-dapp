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


//console.log(JSON.stringify(contract.abi));

// Provider
// const provider = new ethers.JsonRpcProvider(process.env.API_URL);
// Signer
// const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
// Contract
//const nftMarketplaceContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
const ListMarketplace = ({ tokenId, priceTag}) => {
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
            const tx = await nftMarketplaceContract.listCard(tokenId, ethers.parseUnits(priceTag, 'ether'), {
                value: cost, // cost to put listing
                gasLimit: 500000,
            });
            console.log(tx);
            Swal.fire({
                title: "Please wait for transaction to be confirmed...",
                icon: "info",
                html: `
                View your Transaction Id: 
                <a href="https://sepolia.etherscan.io/tx/${tx.hash}" target="_blank">
                ${tx.hash}
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
    return <button className="hover-link" onClick={buyCard}>List to Marketplace</button>;
};


export default ListMarketplace;