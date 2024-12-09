import React, { useState, useEffect } from 'react';
import './Collection.css';
import { useNavigate } from 'react-router-dom';
import FetchMyNFT from './FetchMyNFT';
import PurchaseCard from './buyListing';

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
            <div className='collections-container'>
                <h4 className='login-title'>{props.account !=null ? (<>Connected to: {props.account}</>):(<><p></p></>)}</h4>
                <div className='title-container'>
                    <h1 className="main-title">Collections</h1>
                </div>
                <FetchMyNFT setMyNFT={setMyNFT} setloading={setloading} account={account} />
                <div className='collections-content'>
                    {myNFT.length > 0 ? (
                        myNFT.map((nft, index) => (
                            <div className="collections-card" key={index}>
                                <img className="card-image"></img>
                                <p className="card-title">{`Card Title ${nft.tokenId}`}</p>
                                <PurchaseCard tokenId={nft.tokenId} />
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