import React, { useState, useEffect } from 'react';
import './Collection.css';
import { useNavigate } from 'react-router-dom';
import FetchMyNFT from './FetchMyNFT';
import ListMarketplace from './listCardMarket';
import { ethers } from 'ethers';

const Collection = (props) => {
    const navigate = useNavigate();
    const [selectedCard, setSelectedCard] = useState(null);
    const [myNFT, setMyNFT] = useState([]);
    const [loading, setloading] = useState(false);
    const [account, setAccount] = useState(props.account);

    // Fetch NFTs and listings when the account changes
    useEffect(() => {
        if (props.account) {
            setAccount(props.account);
            console.log('Fetching data...');
            //set it to be empty
            setMyNFT([]);
            setloading(true);
        }
    }, [props.account]);

    return (
        <>
            <div className='login-title'>{props.account != null ? (<>Connected to: {props.account}</>) : (<><p></p></>)}</div>

            <div className='collections-container'>
                <div className='title-container'>
                    <h1 className="main-title">Collections</h1>
                </div>
                <FetchMyNFT setMyNFT={setMyNFT} setloading={setloading} account={account} />
                <div className='collections-content'>
                    {myNFT.length > 0 ? (
                        myNFT.map((nft, index) => (
                            <div className="collections-card" key={index}>
                                <img
                                    className="marketplace-landing-card-image"
                                    src={`https://bafybeic7rl5iyq4se7g65t2dwzolfquhm2t4dwryomdcmqouet2qyvkn3u.ipfs.w3s.link/${nft.cardIndex}.png`}
                                    alt={`Card ${nft.tokenId}`}
                                />
                                <p className="card-title">{`Card Title ${nft.tokenId}`}</p>
                                <ListMarketplace tokenId={nft.tokenId} priceTag={nft.price.toString()}/>
                            </div>
                        ))
                    ) : (
                        <p>No collection available</p>
                    )}
                </div>
            </div>
        </>

    );
};

export default Collection;