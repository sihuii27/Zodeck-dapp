const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace", function () {
    let nftMarketplace, mockNFT, deployer, seller, buyer;

    beforeEach(async function () {
        [deployer, seller, buyer] = await ethers.getSigners();

        // Deploy MockNFT
        const MockNFT = await ethers.getContractFactory("MockERC721");
        mockNFT = await MockNFT.deploy();
        await mockNFT.deployed();

        // Deploy NFTMarketplace
        const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
        nftMarketplace = await NFTMarketplace.deploy();
        await nftMarketplace.deployed();
    });

    it("Should list an NFT for sale", async function () {
        // Mint an NFT for the seller
        const tx = await mockNFT.connect(seller).mint(seller.address);
        const receipt = await tx.wait();
        const tokenId = receipt.events[0].args.tokenId;

        // Approve the marketplace to handle the NFT
        await mockNFT.connect(seller).approve(nftMarketplace.address, tokenId);

        // List the NFT
        const price = ethers.utils.parseEther("1"); // 1 ETH
        await nftMarketplace.connect(seller).listCard(mockNFT.address, tokenId, price);

        // Verify listing
        const listing = await nftMarketplace.cardToListingItem(1);
        expect(listing.tokenId.toString()).to.equal(tokenId.toString());
        expect(listing.listPrice.toString()).to.equal(price.toString());
        expect(listing.seller).to.equal(seller.address);
    });

    it("Should allow a buyer to purchase a listed NFT", async function () {
        // Mint and list an NFT
        const tx = await mockNFT.connect(seller).mint(seller.address);
        const receipt = await tx.wait();
        const tokenId = receipt.events[0].args.tokenId;

        await mockNFT.connect(seller).approve(nftMarketplace.address, tokenId);
        const price = ethers.utils.parseEther("1");
        await nftMarketplace.connect(seller).listCard(mockNFT.address, tokenId, price);

        // Buy NFT
        await nftMarketplace.connect(buyer).buyCard(1, { value: price });

        // Verify new ownership
        const newOwner = await mockNFT.ownerOf(tokenId);
        expect(newOwner).to.equal(buyer.address);

        // Verify listing is updated
        const listing = await nftMarketplace.cardToListingItem(1);
        expect(listing.owner).to.equal(buyer.address);
    });

    it("Should revert if the buyer sends incorrect Ether", async function () {
        // Mint and list an NFT
        const tx = await mockNFT.connect(seller).mint(seller.address);
        const receipt = await tx.wait();
        const tokenId = receipt.events[0].args.tokenId;

        await mockNFT.connect(seller).approve(nftMarketplace.address, tokenId);
        const price = ethers.utils.parseEther("1");
        await nftMarketplace.connect(seller).listCard(mockNFT.address, tokenId, price);

        // Try to buy with incorrect Ether amount
        await expect(
            nftMarketplace.connect(buyer).buyCard(1, { value: ethers.utils.parseEther("0.5") })
        ).to.be.revertedWith("Incorrect Ether value.");
    });
});
