// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.6;
 
import "https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/master/contracts/token/ERC1155/utils/ERC1155HolderUpgradeable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/master/contracts/access/OwnableUpgradeable.sol";
 
interface tDAO {
    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) external;
}
 
contract tDAOHolder is ERC1155HolderUpgradeable, OwnableUpgradeable{
 
address public tDAOaddr;
 
mapping(uint=>address) public addressIdMapping;
 
function initialize(address addr) public initializer {
        _transferOwnership(addr);
    }
 
    function settDAO(address addr) public onlyOwner{
        tDAOaddr=addr;
    }
 
    function withdraw (uint256 id, uint256 amount) public payable {
        require(msg.sender==addressIdMapping[id],"Caller is not whitelisted!");
        tDAO(tDAOaddr).safeTransferFrom(address(this), msg.sender, id, amount, "");
    }
 
    function whitelist (address addr,uint256 tokenId) public{
        require (msg.sender==tDAOaddr, "Caller is not tDAO smart contract!");
        addressIdMapping[tokenId] =addr;
 
    }
}