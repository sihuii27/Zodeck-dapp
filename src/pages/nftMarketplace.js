const ethers = require('ethers');
require("dotenv").config();

const CONTRACT_ADDRESS = "0x617D607f74b5F17D50a2356521a1b25574Cf667c";

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

const nftMarketplace = () => {
    const purchaseCard = async () => {
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
            const marketowner = await nftMarketplaceContract.getOwner();
            console.log("The market owner is: " + marketowner);

            const tx = await nftMarketplaceContract.createToken(uri, ethers.parseUnits(priceTag,'ether'), {
                to: CONTRACT_ADDRESS,
                value: cost, // cost to put listing
                gasLimit: 500000,
            });
            console.log(tx);
        }catch (error) {
            console.error("Error sending Ether:", error);
            alert("Transaction failed: " + error.message);
        }
    };
    // const listings = await nftMarketplaceContract.fetchListingMarketplace();
    // console.log("Lisitings: " + listings)
    // // const purchase = await nftMarketplaceContract.purchaseCard(1, {
    // //         value: ethers.parseUnits(priceTag,'ether'), // cost to put listing
    // //     });
    // // console.log("The transaction is: " + purchase);
    // const mynft = await nftMarketplaceContract.fetchMyNFTs();
    // console.log("My NFT" + mynft)
    // const myListings = await nftMarketplaceContract.fetchItemsListed();
    // console.log("My Listings" + myListings)
    return <button className="open-cardpack-btn" onClick={purchaseCard}>List Item</button>;
};

export default nftMarketplace;
