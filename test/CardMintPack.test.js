const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CardMintPack Contract", function () {
  let cardMintPack, cardMintPackAddress, owner, user;

  describe("Deployment", function () {
    it("Should deploy the contract", async function () {
      const subscriptionId = 1;
      [owner, user] = await ethers.getSigners();
      const CardMintPack = await ethers.getContractFactory("CardMintPack");
      cardMintPack = await CardMintPack.deploy(subscriptionId);
      await cardMintPack.waitForDeployment();
      cardMintPackAddress = await cardMintPack.getAddress();

      expect(cardMintPackAddress).to.not.be.undefined;
    });
    it("Should set the correct values", async function () {
      const numWords = await cardMintPack.numWords();
      const baseUri = await cardMintPack.baseURI();
      expect(numWords).to.equal(5);
      expect(baseUri).to.equal(
        "https://green-manual-badger-37.mypinata.cloud/ipfs/bafybeidlvgplmk5rbamco3ccmz2by4vb5pgia6htesmnybk4comh7yibv4/"

      );
    });
  });
  describe("Minting NFTs from list of numbers", function () {
    it("Should batch mint 5 NFTs (list of 1 to 5)", async function () {
      const randomWords = [1, 2, 3, 4, 5];
      // Call batch mint
      const tx = await cardMintPack
        .connect(user)
        .batchMint(randomWords, user.address, 1);

      const receipt = await tx.wait();

      // Verify ownership and metadata for each token
      for (let i = 0; i < 5; i++) {
        const tokenId = i + 1;
        const tokenOwner = await cardMintPack.ownerOf(tokenId);
        const tokenMetadataURI = await cardMintPack.tokenURI(tokenId);

        expect(tokenOwner).to.equal(user.address);
        expect(tokenMetadataURI).to.include(`${randomWords[i] + 1}.json`);

      }
    });

    it("Should batch mint 5 NFTs(list of random numbers)", async function () {
      const randomWords = [
        12312313, 124001032, 41875917, 182849489298288, 1402380418501958,
      ];
      // Call batch mint
      const tx = await cardMintPack
        .connect(user)
        .batchMint(randomWords, user.address, 2);
      const receipt = await tx.wait();

      // Verify ownership and metadata for each token
      expected_tokenIds = [25 + 1, 40 + 1, 45 + 1, 0 + 1, 38 + 1]; // Calculated by randomWords % 48 +1

      for (let i = 5; i < 10; i++) {
        const tokenId = i + 1;
        const tokenOwner = await cardMintPack.ownerOf(tokenId);
        const tokenMetadataURI = await cardMintPack.tokenURI(tokenId);

        expect(tokenOwner).to.equal(user.address);
        expect(tokenMetadataURI).to.include(`${expected_tokenIds[i - 5]}.json`);

      }
    });

    it("Should revert if an array with not 5 elements is passed", async function () {
      const randomWords = [1, 2, 3, 4];
      await expect(
        cardMintPack.connect(user).batchMint(randomWords, user.address, 3)
      ).to.be.revertedWith("Expected 5 random numbers");
    });

    it("Should track the tokens minted by the user", async function () {
      const mintedTokens = await cardMintPack.getMintedTokens(user.address);
      expect(mintedTokens.length).to.equal(10);
    });
    it("Should emit CardMinted event", async function () {
      const randomWords = [1, 2, 3, 4, 5];
      await expect(
        cardMintPack.connect(user).batchMint(randomWords, user.address, 4)

      ).to.emit(cardMintPack, "CardMinted");
    });
  });
});
