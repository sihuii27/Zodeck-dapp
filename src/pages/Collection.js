import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';
import FetchMyNFT from './FetchMyNFT';
import NftMarketPlace from './ListCard';

const Collection = (props) => {
    const navigate = useNavigate();

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
            {/* Account Status */}
            <div className="login-title">
                {props.account ? (
                    <>Connected to: {props.account}</>
                ) : (
                    <p>Please connect your account</p>
                )}
            </div>

            {props.account && (
                <>
                    <FetchMyNFT
                        setMyNFT={setMyNFT}
                        setloading={setLoading}
                        account={account}
                    />
                    <div className="collections-container">
                        <div className="title-container">
                            <h1 className="main-title">Collections</h1>
                        </div>

                        {/* NFT Cards */}
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
