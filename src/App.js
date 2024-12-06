import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Link, useNavigate } from 'react-router-dom';
import './App.css';
import Landing from './pages/Landing';
import Cardpack from './pages/Cardpack';
import CardpackResults from './pages/CardpackResults';
import Marketplace from './pages/Marketplace';
import Collection from './pages/Collection';
import ViewCard from './pages/ViewCard';
import {useState, useEffect} from 'react';
const ethers = require('ethers');

function Header({account,setAccount}) {
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [walletConnected, setwalletConnected] = useState(null);
  const handleMarketplace = () => {
    navigate('/marketplace');
  };
  const handleCollection = () => {
    navigate('/collection');
  };
  
  //when application refreshes
  // useEffect(() => {
  //   //retrieve and use data from local storage
  //   const storedAcc = localStorage.getItem('Accounts');
  //   //if there is account in storedAcc then setAccount will be assigned to storedAcc and setwalletConnected to true
  //   if (storedAcc) {
  //     setAccount(storedAcc);
  //     setwalletConnected(true);
  //   }
  // }, [setAccount]);

  //when application refreshes
  useEffect( ()=>{
    // if metamask is available
    if (window.ethereum){
      // adding a listener
      window.ethereum.on('Changed of accounts', handleAccounts);
    }
    // once account is changed, the account listener is removed
    return() =>{
      if (window.ethereum){
        window.ethereum.removeListener('Changed of accounts', handleAccounts);
      }
    }
  },[setAccount]);

  function handleAccounts(accounts){
    // if the new account of metamask, it should not be equal to the address stored in the account previously and its length should be more than 0
    if (accounts.length>=1 && account !== account[0]){
      setAccount(account[0]);
      //localStorage.setItem('Accounts', accounts[0]);
      setwalletConnected(true);
    }else{
      setAccount(null);      
      setwalletConnected(false);
    }
  }
  
  async function connectMetamask(){
    console.log(window.ethereum);
    if (window.ethereum !=null){
      try{
        //Web3Provider wraps the standard Web3 provider, MetaMask injects as window.ethereum into each page
        const provider = new ethers.BrowserProvider(window.ethereum); 
        //update the provider state
        setProvider(provider);
        //const storedAcc = localStorage.getItem("Accounts")
        // if (storedAcc) {
        //   setAccount(storedAcc);
        //   setwalletConnected(true);
        //   console.log('Hi'+storedAcc);
        // }
        // give all the accounts
        await provider.send("eth_requestAccounts", []); 
        //current metamask account
        const signer = await provider.getSigner(); 
        //retrieve address of account, signer is the account
        const address = await signer.getAddress();
        setAccount(address);
        //localStorage.setItem('Accounts', address);
        //console.log("My address is", address);
        //when wallet is connected it will be set to true
        setwalletConnected(true); 
        
      }
      catch (err){
        console.error(err);
      }
    } else{
      console.error("Metamask wallet not detected.")
      setwalletConnected(false); 
    }
  }

  const location = useLocation();
  console.log(location.pathname);
  const hideHeaderRoutes = ['/cardpackresults','/marketplace','/collection','/cardpack']; 

  if (hideHeaderRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <div className="header">
      <img src="/logo512.png" alt="Zodeck Logo" className="logo" />
      <div className="user-info">
      <div className="spacing"></div>
      <button className="go-marketplace-btn" onClick={handleMarketplace}>
          Go to marketplace
      </button>
      <button className="view-collection" onClick={handleCollection}>
          View my collection
      </button>
      {walletConnected ? (<>Connected to: {account} <button className="connectWallet" onClick={connectMetamask}>Connected</button></>):(<button className="connectWallet" onClick={connectMetamask}>Connect Wallet</button>)} 
      </div>
    </div>
  );
}

function App() {
  const [account, setAccount] = useState(null);
  return (
    <Router>
      <div className="App">
      <Header account={account} setAccount={setAccount}/>
        <Routes>
          {/* Route for Landing Page */}
          <Route path="/" element={<Landing account={account}/>} />
          {/* Route for Marketplace page */}
          <Route path="/marketplace" element={<Marketplace account={account} />} />
          {/* Route for Cardpack page */}
          <Route path="/cardpack" element={<Cardpack account={account}/>} />
          {/* Route for Cardpack Results page */}
          <Route path="/cardpackresults" element={<CardpackResults account={account}/>} />
          {/* Route for Collections page */}
          <Route path="/collection" element={<Collection account={account}/>} />
          <Route path="/collection/card/:id" element={<ViewCard account={account}/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;