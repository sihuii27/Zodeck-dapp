const { expect } = require("chai");
const { ethers } = require("hardhat");
require("@nomicfoundation/hardhat-chai-matchers");

describe("CardMintPack", function () {
  let nftMarketplace, owner, addr1, addr2;

  beforeEach(async function () {
    const NFTMarketplace = await ethers.getContractFactory("CardMintPack");
    [owner, addr1, addr2] = await ethers.getSigners();
    nftMarketplace = await NFTMarketplace.deploy(37047386916970814802263160841961854059724743253404548406195284417020824902327n);
    await nftMarketplace.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await nftMarketplace.getContractOwner()).to.equal(owner.address);
    });

    it("Should get correct price to list a card", async function () {
      const listingPrice = ethers.parseEther("0.0001");
      expect(await nftMarketplace.getListingPrice()).to.equal(listingPrice);
    });

  });

  describe("Token Creation", function () {
    it("Create Token", async function () {
      //create one token for owner address
      const createtoken = await nftMarketplace.createToken('https://example.com', owner, 1);
      await createtoken.wait();
      const fetchNFT = await nftMarketplace.fetchMyNFTs();
      const tokenId = fetchNFT[0][0];
      expect(tokenId).to.equal(1n);
    });
  });

  describe("NFT card listing", function () {
    it("Users can list card to the NFT marketplace", async function () {
      //create one token for owner address
      const createtoken = await nftMarketplace.createToken('https://example.com', owner, 1);
      await createtoken.wait();
      //list a card of token id 1 and 0.0001ETH
      const listprice = ethers.parseEther("0.0001");
      await nftMarketplace.listCard(1n, ethers.parseEther("0.0001"),{ value: listprice });
      const fetchNFT = await nftMarketplace.fetchMyNFTs();
      //deep comparison: checks if two objects have the same values (to.deep.equal)
      //nft collection should not have any cards since it has been listed to marketplace
      expect(fetchNFT.length).to.equal(0);
      expect
    });

    it("All listed cards will be shown/viewed on the NFT marketplace.", async function () {
      //create two tokens one for owner address and the other for addr1 address
      const createtoken1 = await nftMarketplace.createToken('https://example.com', owner, 1);
      await createtoken1.wait();
      const createtoken2 = await nftMarketplace.createToken('https://example1.com', addr1, 2);
      await createtoken2.wait();
      //list a card of token id 1 and 0.0001ETH
      const listprice = ethers.parseEther("0.0001");
      await nftMarketplace.listCard(1n, ethers.parseEther("0.0001"),{value: listprice});
      //list a card of token id 2 and 0.0002ETH
      await nftMarketplace.connect(addr1).listCard(2n, ethers.parseEther("0.0002"),{value: listprice});
      const fetchListings = await nftMarketplace.fetchListingMarketplace();
      //check how many listings are there in marketplace
      expect(fetchListings.length).to.equal(2);
      //console.log("Fetch all listings", fetchListings);
      //after owner list a card, the card will be listed on the nft marketplace 
      owner_listing = fetchListings[0];
      expect(owner_listing.owner).to.equal(nftMarketplace.target);
      expect(owner_listing.price).to.equal(ethers.parseEther("0.0001"));
      expect(owner_listing.sold).to.equal(false);
      expect(owner_listing.tokenId).to.equal('1');

      //after addr1 account list a card, the card will be listed on the nft marketplace
      addr1_listing = fetchListings[1];
      expect(addr1_listing.owner).to.equal(nftMarketplace.target);
      expect(addr1_listing.price).to.equal(ethers.parseEther("0.0002"));
      expect(addr1_listing.sold).to.equal(false);
      expect(addr1_listing.tokenId).to.equal('2');
    });

    it("Users can only view cards they have listed in their listings", async function () {
      const createtoken = await nftMarketplace.createToken('https://example.com', owner, 1);
      await createtoken.wait();
      //list a card of token id 1 and 0.0001ETH
      const listprice = ethers.parseEther("0.0001");
      await nftMarketplace.listCard(1n, ethers.parseEther("0.0001"),{ value: listprice });
      const fetchListings = await nftMarketplace.fetchItemsListed();
      //check how many listings are there in my listings
      expect(fetchListings.length).to.equal(1);
      //access the listing items
      const listdetails = fetchListings[0];
      //after listing the owner of the card will belong to the nft marketplace
      expect(listdetails.owner).to.equal(nftMarketplace.target);
      //check if listing status is still false since it has not been sold
      expect(listdetails.sold).to.equal(false);
    });
  });

  describe("Purchase a NFT card", function () {
    it("Users should be able to buy a card from the listings", async function () {
      console.log(addr1.address);
      console.log(owner.address);
      const price = ethers.parseEther("0.0001");
      //check if addr1 has enough ethers to purchase
      const createtoken = await nftMarketplace.createToken('https://example.com', owner, 1);
      await createtoken.wait();
      const listprice = ethers.parseEther("0.0001");
      await nftMarketplace.listCard(1n, price , { value: listprice });
      const fetchListings = await nftMarketplace.fetchItemsListed();
      const pricetag = fetchListings[0].price;
      console.log(pricetag);
      console.log("My Listing:",fetchListings);
      await nftMarketplace.connect(addr2).purchaseCard(1n, { value: price });
      const addr2NFT = await nftMarketplace.connect(addr2).fetchMyNFTs();
      expect(addr2NFT.length).to.equal(1);
      expect(addr2NFT[0].owner).to.equal(addr2.address);
      expect(addr2NFT[0].owner).to.equal(addr2.address);
      console.log("My NFTs after purchase:",addr2NFT);
      //await purchase.wait();
    });
  });

});