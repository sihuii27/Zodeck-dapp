// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MockERC721 is ERC721 {
    uint256 private _tokenIdCounter;

    constructor() ERC721("MockERC721", "MERC721") {}

function mint(address to) external returns (uint256) {
    uint256 tokenId = _tokenIdCounter;
    _mint(to, tokenId);
    _tokenIdCounter++;
    emit Transfer(address(0), to, tokenId); // Emit the Transfer event
    return tokenId;
}
}
