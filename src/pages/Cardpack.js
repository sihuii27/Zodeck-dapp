import React from 'react';
import './Cardpack.css';


// pass account address from App.js to Cardpack
const CardPack = (props) => {
  const { account , setAccount } = props;
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/landing');
  };

  const handleOpenCardPacks = () => {
    navigate('/cardpackresults');
  };

  return (
    <div className="cardpack-container">
      <div className="cardpack-content">
        <img src="/logo512.png" alt="Card Pack" className="cardpack-image" />
        <div className="cardpack-info">
          <p>Shiny - 0.000001%</p>
          <p>Animal - 25%</p>
        </div>
      </div>
      <div className="cardpack-btn-container">
        <button 
          className="cardpack-back-btn"
          onClick={handleBack}>
          Back
        </button>
        <button className="open-cardpack-btn">Open Card Pack 1000💰</button>
      <br/>
      </div>
      {props.account}
    </div>
  );
};

export default CardPack;