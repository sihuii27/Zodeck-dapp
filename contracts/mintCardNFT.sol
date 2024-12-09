// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import "./ownable.sol";
import "./safemath.sol";
import "./test.sol";

contract mintCardNFT is NFTplace, VRFConsumerBaseV2Plus {
    using SafeMath for uint256;

    uint256 private _tokenIds;
    string public baseURI = "https://localhost:3000/Images/Images/"; // folder containing images for NFTs 
    address public randomnessProvider;

    // VRF configuration
    uint256 public s_subscriptionId = 96974610044604628616312141700459175826277520099863534881940862707743682658212; // hardcoded for sepolia
    address private immutable vrfCoordinator = 0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B; // hardcoded for sepolia
    bytes32 private immutable keyHash = 0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae; // 500 gwei Key Hash
    uint32 private immutable callbackGasLimit = 200000; // 20,000 gas per word
    uint16 private immutable requestConfirmations = 3; // default 3
    uint32 private immutable numWords = 10; // Request 10 random numbers

    struct RequestStatus {
        bool fulfilled; // whether the request has been successfully fulfilled
        bool exists; // whether a requestId exists
        uint256[] randomWords;
    }
    mapping(uint256 => RequestStatus) public s_requests; /* requestId --> requestStatus */
    mapping(uint256 => address) public s_requestToSender; /* requestId --> sender */
    
    // Past request IDs.
    uint256[] public requestIds;
    uint256 public lastRequestId;

    constructor() VRFConsumerBaseV2Plus(vrfCoordinator) {}

    function _mintCard(address recipient, uint256 randomNumber) private returns (uint) {
        _tokenIds = _tokenIds.add(1);
        uint256 newTokenId = _tokenIds;

        uint256 cardIndex = (randomNumber % 20); // card index: 0-19

        _safeMint(recipient, newTokenId);
        _setTokenURI(newTokenId, _genTokenURI(cardIndex));
        return newTokenId;
    }
    
    // Generate the card image name (e.g., "Card 1.png")
    function _genTokenURI(uint cardIndex) private view returns (string memory) {
        return string(abi.encodePacked(baseURI,"Card ", Strings.toString(cardIndex),".png"));
    }

    // Assumes the subscription is funded sufficiently.
    // @param enableNativePayment: Set to `true` to enable payment in native tokens, or
    // `false` to pay in LINK
    function requestRandomWords(
        bool enableNativePayment
    ) external onlyOwner returns (uint256 requestId) {
        // Will revert if subscription is not set and funded.
        requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: keyHash,
                subId: s_subscriptionId,
                requestConfirmations: requestConfirmations,
                callbackGasLimit: callbackGasLimit,
                numWords: numWords,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({
                        nativePayment: enableNativePayment
                    })
                )
            })
        );
        s_requests[requestId] = RequestStatus({
            randomWords: new uint256[](0),
            exists: true,
            fulfilled: false
        });
        s_requestToSender[requestId] = msg.sender;
        requestIds.push(requestId);
        lastRequestId = requestId;
        // emit RequestSent(requestId, numWords);
        return requestId;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] calldata _randomWords
    ) internal override {
        require(
            randomnessProvider != address(0),
            "Randomness provider not set"
        );
        require(
            msg.sender == randomnessProvider,
            "Caller is not the randomness provider"
        );
        require(s_requests[_requestId].exists, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
        address recipient = s_requestToSender[_requestId];

        // Notify the NFT contract
        for (uint256 i = 0; i < _randomWords.length; i++) {
            _mintCard(recipient, _randomWords[i]);
        }

        // emit RequestFulfilled(_requestId, _randomWords);
    }

    function setRandomnessProvider(address _provider) public onlyOwner {
        randomnessProvider = _provider;
    }

    function getRandomnessProvider() external view returns (address) {
        return randomnessProvider;
    }
}