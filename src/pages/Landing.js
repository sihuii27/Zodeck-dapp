import React, { useState, useEffect } from 'react';
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
  const [account, setAccount] = useState(props.account);

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

  // Fetch NFTs and listings when the account changes
  useEffect(() => {
    if (props.account) {
      setAccount(props.account);
      console.log('Fetching data...');
      //<Audio height="80" width="80" radius="9" color="green" ariaLabel="loading" wrapperStyle wrapperClass/>
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
      <div className="title-container">
        <h1 className="main-title">Zodeck, satisfy your card collecting itch here</h1>
        <button className="buy-card-packs-btn" onClick={handleBuyCardPacks}>
          Buy Card Packs
        </button>
      </div>
      <div className="title-container">
        {props.account ? (<h4 className="account">Connected to: {props.account}</h4>) : (<p></p>)}
      </div>

      {props.account ? (
        <>
          {/* Pass account and setListings to FetchMyListings */}
          <FetchMyNFT setMyNFT={setMyNFT} setloading={setloading} account={account} />

          <div className="listings-title-container">
            <h3 className="section-title">Your Collection</h3>
          </div>

          <div className="landing-listings">
            {myNFT.length > 0 ? (
              myNFT.map((nft, index) => (
                <div className="landing-card" key={index}>
                  <img
                    className="landing-card-image"
                    src={`https://bafybeic7rl5iyq4se7g65t2dwzolfquhm2t4dwryomdcmqouet2qyvkn3u.ipfs.w3s.link/${nft.cardIndex}.png`}
                    alt={`Card ${nft.tokenId}`}
                  />
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
          </div>

          <div className="landing-listings">
            {listings.length > 0 ? (
              listings.map((listing, index) => (
                <div className="landing-card" key={index}>
                  <img
                    className="landing-card-image"
                    src={`https://apricot-cheerful-alpaca-636.mypinata.cloud/ipfs/bafybeif4wde6i453uhad2bs63ay4nip3ml2q7x3jhffmo4lkd2z52uipmi/${listing.tokenId}.png`}
                    alt={`Card ${listing.tokenId}`}
                  />
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
