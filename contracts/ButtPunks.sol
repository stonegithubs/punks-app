// Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

contract ButtPunks is ERC721Enumerable, Ownable, PaymentSplitter {
    using SafeMath for uint256;
    
    uint256 public constant TOKEN_PRICE = 0.0001 ether;
    address[] private ADDRESS_LIST = [
        0xD1aDe89F8826d122F0a3Ab953Bc293E144042539,
        0x4a4F584cA801192D459aFDF93BE3aE2C627FF8a2
    ];
    uint256[] private SHARE_LIST = [50, 50];
    uint16 public constant MAX_SUPPLY = 10000;
    uint8 public constant MAX_PURCHASE = 20;

    bool public saleIsActive = false;

    constructor()
        ERC721("ButtPunks", "BUTTS")
        PaymentSplitter(ADDRESS_LIST, SHARE_LIST)
    {
        setSaleStatus(true);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmU9YSQCjvHmezoNgHrPGYY39bR1qar3wshyA2NMTregfw/";
    }

    function setSaleStatus(bool saleStatus) public onlyOwner {
        saleIsActive = saleStatus;
    }

    function getSaleStatus() public view returns (bool) {
        return saleIsActive;
    }

    function mintToken(uint256 numberOfTokens) public payable {
        uint256 curTotal = totalSupply();
        uint256 newTotal = curTotal.add(numberOfTokens);
        
        require(saleIsActive, "Sale must be active to mint a token");
        require(
            numberOfTokens <= MAX_PURCHASE,
            "Each wallet can only mint 20 tokens at a time"
        );
        require(
            newTotal <= MAX_SUPPLY,
            "Purchase would exceed max supply of tokens"
        );
        require(
            TOKEN_PRICE.mul(numberOfTokens) <= msg.value,
            "Ether value sent is lower than expected"
        );

        uint256 newTokenId = newTotal;
        while (newTokenId < newTotal) {
            _safeMint(msg.sender, newTokenId);
            newTokenId = newTokenId.add(1);
        }
    }
}
