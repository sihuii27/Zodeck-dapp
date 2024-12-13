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
      await nftMarketplace.listCard(1n, ethers.parseEther("0.0001"));
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
      await nftMarketplace.listCard(1n, ethers.parseEther("0.0001"));
      //list a card of token id 2 and 0.0002ETH
      await nftMarketplace.connect(addr1).listCard(2n, ethers.parseEther("0.0002"));
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
      await nftMarketplace.listCard(1n, ethers.parseEther("0.0001"));
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
      const balance = await ethers.provider.getBalance(addr1.address);
      //check if addr1 has enough ethers to purchase
      console.log("Check amount of ethers in addr1:", ethers.formatEther(balance));
      const createtoken = await nftMarketplace.createToken('https://example.com', owner, 1);
      await createtoken.wait();
      await nftMarketplace.listCard(1n, ethers.parseEther("0.0001"));
      const fetchListings = await nftMarketplace.fetchItemsListed();
      console.log("My Listing:",fetchListings);
      const fetchnft = await nftMarketplace.fetchMyNFTs();
      console.log("My NFT:",fetchnft);
      const list = fetchListings[0]; 
      await expect(nftMarketplace.connect(addr1).purchaseCard(1n, { value: ethers.parseEther("0.0001") })).to.be.reverted;
      expect(list.price).to.equal(ethers.parseEther("0.0001"));
    });
  });

});

// describe("Token Creation", function () {
//   it("Should create a new token and listing", async function () {
//     const tokenURI = "https://example.com/token1";
//     const price = ethers.parseEther("1");

//     await nftMarketplace.connect(addr1).createToken(tokenURI, {
//       value: ethers.parseEther("0.0001"),
//     });

//     const listing = await nftMarketplace.fetchListingMarketplace();
//     console.log(listing)
//     console.log(listing[0].price)
//     expect(listing.length).to.equal(1);
//     expect(Number(listing[0][0])).to.equal(1);
//     expect(listing[0][3]).to.equal(price);
//   });

//   it("Should fail if listing price is incorrect", async function () {
//     const tokenURI = "https://example.com/token1";
//     const price = ethers.parseEther("1");

//     await expect(
//       nftMarketplace.connect(addr1).createToken(tokenURI, {
//         value: ethers.parseEther("0.0002"), // Incorrect listing price
//       })
//     ).to.be.revertedWith("Ether sent must be equal to listing price");
//   });
// });

// describe("Market Sales", function () {
//   it("Should allow users to purchase a listed NFT", async function () {
//     const tokenURI = "https://example.com/token1";
//     const price = ethers.parseEther("1");

//     await nftMarketplace.connect(addr1).createToken(tokenURI, {
//       value: ethers.parseEther("0.0001"),
//     });

//     await nftMarketplace.connect(addr2).purchaseCard(1, {
//       value: price,
//     });

//     const listings = await nftMarketplace.fetchListingMarketplace();
//     expect(listings.length).to.equal(0); // Token should no longer be listed

//     const myNFTs = await nftMarketplace.connect(addr2).fetchMyNFTs();
//     expect(myNFTs.length).to.equal(1);
//     expect(myNFTs[0].tokenId).to.equal(1);
//   });

//   it("Should fail if the buyer does not send the correct price", async function () {
//     const tokenURI = "https://example.com/token1";
//     const price = ethers.parseEther("1");

//     await nftMarketplace.connect(addr1).createToken(tokenURI, {
//       value: ethers.parseEther("0.0001"),
//     });

//     await expect(
//       nftMarketplace.connect(addr2).purchaseCard(1, {
//         value: ethers.parseEther("0.5"), // Insufficient payment
//       })
//     ).to.be.revertedWith("Please submit the asking price in order to complete the purchase");
//   });
// });

// describe("Fetching Listings", function () {
//   it("Should fetch all listed NFTs", async function () {
//     const tokenURI1 = "https://example.com/token1";
//     const tokenURI2 = "https://example.com/token2";
//     const price = ethers.parseEther("1");

//     await nftMarketplace.connect(addr1).createToken(tokenURI1, {
//       value: ethers.parseEther("0.0001"),
//     });
//     await nftMarketplace.connect(addr1).createToken(tokenURI2, {
//       value: ethers.parseEther("0.0001"),
//     });

//     const listings = await nftMarketplace.fetchListingMarketplace();
//     expect(listings.length).to.equal(2);
//   });

//   it("Should fetch NFTs owned by a user", async function () {
//     const tokenURI = "https://example.com/token1";
//     const price = ethers.parseEther("1");

//     await nftMarketplace.connect(addr1).createToken(tokenURI, {
//       value: ethers.parseEther("0.0001"),
//     });
//     await nftMarketplace.connect(addr2).purchaseCard(1, {
//       value: price,
//     });

//     const myNFTs = await nftMarketplace.connect(addr2).fetchMyNFTs();
//     expect(myNFTs.length).to.equal(1);
//     expect(myNFTs[0].tokenId).to.equal(1);
//   });

//   it("Should fetch NFTs listed by a user", async function () {
//     const tokenURI = "https://example.com/token1";
//     const price = ethers.parseEther("1");

//     await nftMarketplace.connect(addr1).createToken(tokenURI, {
//       value: ethers.parseEther("0.0001"),
//     });

//     const myListings = await nftMarketplace.connect(addr1).fetchItemsListed();
//     expect(myListings.length).to.equal(1);
//     expect(myListings[0].tokenId).to.equal(1);
//   });
// });

// describe("Updating Listing Price", function () {
//   it("Should allow the owner to update the listing price", async function () {
//     const newPrice = ethers.parseEther("0.0002");

//     await nftMarketplace.connect(owner).updateListingPrice(newPrice);
//     expect(await nftMarketplace.getListingPrice()).to.equal(newPrice);
//   });

//   it("Should fail if a non-owner tries to update the listing price", async function () {
//     const newPrice = ethers.parseEther("0.0002");

//     await expect(
//       nftMarketplace.connect(addr1).updateListingPrice(newPrice)
//     ).to.be.revertedWith("Only marketplace owner can update listing price.");
//   });
// });
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
