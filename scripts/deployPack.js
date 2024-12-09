const {ethers} = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy the contract
    const PackMarket = await ethers.getContractFactory("PackMarket"); 
    console.log("Deploying PackMarket...");
    const packMarket = await PackMarket.deploy(); // Deploy transaction

    console.log("PackMarket deployed to:", packMarket.address); // Log the address
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
