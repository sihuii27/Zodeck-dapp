import config from '../abi/config.json';

const ethers = require('ethers');
require("dotenv").config();
const cardcss = require('./Landing.css');

const CONTRACT_ADDRESS = config.NFTPLACE_CONTRACT_ADDRESS;

// For Hardhat 
const contract = require("../abi/NFTplace.json");

const uri = "https://localhost:3000/Images/Images/"

//console.log(JSON.stringify(contract.abi));

// Provider
// const provider = new ethers.JsonRpcProvider(process.env.API_URL);
// Signer
// const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
// Contract
//const nftMarketplaceContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

const NftMarketPlace = ({ tokenId, priceTag, closePopup }) => {
    const listCard = async () => {
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
            const marketowner = await nftMarketplaceContract.getContractOwner();
            console.log("The market owner is: " + marketowner);
            const cost = await nftMarketplaceContract.getListingPrice();        

            const tx = await nftMarketplaceContract.listCard(tokenId, ethers.parseUnits(priceTag, 'ether'), {
                value: cost, // cost to put listing
                gasLimit: 500000,
            });
            console.log(tx);

            // Send the transaction
            // const transactionResponse = await signer.sendTransaction(tx);
            // console.log("Transaction sent:", transactionResponse);

            // // Wait for the transaction to be mined
            // const receipt = await transactionResponse.wait();
            // console.log("Transaction mined:", receipt);
            closePopup();
            alert("Transaction successful!");

        } catch (error) {
            console.error("Error sending Ether:", error);
            alert("Transaction failed: " + error.message);
        }
    };

    return <button className="hover-link" onClick={listCard}>List NFT </button>;
};

export default NftMarketPlace;
