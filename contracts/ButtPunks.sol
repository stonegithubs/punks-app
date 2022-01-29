// Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

contract ButtPunks is ERC721, Ownable, PaymentSplitter {
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public constant MAX_PURCHASE = 20;
    uint256 public constant TOKEN_PRICE = 0.0001 ether;
    address[] private constant ADDRESS_LIST = [
        0xD1aDe89F8826d122F0a3Ab953Bc293E144042539,
        0x4a4F584cA801192D459aFDF93BE3aE2C627FF8a2
    ];
    uint256[] private constant SHARE_LIST = [50, 50];

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

    function mintToken(uint8 numberOfTokens) public payable {
        require(saleIsActive, "Sale must be active to mint a token");
        require(
            numberOfTokens <= MAX_PURCHASE,
            "Each wallet can only mint 20 tokens at a time"
        );
        require(
            _tokenIds.current().add(numberOfTokens) <= MAX_SUPPLY,
            "Purchase would exceed max supply of tokens"
        );
        require(
            TOKEN_PRICE.mul(numberOfTokens) <= msg.value,
            "Ether value sent is not correct"
        );

        for (uint256 i = 0; i < numberOfTokens; i++) {
            _tokenIds.increment();
            uint256 newItemId = _tokenIds.current();
            if (newItemId < MAX_SUPPLY) {
                _safeMint(msg.sender, newItemId);
            }
        }
    }
}
