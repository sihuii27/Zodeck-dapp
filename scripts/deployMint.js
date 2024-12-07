const {ethers} = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy the contract
    const mintCardNFT = await ethers.getContractFactory("CardCollectingNFT"); 
    console.log("Deploying mintCardNFT...");
    const subscriptionId = 96974610044604628616312141700459175826277520099863534881940862707743682658212; 
    const contractMintCardNFT = await mintCardNFT.deploy(subscriptionId); // Deploy transaction

    console.log("PackMarket deployed to:", contractMintCardNFT.address); // Log the address
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
