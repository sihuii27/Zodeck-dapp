import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Collection.css';
import FetchMyNFT from './FetchMyNFT';
import NftMarketPlace from './ListCard';
import Description from './Description';
import { Tooltip, Button } from '@mui/material';

const Collection = (props) => {
    const navigate = useNavigate();
    const description = Description();

    // State Variables
    const [selectedCard, setSelectedCard] = useState(null);
    const [myNFT, setMyNFT] = useState([]);
    const [loading, setLoading] = useState(false);
    const [account, setAccount] = useState(props.account);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState(null);
    const [etherAmount, setEtherAmount] = useState('');

    // Handle closing the popup
    const handlePopupClose = () => {
        setPopupVisible(false);
        setEtherAmount('');
    };

    // Fetch NFTs when account changes
    useEffect(() => {
        if (props.account) {
            setAccount(props.account);
            console.log('Fetching data...');
            setMyNFT([]); // Clear current NFTs
            setLoading(true);
        }
    }, [props.account]);

    return (
        <div className="collection-wrapper">

            {props.account && (
                <>
                    <FetchMyNFT
                        setMyNFT={setMyNFT}
                        setloading={setLoading}
                        account={account}
                    />
                    <div className="collections-container">
                        {/* Account Status */}
                        <h4 className="login-title">
                            {props.account ? (
                                <>Connected to: {props.account}</>
                            ) : (
                                <p>Please connect your account</p>
                            )}
                        </h4>
                        <div className="title-container">
                            <h1 className="main-title">Collections</h1>
                        </div>

                        {/* NFT Cards */}
                        <div className="collections-content">
                            {myNFT.length > 0 ? (
                                myNFT.map((nft, index) => (
                                    <div className="collections-card" key={index}>
                                        <img
                                            className="card-image"
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
                    </div>
                </>
            )}

            {/* Popup Modal */}
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
        </div>
    );
};

export default Collection;
