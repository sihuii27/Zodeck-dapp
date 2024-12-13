import React from 'react';
import './Cardpack.css';
import BuyPackButton from './buyPackButton';
import { useNavigate } from 'react-router-dom';
import '@google/model-viewer';


const CardPack = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const handleOpenCardPacks = () => {
    navigate('/cardpackresults');
  };

  return (
    <div className="cardpack-container">
      <div className="cardpack-content">
        <div className="cardpack-model" style={{ width: "100%", height: "400px" }}>
        <model-viewer src="/packImage/pack2.glb" alt="cardpack" auto-rotate camera-controls ar ios-src="/pack2.glb" shadow-intensity="1" shadow-softness="0.9" style={{
          height: '100%',
          width: '100%',
          aspectRatio: '2 / 3', 
        }}></model-viewer>
        </div>
        <div className="cardpack-info">
          <p>Type: 25%</p> 
          <p>Animal: 8.33%</p>
        </div>
      </div>
      <div className="cardpack-btn-container">
        <button 
          className="cardpack-back-btn"
          onClick={handleBack}
        >
          Back
        </button>
        {/* <button 
          className="open-cardpack-btn"
          onClick={handleOpenCardPacks}
        >
          Open Card Pack 1000💰
        </button> */}
        <BuyPackButton />
      </div>
    </div>
  );
};

export default CardPack;