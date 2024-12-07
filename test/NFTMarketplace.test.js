const { expect } = require("chai");
const { ethers } = require("hardhat");
require("@nomicfoundation/hardhat-chai-matchers");

describe("NFTPlace", function () {
  let nftMarketplace, owner, addr1, addr2;

  beforeEach(async function () {
    const NFTMarketplace = await ethers.getContractFactory("NFTplace");
    [owner, addr1, addr2] = await ethers.getSigners();
    nftMarketplace = await NFTMarketplace.deploy();
    await nftMarketplace.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await nftMarketplace.getOwner()).to.equal(owner.address);
    });

    it("Should initialize with the correct listing price", async function () {
        const listingPrice = ethers.parseEther("0.0001");
        expect(await nftMarketplace.getListingPrice()).to.equal(listingPrice);
    });
  });

  describe("Token Creation", function () {
    it("Should create a new token and listing", async function () {
      const tokenURI = "https://example.com/token1";
      const price = ethers.parseEther("1");

      await nftMarketplace.connect(addr1).createToken(tokenURI, {
        value: ethers.parseEther("0.0001"),
      });

      const listing = await nftMarketplace.fetchListingMarketplace();
      console.log(listing)
      console.log(listing[0].price)
      expect(listing.length).to.equal(1);
      expect(Number(listing[0][0])).to.equal(1);
      expect(listing[0][3]).to.equal(price);
    });

    it("Should fail if listing price is incorrect", async function () {
      const tokenURI = "https://example.com/token1";
      const price = ethers.parseEther("1");

      await expect(
        nftMarketplace.connect(addr1).createToken(tokenURI, {
          value: ethers.parseEther("0.0002"), // Incorrect listing price
        })
      ).to.be.revertedWith("Ether sent must be equal to listing price");
    });
  });

  describe("Market Sales", function () {
    it("Should allow users to purchase a listed NFT", async function () {
      const tokenURI = "https://example.com/token1";
      const price = ethers.parseEther("1");

      await nftMarketplace.connect(addr1).createToken(tokenURI, {
        value: ethers.parseEther("0.0001"),
      });

      await nftMarketplace.connect(addr2).purchaseCard(1, {
        value: price,
      });

      const listings = await nftMarketplace.fetchListingMarketplace();
      expect(listings.length).to.equal(0); // Token should no longer be listed

      const myNFTs = await nftMarketplace.connect(addr2).fetchMyNFTs();
      expect(myNFTs.length).to.equal(1);
      expect(myNFTs[0].tokenId).to.equal(1);
    });

    it("Should fail if the buyer does not send the correct price", async function () {
      const tokenURI = "https://example.com/token1";
      const price = ethers.parseEther("1");

      await nftMarketplace.connect(addr1).createToken(tokenURI, {
        value: ethers.parseEther("0.0001"),
      });

      await expect(
        nftMarketplace.connect(addr2).purchaseCard(1, {
          value: ethers.parseEther("0.5"), // Insufficient payment
        })
      ).to.be.revertedWith("Please submit the asking price in order to complete the purchase");
    });
  });

  describe("Fetching Listings", function () {
    it("Should fetch all listed NFTs", async function () {
      const tokenURI1 = "https://example.com/token1";
      const tokenURI2 = "https://example.com/token2";
      const price = ethers.parseEther("1");

      await nftMarketplace.connect(addr1).createToken(tokenURI1, {
        value: ethers.parseEther("0.0001"),
      });
      await nftMarketplace.connect(addr1).createToken(tokenURI2, {
        value: ethers.parseEther("0.0001"),
      });

      const listings = await nftMarketplace.fetchListingMarketplace();
      expect(listings.length).to.equal(2);
    });

    it("Should fetch NFTs owned by a user", async function () {
      const tokenURI = "https://example.com/token1";
      const price = ethers.parseEther("1");

      await nftMarketplace.connect(addr1).createToken(tokenURI, {
        value: ethers.parseEther("0.0001"),
      });
      await nftMarketplace.connect(addr2).purchaseCard(1, {
        value: price,
      });

      const myNFTs = await nftMarketplace.connect(addr2).fetchMyNFTs();
      expect(myNFTs.length).to.equal(1);
      expect(myNFTs[0].tokenId).to.equal(1);
    });

    it("Should fetch NFTs listed by a user", async function () {
      const tokenURI = "https://example.com/token1";
      const price = ethers.parseEther("1");

      await nftMarketplace.connect(addr1).createToken(tokenURI, {
        value: ethers.parseEther("0.0001"),
      });

      const myListings = await nftMarketplace.connect(addr1).fetchItemsListed();
      expect(myListings.length).to.equal(1);
      expect(myListings[0].tokenId).to.equal(1);
    });
  });

  describe("Updating Listing Price", function () {
    it("Should allow the owner to update the listing price", async function () {
      const newPrice = ethers.parseEther("0.0002");

      await nftMarketplace.connect(owner).updateListingPrice(newPrice);
      expect(await nftMarketplace.getListingPrice()).to.equal(newPrice);
    });

    it("Should fail if a non-owner tries to update the listing price", async function () {
      const newPrice = ethers.parseEther("0.0002");

      await expect(
        nftMarketplace.connect(addr1).updateListingPrice(newPrice)
      ).to.be.revertedWith("Only marketplace owner can update listing price.");
    });
  });
//   describe("Remove Listing Price", function () {
//     it("Should allow the owner to remove a listing before it is sold", async function () {
//         const tokenURI = "https://example.com/token1";
//         const price = ethers.parseEther("1");
//         const listingPrice = ethers.parseEther("0.0001");
//         await nftMarketplace.connect(addr1).createToken(tokenURI, { value: listingPrice });
//         const tokenId = 1;

//         let listing = await nftMarketplace.fetchListingMarketplace();
//         expect(listing.length).to.equal(1);

//         // Remove the listing (using the wrapper function for testing)
//         await nftMarketplace.connect(addr1).removeListing(tokenId,price);

//         // Check the listing is removed
//         listing = await nftMarketplace.fetchListingMarketplace();
//         expect(listing.length).to.equal(0);

//         // Check token ownership is returned to the seller
//         const tokenOwner = await nftMarketplace.ownerOf(tokenId);
//         expect(tokenOwner).to.equal(addr1.address);
//         });
//   });
});
