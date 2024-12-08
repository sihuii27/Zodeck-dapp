import { ContractMissingDeployDataError } from "web3";
import cardCollectingNFT from "../abi/cardCollectionNFT.json";
import bigInt from "big-integer"
require("dotenv").config();
const ethers = require('ethers');

const CONTRACT_ADDRESS = "0xb9E0607024d751753cB3821407bB20e6c94871f1";
const CONTRACT_ABI = cardCollectingNFT.abi;

const MAX_RETRIES = 2;  // Maximum retries
const RETRY_INTERVAL_MS = 150000;  // Time between retries

// Function to poll the fulfillment status
const checkRequestFulfillment = async (contract, requestId) => {
  for (let i = 0; i < MAX_RETRIES; i++) {
    console.log(`Checking fulfillment attempt ${i + 1}...`);
    const { fulfilled } = await contract.getRequestStatus(requestId);
    if (fulfilled) {
      console.log("Randomness request fulfilled.");
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL_MS)); // Wait before next check
  }
  return false;
};

export const mintNewCards = async () => {
  if (!window.ethereum) {
    alert("Please install MetaMask to interact with the dApp.");
    return;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    // Request randomness from Chainlink VRF
    const tx = await contract.requestRandomWords();
    const receipt = await tx.wait();

    const iface = new ethers.Interface(CONTRACT_ABI);
    const eventTopic = iface.getEvent("RandomnessRequested").topicHash;

    // Find the log with the matching topic
    const log = receipt.logs.find((log) =>
      log.topics.includes(eventTopic)
    );

    if (!log) {
      throw new Error("Randomness request event not found.");
    }

    // Decode the log
    const decodedLog = iface.decodeEventLog("RandomnessRequested", log.data, log.topics);

    const requestId = decodedLog.requestId.toString();

    // Retry checking fulfillment
    const isFulfilled = await checkRequestFulfillment(contract, requestId);
    if (!isFulfilled) {
      throw new Error("Randomness request not fulfilled.");
    }

    // Batch mint the cards
    const mintTx = await contract.batchMint(requestId);
    await mintTx.wait();
    console.log("Minted new cards successfully!");

    // Return the account that minted the cards
    const account = await signer.getAddress();
    return account;

  } catch (error) {
    console.error("Error minting cards:", error);
    alert("Minting failed: " + error.message);
  }
};


export const fetchMintedCards = async (account) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

    // Fetch tokens from contract
    const tokens = await contract.getMintedTokens(account);

    // Map tokens to display format
    const cards = tokens.map((tokenId) => {
      const id = bigInt(tokenId).toString(); // Convert BigInt to string
      return {
        tokenId: id,
        image: `/cardImages/${Number(tokenId) % 20}.png`, // Safely convert to number
        title: `Card #${id}`,
      };
    });

    return cards; 

  } catch (error) {
    console.error("Error fetching minted cards:", error);
    return [];
  }
};