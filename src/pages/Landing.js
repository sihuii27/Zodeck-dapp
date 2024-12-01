import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  const handleBuyCardPacks = () => {
    navigate('/cardpack');
  };

  return (
    <>
      <div className="landing-container">
        <div className="title-container">
          <h1 className="main-title">Zodeck, satisfy your card collecting itch here</h1>
          <button className="buy-card-packs-btn" onClick={handleBuyCardPacks}>
            Buy Card Packs
          </button>
        </div>
        <div className="listings-title-container">
          <h2 className="section-title">Your Card Listing</h2>
        </div>
        <div className="card-listing">
          <div className="card-placeholder"></div>
          <div className="card-placeholder"></div>
          <div className="card-placeholder"></div>
          <div className="card-placeholder"></div>
          <div className="card-placeholder"></div>
        </div>
        
    
          {/* Listings section title and Go to Marketplace link */}
          <div className="listings-title-container">
            <h2 className="section-title">Listings you may be interested in</h2>
            <a href="/marketplace" className="go-to-marketplace">
              Go to Marketplace &gt;&gt;
            </a>
          </div>
    
          <div className="marketplace-listings">
            {[
              { price: '1.40 ETH', title: 'Your Brain social media addiction' },
              { price: '1.50 ETH', title: 'Land damaged by me and nature' },
              { price: '1.32 ETH', title: 'Aurora Wave Dark Purple Magma Tone' },
              { price: '1.86 ETH', title: "Ancient coins from China's past" },
              { price: '1.93 ETH', title: 'Yellow sea coral preserved by me' },
            ].map((listing, index) => (
              <div className="marketplace-card" key={index}>
                <div className="card-image"></div>
                <p className="card-price">{listing.price}</p>
                <p className="card-title">{listing.title}</p>
                <button className="place-bid-btn">Place Your Bid</button>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

export default Landing;