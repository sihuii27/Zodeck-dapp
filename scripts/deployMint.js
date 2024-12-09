const {ethers} = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy the contract
    const mintCardNFT = await ethers.getContractFactory("CardMintPack"); 
    console.log("Deploying mintCardNFT...");
    //specifying big number
    const subscriptionId = 37047386916970814802263160841961854059724743253404548406195284417020824902327n; 
    // const baseURI = "ipfs://bafybeict2kq6gt4ikgulypt7h7nwj4hmfi2kevrqvnx2osibfulyy5x3hu/";
    const contractMintCardNFT = await mintCardNFT.deploy(subscriptionId); // Deploy transaction

    console.log("PackMarket deployed to:", contractMintCardNFT.address); // Log the address
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
