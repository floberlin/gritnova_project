// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.6;
 
import "../lib/openzeppelin-contracts/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
 
interface Solteria {
    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) external;
}
 
contract SolteriaHolder is ERC1155Holder, Ownable{
 
address public SolteriaAddr;
 
mapping(uint=>address) public addressIdMapping;
 
constructor() {
        _transferOwnership(msg.sender);
    }
 
    function setSolteria(address addr) public onlyOwner{
        SolteriaAddr=addr;
    }
 
    function withdraw (address addr, uint256 id) public payable {
        require(msg.sender==addressIdMapping[id],"Caller is not whitelisted!");
        Solteria(SolteriaAddr).safeTransferFrom(address(this), addr, id, 1, "");
    }
 
    function whitelist (address addr,uint256 tokenId) public{
        require (msg.sender==SolteriaAddr, "Caller is not Solteria smart contract!");
        addressIdMapping[tokenId] =addr;
 
    }

    function withdrawReward (address contractor, uint256 id, uint256 amount) public payable {
        require(msg.sender==addressIdMapping[id],"Caller is not whitelisted!");
        payable(contractor).transfer(amount);
    }
}