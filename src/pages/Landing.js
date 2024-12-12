import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import './Landing.css';
import NftMarketPlace from './ListCard';
import FetchMyListing from './FetchMyListings';
import FetchMyNFT from './FetchMyNFT';
import DeleteCard from './DeleteCard';
import Description from './Description';
import { Tooltip, Button } from '@mui/material';

const Landing = (props) => {
  const navigate = useNavigate();

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState([null]);
  const [etherAmount, setEtherAmount] = useState('');
  const [listings, setListings] = useState([]);
  const [myNFT, setMyNFT] = useState([]);
  const [loading, setloading] = useState(false);
  const [account, setAccount] = useState(props.account);
  const description = Description();

  const handleBuyCardPacks = () => {
    navigate('/cardpack');
  };

  const handleCollection = () => {
    navigate('/collection');
  };

  const handleMarketplace = () => {
    navigate('/marketplace');
  };

  const handlePopupClose = () => {
    setPopupVisible(false);
    setEtherAmount('');
  };

  // Fetch NFTs and listings when the account changes
  useEffect(() => {
    if (props.account) {
      setAccount(props.account);
      console.log('Fetching data...');
      //set it to be empty
      setMyNFT([]);
      //set it to be empty
      setListings([]);
      setloading(true);
    }
  }, [props.account]);

  return (
    <div className="landing-container">
      {/* {loading && <div className="loading-indicator">Loading...</div>} */}
      <div className="header-container">
        {props.account ? (<h4 className="account">Connected to: {props.account}</h4>) : (<p></p>)}
      </div>

      {props.account ? (
        <>
          {/* Pass account and setListings to FetchMyListings */}
          <FetchMyNFT setMyNFT={setMyNFT} setloading={setloading} account={account} />
          <div className="pack-container">
            <p className="main-title">Zodeck, satisfy your card collecting itch here</p>
            <button className="buy-card-packs-btn" onClick={handleBuyCardPacks}>
              Buy Card Packs
            </button>
          </div>
          <div className="listings-title-container">
            <h3 className="section-title">Your Collection</h3>
            <button className="go-marketplace-btn" onClick={handleCollection}>
              View more...
            </button>
          </div>

          <div className="landing-collections">
            {myNFT.length > 0 ? (
              myNFT.map((nft, index) => (
                <div className="landing-card" key={index}>
                  <img
                    className="landing-card-image"
                    src={`https://green-manual-badger-37.mypinata.cloud/ipfs/bafybeifd5ackizs5fyc6pe7cghazwkqf7docpk6tetuq5dfkvrrnate3be/${nft.cardIndex}.png`}
                    alt={`Card ${nft.tokenId}`}
                  />
                  <p className="card-title">{description[nft.cardIndex]?.name || 'Loading...'}</p>
                  <Tooltip placement="top"
                    title={description[nft.cardIndex]?.description || 'Loading...'} // Display the card's description in the Tooltip
                    arrow
                  >
                    <Button variant="outlined" size="small" sx={{ marginBottom: '5px' }}>View Description</Button>
                  </Tooltip>
                  <button
                    className="hover-link"
                    onClick={() => {
                      console.log("Selected tokenId:", nft.tokenId);
                      setSelectedCardId(description[nft.cardIndex]?.name || 'Loading...');
                      setPopupVisible(true);
                    }}
                  >
                    List to Marketplace
                  </button>
                </div>
              ))
            ) : (
              <p className="section-text">No collection available</p>
            )}
          </div>
        </>
      ) : (
        <p className="section-no-connect">Please connect your wallet to view collection.</p>
      )}

      {/* Popup */}
      {isPopupVisible && (
        <div className="popup-overlay">
          <div className="popup-container">
            <h3>List Card to Marketplace</h3>
            <p>{selectedCardId.toString()}</p>
            <input
              type="number"
              min="0"
              placeholder="Enter Ether amount"
              value={etherAmount}
              onChange={(e) => setEtherAmount(e.target.value)}
              className="popup-input"
            />
            <div className="popup-buttons">
              <NftMarketPlace tokenId={selectedCardId} priceTag={etherAmount} closePopup={handlePopupClose} />
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
          <FetchMyListing setListings={setListings} setloading={setloading} account={account} />

          <div className="listings-title-container">
            <h3 className="section-title">Your Listings</h3>
            <button className="go-marketplace-btn" onClick={handleMarketplace}>
              View more...
            </button>
          </div>

          <div className="landing-listings">
            {listings.length > 0 ? (
              listings.map((listing, index) => (
                <div className="landing-card" key={index}>
                  <img
                    className="landing-card-image"
                    src={`https://green-manual-badger-37.mypinata.cloud/ipfs/bafybeifd5ackizs5fyc6pe7cghazwkqf7docpk6tetuq5dfkvrrnate3be/${listing.cardIndex}.png`}
                    alt={`Card ${listing.tokenId}`}
                  />
                  <p className="card-title">{description[listing.cardIndex]?.name || 'Loading...'}</p>
                  <p className="marketplace-landing-card-price">
                    {`Price: ${ethers.formatUnits(listing.price, 'ether')} ETH`}
                  </p>
                  <Tooltip placement="top"
                    title={description[listing.cardIndex]?.description || 'Loading...'} // Display the card's description in the Tooltip
                    arrow
                  >
                    <Button variant="outlined" size="small" sx={{ marginBottom: '5px' }}>View Description</Button>
                  </Tooltip>
                  <DeleteCard tokenId={listing.tokenId} />
                </div>
              ))
            ) : (
              <p className="section-text">No listings available</p>
            )}
          </div>
        </>
      ) : (
        <p className="section-no-connect">Please connect your wallet to view listings.</p>
      )}
    </div>
  );
};

export default Landing;
