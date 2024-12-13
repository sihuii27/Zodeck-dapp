import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { fetchMintedCards } from './fetchMintedCards';
import './Cardpack.css';
import Swal from 'sweetalert2';

import config from '../abi/config.json';

const CONTRACT_ADDRESS = config.NFTPLACE_CONTRACT_ADDRESS;
const AMOUNT_IN_ETHER = "0.001"; // Amount to send

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

            Swal.fire({
                title: "Please wait for transaction to be confirmed...",
                text: "You clicked the button!",
                icon: "info",
                html: `
                <a href="https://sepolia.etherscan.io/tx/${transactionResponse.hash}" target="_blank">
                View your Transaction Id: ${transactionResponse.hash}
                </a>
            `,
            });

            // Wait for the transaction to be mined
            const receipt = await transactionResponse.wait();
            console.log("Transaction mined:", receipt);
            Swal.fire({
                title: "Transaction Confirmed",
                icon: "success",
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/');
                }
            });

            // Fetch minted cards
            const mintedCards = await fetchMintedCards(); 
            // console.log("Minted Cards:", mintedCards);

            Swal.fire({
                title: "Your minted cards are ready for viewing!",
                text: "View now?",
                icon: "info",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes please!"
              }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/cardpackresults', { state: { mintedCards } });
                }
              });
           
        } catch (error) {
            console.error("Error sending Ether:", error);
            alert("Transaction failed: " + error.message);
        }
    };

    return <button className="open-cardpack-btn" onClick={sendEtherToContract}>Open Card Pack 0.001 ETH</button>;
};

export default BuyPackButton;
