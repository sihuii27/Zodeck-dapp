import cardMintPack from "../abi/CardMintPack.json";
import config from '../abi/config.json';
require("dotenv").config();
const ethers = require('ethers');

const CONTRACT_ADDRESS = config.NFTPLACE_CONTRACT_ADDRESS;
const CONTRACT_ABI = cardMintPack.abi;

export const fetchMintedCards = async () => {
  const listenForCardMinted = async (provider, contract) => {
    return new Promise((resolve, reject) => {
      let eventCount = 0;
      const maxEvents = 5;
      const mintedCards = [];
  
      // Set up event listener for CardMinted events
      contract.on("CardMinted", (tokenId, owner, metadataURI) => {
        // console.log(`CardMinted Event Received: ${tokenId}, ${owner}, ${metadataURI}`);
        
        // Collect minted cards
        mintedCards.push({
          tokenId: tokenId.toString(),
          owner,
          metadataURI,
        });
  
        eventCount++;
        if (eventCount >= maxEvents) {
          console.log("Received 5 CardMinted events");
          contract.removeAllListeners("CardMinted"); 
          resolve(mintedCards); // Return minted cards when complete
        }
      });
  
      // Handle timeout if events are not received
      setTimeout(() => {
        reject("Timeout: Did not receive 5 CardMinted events.");
        contract.removeAllListeners("CardMinted"); 
      }, 150000); // Wait for up to 2.5 minute
    });
  };
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  
  try {
    const mintedCards = await listenForCardMinted(provider, contract);
    console.log("Minted Cards:", mintedCards);
    return mintedCards;

  } catch (error) {
    console.error("Error waiting for CardMinted events:", error);
  }
};