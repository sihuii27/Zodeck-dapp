// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./ownable.sol";
import "./test.sol";
import "contracts/safemath.sol";

contract CardMintPack is ERC721URIStorage, VRFConsumerBaseV2Plus, NFTplace {
    using SafeMath for uint256;
    //Keeps track of minted NFTS
    uint256 private _tokenIds;
    uint256[] public requestIds;
    uint256[] public s_randomWords;
    uint256 public lastRequestId;
    uint256 public nextTokenId;

    struct RequestStatus {
        bool fulfilled; // whether the request has been successfully fulfilled
        bool exists; // whether a requestId exists
        uint256[] randomWords;
    }
    mapping(uint256 => RequestStatus)
        public s_requests; /* requestId --> requestStatus */

    // Chainlink VRF variables
    uint256 public s_subscriptionId;
    bytes32 public s_keyHash =
        0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae;
    uint32 public callbackGasLimit = 2000000;
    uint16 public requestConfirmations = 3;
    uint32 public numWords = 5;
    string public baseURI = "https://apricot-cheerful-alpaca-636.mypinata.cloud/ipfs/bafybeif4wde6i453uhad2bs63ay4nip3ml2q7x3jhffmo4lkd2z52uipmi/";

    // Pack supply control variables
    uint256 public packPrice = 0.0001 ether;
    uint256 public packsAvailable = 100;
    uint256 public totalPacksSold = 0;


    mapping(uint256 => address) public s_requestToSender; // Maps requestId to user
    mapping(uint256 => bool) private tokenExists; // Prevent duplicate token minting
    mapping(address => uint256[]) private userMintedTokens; // Tracks tokens per user

    event RandomnessRequested(uint256 requestId, address requester);
    event RandomnessFulfilled(uint256 requestId, uint256[] randomWords);
    event CardMinted(uint256 tokenId, address owner, string metadataURI);
    event PackPurchased(address indexed buyer, uint256 packId, uint256 requestId);


    constructor(
        uint256 subscriptionId
    )
        VRFConsumerBaseV2Plus(0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B) 
    {
        s_subscriptionId = subscriptionId;
    }

    // Request random numbers
    function requestRandomWords(
        bool enableNativePayment
    ) external returns (uint256 requestId) {
        requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: s_keyHash,
                subId: s_subscriptionId,
                requestConfirmations: requestConfirmations,
                callbackGasLimit: callbackGasLimit,
                numWords: numWords,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: enableNativePayment})
                )
            })
        );
        s_requests[requestId] = RequestStatus({
            randomWords: new uint256[](0),
            exists: true,
            fulfilled: false
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        s_requestToSender[requestId] = msg.sender;
        emit RandomnessRequested(requestId, msg.sender);
        return requestId;
    }

    // Fulfill random numbers from VRF
    function fulfillRandomWords(uint256 _requestId, uint256[] calldata _randomWords) internal override {
        s_randomWords = _randomWords;
        requestIds.push(_requestId);
        batchMint(_randomWords, s_requestToSender[_requestId]);
    }

function batchMint(
        uint256[] memory _randomWords, address recipient
    ) public {
        require(_randomWords.length == numWords, "Expected X random numbers");
        require(recipient != address(0), "Recipient address is invalid");

        uint256[] memory mintedTokenIds = new uint256[](_randomWords.length);

        for (uint256 i = 0; i < _randomWords.length; i++) {
            uint256 cardIndex = _randomWords[i] % 20; // Determine card index
            string memory uri = string(abi.encodePacked(baseURI, "Card ", _uintToString(cardIndex), ".png"));

            // Track the minted token and increment the token ID
            uint256 tokenId = createToken(uri, recipient);
            mintedTokenIds[i] = tokenId;

            emit CardMinted(tokenId, recipient, uri);
        }

        // Track minted tokens for the recipient
        for (uint256 i = 0; i < mintedTokenIds.length; i++) {
            userMintedTokens[recipient].push(mintedTokenIds[i]);
        }
    }

    // Helper to fetch minted tokens for a user
    function getMintedTokens(address user) public view returns (uint256[] memory) {
        return userMintedTokens[user];
    }

    // Update the base URI for metadata
    function setBaseURI(string memory _baseURI) public onlyOwner {
        baseURI = _baseURI;
    }

    // Helper function to convert uint256 to string
    function _uintToString(uint256 value) private pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    function getRequestStatus(
        uint256 _requestId
    ) public view returns (bool fulfilled, uint256[] memory randomWords) {
        require(s_requests[_requestId].exists, "request not found");
        RequestStatus memory request = s_requests[_requestId];
        return (request.fulfilled, request.randomWords);
    }

    function withdraw() external onlyOwner {
        address payable _owner = payable(owner());
        _owner.transfer(address(this).balance);
    }

    function updatePacksAvailable(uint256 newQty) external onlyOwner {
        // reset the number of packs available
        packsAvailable = newQty;
    }    
    
    function updatePackPrice(uint256 newPrice) external onlyOwner {
        // newPrice in wei
        packPrice = newPrice;
    }

    function getPacksAvailable() external view returns (uint) {
        return packsAvailable;
    }

    function getTotalPacksSold() external view returns (uint) {
        return totalPacksSold;
    }
}
