import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import './Landing.css';
import NftMarketPlace from './ListCard';
import FetchMyListing from './FetchMyListings';
import FetchMyNFT from './FetchMyNFT';
import DeleteCard from './DeleteCard';

const Landing = (props) => {
  const navigate = useNavigate();

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState([null]);
  const [etherAmount, setEtherAmount] = useState('');
  const [listings, setListings] = useState([]);
  const [myNFT, setMyNFT] = useState([]);
  const [loading, setloading] = useState(false);

  const handleBuyCardPacks = () => {
    navigate('/cardpack');
  };
  
  const handleMarketplace = () => {
    navigate('/marketplace');
  };

  const handlePopupClose = () => {
    setPopupVisible(false); 
    setEtherAmount(''); 
  };

  const handleListSubmit = () => {
    console.log(`Listing card with ID ${selectedCardId} for ${etherAmount} ETH.`);
    handlePopupClose();
  };

  const collectionCards = [
    { id: 1, title: 'Card 1', image: '/logo512.png' },
    { id: 2, title: 'Card 2', image: 'https://via.placeholder.com/150' },
    { id: 3, title: 'Card 3', image: 'https://via.placeholder.com/150' },
    { id: 4, title: 'Card 4', image: 'https://via.placeholder.com/150' },
    { id: 5, title: 'Card 5', image: 'https://via.placeholder.com/150' },
  ];

  return (
    <div className="landing-container">
      <div className="title-container">
        <h1 className="main-title">Zodeck, satisfy your card collecting itch here</h1>
        <button className="buy-card-packs-btn" onClick={handleBuyCardPacks}>
          Buy Card Packs
        </button>
      </div>
      <div className="title-container">
        <h4 className="account">Connected to: {props.account}</h4>
      </div>
      {/* <button className="buy-card-packs-btn" onClick={handleMarketplace}>
        View my collection
      </button> */}
      {/* <a href="/collection" className="go-to-collection">
          View my collection &gt;&gt;
      </a> */}

      {/* Display if account is not null */}
      {props.account ? (
        <>
          {/* Pass account and setListings to FetchMyListings */}
          <FetchMyNFT setMyNFT={setMyNFT} />

          <div className="listings-title-container">
            <h3 className="section-title">Your Collection</h3>
          </div>

          <div className="card-listing">
            {myNFT.length > 0 ? (
              myNFT.map((nft, index) => (
                <div className="card-container" key={index}>
                  <img className="card-image"></img>
                  
                  <p className="card-title">{`Card Title ${nft.tokenId}`}</p>
                  <button
                    className="hover-link"
                    onClick={() => {
                      console.log("Selected tokenId:", nft.tokenId);
                      setSelectedCardId(nft.tokenId);
                      setPopupVisible(true);
                    }}
                  >
                    List to Marketplace
                  </button>
                
                </div>
              ))
            ) : (
              <p>No collection available</p>
            )}
          </div>
        </>
      ) : (
        <p>Please connect your wallet to view collection.</p>
      )}
      
      {/* Popup */}
      {isPopupVisible && (
        <div className="popup-overlay">
          <div className="popup-container">
            <h3>List Card to Marketplace</h3>
            <p>Card ID: {selectedCardId.toString()}</p>
            <input
              type="number"
              min="0"
              placeholder="Enter Ether amount"
              value={etherAmount}
              onChange={(e) => setEtherAmount(e.target.value)}
              className="popup-input"
            />
            <div className="popup-buttons">
            {console.log("Selected Card ID:", selectedCardId)}
            {console.log("Price Tag (Ether):", etherAmount)}
        
              <NftMarketPlace tokenId={selectedCardId} priceTag={etherAmount} closePopup={handlePopupClose}/>
              <button className="popup-cancel-btn" onClick={handlePopupClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Display if account is not null */}
      {props.account ? (
        <>
          {/* Pass account and setListings to FetchMyListings */}
          <FetchMyListing setListings={setListings} />

          <div className="listings-title-container">
            <h3 className="section-title">Your Listings</h3>
          </div>

          <div className="marketplace-landing-listings">
            {listings.length > 0 ? (
              listings.map((listing, index) => (
                <div className="marketplace-landing-card" key={index}>
                  <div className="marketplace-landing-card-image"><img src={listing.uri} alt="Description" />
                  </div>
                  <p className="marketplace-landing-card-price">
                    {`Price: ${ethers.formatUnits(listing.price, 'ether')} ETH`}
                  </p>
                  <p className="marketplace-landing-card-title">
                    {`Card Title ${listing.tokenId}`}
                  </p>
                  <div className="landing-listing-btn-container">
                    <DeleteCard tokenId={listing.tokenId} />
                  </div>
                </div>
              ))
            ) : (
              <p>No listings available</p>
            )}
          </div>
        </>
      ) : (
        <p>Please connect your wallet to view listings.</p>
      )}
    </div>
  );
};

export default Landing;
