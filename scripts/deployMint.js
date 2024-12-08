const {ethers} = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy the contract
    const mintCardNFT = await ethers.getContractFactory("CardCollectingNFT"); 
    console.log("Deploying mintCardNFT...");
    //specifying big number
    const subscriptionId = 20219316782057294748120828016829935644550368644651516612011930964418228722702n; 
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
