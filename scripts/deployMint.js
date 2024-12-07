const {ethers} = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy the contract
    const mintCardNFT = await ethers.getContractFactory("RandomnessProvider"); 
    console.log("Deploying mintCardNFT...");
    const contractMintCardNFT = await mintCardNFT.deploy(); // Deploy transaction

    console.log("PackMarket deployed to:", contractMintCardNFT.address); // Log the address
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
