import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { mintNewCards } from './fetchMintedCards';
import './Cardpack.css';

const CONTRACT_ADDRESS = "0xBCbD8BEb7f025451C53e2E040D60A9dD0b1788aD";
const AMOUNT_IN_ETHER = "0.0001"; // Amount to send

const BuyPackButton = () => {
    const navigate = useNavigate();

    const sendEtherToContract = async () => {
        if (!window.ethereum) {
            alert("Please install MetaMask to interact with the dApp.");
            return;
        }

        try {
            // Request account access if needed
            await window.ethereum.request({ method: "eth_requestAccounts" });

            // Create a provider and signer
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            // Prepare the transaction
            const tx = {
                to: CONTRACT_ADDRESS,
                value: ethers.parseEther(AMOUNT_IN_ETHER), // Convert the amount to wei
                gasLimit: 500000,
            };

            // Send the transaction
            const transactionResponse = await signer.sendTransaction(tx);
            console.log("Transaction sent:", transactionResponse);

            // Wait for the transaction to be mined
            const receipt = await transactionResponse.wait();
            console.log("Transaction mined:", receipt);
            alert("Transaction successful!");

            // Mint new cards
            const requestId = await mintNewCards();
            navigate("/cardpackresults", { state: { requestId } });
            
        } catch (error) {
            console.error("Error sending Ether:", error);
            alert("Transaction failed: " + error.message);
        }
    };

    return <button className="open-cardpack-btn" onClick={sendEtherToContract}>Open Card Pack 0.0001 Ether</button>;
};

export default BuyPackButton;
