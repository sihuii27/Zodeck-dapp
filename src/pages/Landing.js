import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import './Landing.css';
import NftMarketPlace from './ListCard';
import FetchMyListing from './FetchMyListings';
import FetchMyNFT from './FetchMyNFT';

const Landing = (props) => {
  const navigate = useNavigate();

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [etherAmount, setEtherAmount] = useState('');
  const [listings, setListings] = useState([]);
  const [myNFT, setMyNFT] = useState([]);

  const handleBuyCardPacks = () => {
    navigate('/cardpack');
  };
  
  const handleMarketplace = () => {
    navigate('/marketplace');
  };

  const handleListToMarketplace = (cardId) => {
    console.log(`Listing card with ID ${cardId} to marketplace.`);
    setSelectedCardId(cardId);
    setPopupVisible(true);
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
                  
                  <p className="card-title">{`Card Title ${index + 1}`}</p>
                  <button
                    className="hover-link"
                    onClick={() => handleListToMarketplace(index)}
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
      {/* <div className="card-listing">
        {collectionCards.map((card) => (
          <div className="card-container" key={card.id}>
            <img src={card.image} alt={card.title} className="card-image" />
            <div className="card-overlay">
              <p className="card-title">{card.title}</p>
              <button
                className="hover-link"
                onClick={() => handleListToMarketplace(card.id)}
              >
                List to Marketplace
              </button>
            </div>
          </div>
        ))}
      </div> */}
      
      {/* Popup */}
      {isPopupVisible && (
        <div className="popup-overlay">
          <div className="popup-container">
            <h3>List Card to Marketplace</h3>
            <p>Card ID: {selectedCardId}</p>
            {/* <input
              type="number"
              placeholder="Enter Ether amount"
              value={etherAmount}
              onChange={(e) => setEtherAmount(e.target.value)}
              className="popup-input"
            /> */}
            <div className="popup-buttons">
              <NftMarketPlace />
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
                  <div className="marketplace-landing-card-image"></div>
                  <p className="marketplace-landing-card-price">
                    {`Price: ${ethers.formatUnits(listing.price, 'ether')} ETH`}
                  </p>
                  <p className="marketplace-landing-card-title">
                    {`Card Title ${index + 1}`}
                  </p>
                  <div className="landing-listing-btn-container">
                    <button className="delete-listing-btn">Delete Listing</button>
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
