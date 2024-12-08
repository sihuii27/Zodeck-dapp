import React, { useState, useEffect } from 'react';
import './CardpackResults.css';
import { fetchMintedCards } from './fetchMintedCards';
import { useNavigate } from 'react-router-dom';

const CardpackResults = (props) => {
    const navigate = useNavigate();
    const [mintedCards, setMintedCards] = useState([]);

    useEffect(() => {
        const fetchCards = async () => {
        console.log("fetching cards");

            try {
                const account = props.account || (await window.ethereum.request({ method: "eth_accounts" }))[0];
                if (account) {
                const cards = await fetchMintedCards(account); // Fetch cards
                if (cards.length === 0) {
                    console.warn("No minted cards found.");
                }
                setMintedCards(cards); // Update state
                } else {
                console.error("No account connected.");
                }
            } catch (error) {
                console.error("Error fetching minted cards:", error);
                alert("Fetching failed: " + error.message);
          }
        };
        fetchCards();
      }, [props.account]);

    useEffect(() => {
        console.log('minted cards list: ', mintedCards);
    }, [mintedCards]);

    const handleOpenAnotherPack = () => {
        navigate('/cardpack');
    }

    const handleViewCollection = () => {
        navigate('/collection');
    }

    // placeholderCards = [
    //     { index: 1, image:'/cardImages/0.png', title: 'Image 1' },
    //     { index: 2, image:'/cardImages/1.png', title: 'Image 2' },
    //     { index: 3, image:'/cardImages/2.png', title: 'Image 3' },
    //     { index: 4, image:'/cardImages/3.png', title: "Image 4" },
    //     { index: 5, image:'/cardImages/4.png', title: 'Image 5' },
    //     { index: 6, image:'/cardImages/5.png', title: 'Image 6' },
    //     { index: 7, image:'/cardImages/0.png', title: 'Image 7' },
    //     { index: 8, image:'/cardImages/1.png', title: 'Image 8' },
    //     { index: 9, image:'/cardImages/2.png', title: 'Image 9' },
    //     { index: 10, image:'/cardImages/3.png', title: "Image 10" },
    //     ]
    
    return (
        <>
        <div className='login-title'>{props.account !=null ? (<>Connected to: {props.account}</>):(<><p></p></>)}</div>
        <div className="cardpack-results-container">
            <div className="cardpack-results-content">
            {mintedCards && mintedCards.length > 0 ? (
                    mintedCards.map((listing, index) => (
                    <div className="result-card" key={index}>
                        <img src={listing.image} className="result-card-image" alt={listing.title} />
                        <p className="card-title">{listing.title}</p>
                    </div>
                    ))
                ) : (
                    <p>No cards minted yet. Please try minting!</p>
                )
                }
            </div>
            <div className='button-container'>
                <button 
                    className="open-another-cardpack-btn"
                    onClick={handleOpenAnotherPack}
                >
                    Open Another Pack 
                </button>
                <button 
                    className="view-collection-btn"
                    onClick={handleViewCollection}
                >
                    View Collection
                </button>
            </div>
            
        </div>
        </>
    );
};

export default CardpackResults;