// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract NFTMarketplace is ReentrancyGuard{

    // Track the current cardItemId
    uint private cardItemCounter;

    // Define the Listing struct
    struct Listing {
        uint cardItemId;    // Unique identifier for the card item
        address nftAddress; // Address of the NFT contract
        uint tokenId;       // Token ID of the NFT being listed
        address payable seller; // Address of the seller
        address payable owner;  // Address of the current owner of the NFT (after transfer)
        uint listPrice;     // Price at which the card is listed for sale
    }

    // Mapping from cardItemId to Listing
    mapping(uint => Listing) public cardToListingItem;

    // Event for transferring cards
    event CardTransferred(address indexed seller, address indexed buyer, uint tokenId);

    // Function to list a card for sale
    function listCard(address nftAddress, uint tokenId, uint price) public {
        // Increment the cardItemId manually
        cardItemCounter++;
        uint cardItemId = cardItemCounter;

        // Create a new listing and store it in the mapping
        cardToListingItem[cardItemId] = Listing({
            cardItemId: cardItemId,
            nftAddress: nftAddress,
            tokenId: tokenId,
            seller: payable(msg.sender),
            owner: payable(address(0)),
            listPrice: price
        });

        // Transfer the NFT to the contract for safekeeping
        IERC721(nftAddress).transferFrom(msg.sender, address(this), tokenId);

        // Emit an event that a card has been listed for sale
        emit CardTransferred(msg.sender, address(0), tokenId);
    }

    // Function to buy a listed card
    function buyCard(uint cardItemId) public payable {
        // Retrieve the listing using the cardItemId
        Listing storage listing = cardToListingItem[cardItemId];
        
        // Check if the price is correct
        require(msg.value == listing.listPrice, "Ether sent does not meet listed card price.");

        // Transfer Ether to the seller
        listing.seller.transfer(msg.value);

        // Transfer the card to the buyer
        IERC721(listing.nftAddress).transferFrom(address(this), msg.sender, listing.tokenId);

        // Update the card ownership
        listing.owner = payable(msg.sender);

        // Emit an event for the transfer
        emit CardTransferred(listing.seller, msg.sender, listing.tokenId);
    }
    
    // remove card listing if user does not want to sell
    function cancelListing(uint cardItemId) public {
        // Retrieve listing using cardItemId
        Listing storage listing = cardToListingItem[cardItemId];

        // ensure that the seller is the one that cancel the listing not the buyers
        require(msg.sender == listing.seller, "Only card sellers are allowed to cancel listing");

        //if card NFT has a new owner, owner cannot remove listing
        require(listing.owner == address(0), "Card already has a new owner unable to delete listing");

        // Transfer the card back to the card owner == msg.sender
        IERC721(listing.nftAddress).transferFrom(address(this), msg.sender, listing.tokenId);

        //remove listing from Marketplace
        delete cardToListingItem[cardItemId];
    }
}