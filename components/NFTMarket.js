const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace", function () {
    let nftMarketplace, mockNFT, deployer, seller, buyer;

    beforeEach(async () => {
        [deployer, seller, buyer] = await ethers.getSigners();

        // Deploy Mock NFT contract
        const MockNFT = await ethers.getContractFactory("MockERC721");
        mockNFT = await MockNFT.deploy();
        await mockNFT.deployed();

        // Deploy Marketplace contract
        const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
        nftMarketplace = await NFTMarketplace.deploy();
        await nftMarketplace.deployed();
    });

    it("Should list and sell an NFT", async () => {
        // Mint NFT
        const tokenId = await mockNFT.connect(seller).mint(seller.address);

        // Approve marketplace
        await mockNFT.connect(seller).approve(nftMarketplace.address, tokenId);

        // List NFT
        const price = ethers.utils.parseEther("1");
        await nftMarketplace.connect(seller).listNFT(mockNFT.address, tokenId, price);

        // Check listing
        const listing = await nftMarketplace.listings(mockNFT.address, tokenId);
        expect(listing.isListed).to.be.true;

        // Buy NFT
        await nftMarketplace.connect(buyer).buyNFT(mockNFT.address, tokenId, { value: price });

        // Check ownership
        const newOwner = await mockNFT.ownerOf(tokenId);
        expect(newOwner).to.equal(buyer.address);
    });
});
