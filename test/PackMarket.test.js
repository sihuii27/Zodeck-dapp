const { expect } = require("chai");
const { ethers } = require("hardhat");
require("@nomicfoundation/hardhat-chai-matchers");

describe("PackMarket Contract", function () {
    let PackMarket, packMarket, owner, addr1, addr2;

    beforeEach(async function () {
        PackMarket = await ethers.getContractFactory("PackMarket");
        [owner, addr1, addr2] = await ethers.getSigners();
        packMarket = await PackMarket.deploy();
        await packMarket.waitForDeployment();
    });

    describe("Deployment", function () {
        it("Should set the correct initial values", async function () {
        expect(await packMarket.packPrice()).to.equal(ethers.parseEther("0.0001"));
        expect(await packMarket.getPacksAvailable()).to.equal(BigInt(100));
        expect(await packMarket.getTotalPacksSold()).to.equal(BigInt(0));
        });
    });

    describe("Purchase Pack", function () {
        it("Should allow purchasing a pack with exact payment", async function () {
        await packMarket.connect(addr1).purchasePack({ value: ethers.parseEther("0.0001") });
        expect(await packMarket.totalPacksSold()).to.equal(BigInt(1));
        expect(await packMarket.packsAvailable()).to.equal(BigInt(99));
        });

        it("Should emit PackPurchased event on successful purchase", async function () {
        await expect(packMarket.connect(addr1).purchasePack({ value: ethers.parseEther("0.0001") }))
            .to.emit(packMarket, "PackPurchased");
        });
        it("Should revert if payment is incorrect", async function () {
            await expect(
                packMarket.connect(addr1).purchasePack({ value: ethers.parseEther("0.0002") })
            ).to.be.revertedWith("Incorrect payment amount");
        });

        it("Should revert if no packs are available", async function () {
            await packMarket.updatePacksAvailable(0);
            await expect(
                packMarket.connect(addr1).purchasePack({ value: ethers.parseEther("0.0001") })
            ).to.be.revertedWith("All card packs are currently sold out");
        });
    });

    describe("Update Packs Available", function () {
        it("Should allow the owner to update the packs available", async function () {
            await packMarket.updatePacksAvailable(200);
            expect(await packMarket.packsAvailable()).to.equal(200);
        });
    });

    describe("Update Pack Price", function () {
        it("Should allow the owner to update the pack price", async function () {
            await packMarket.updatePackPrice(ethers.parseEther("0.0002"));
            expect(await packMarket.packPrice()).to.equal(ethers.parseEther("0.0002"));
        });
    });
});

