// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.6;
 
import https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/master/contracts/token/ERC1155/ERC1155Upgradeable.sol;
import https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/master/contracts/access/AccessControlUpgradeable.sol;
 
interface tdaoHolder{
    function whitelist (address addr,uint256 tokenId) external;
}
 
contract tDAO is ERC1155Upgradeable, AccessControlUpgradeable  {
 
    string[] public tokenHashIpfs;
    string[] public transHashIpfs;
    mapping (string => bool) public _tokenHashExists;
    mapping (string => bool) public _dataHashExists;
    mapping (string => string[]) public _mappingExtIdTrans;
    mapping (string => string) public _mappingExtIdIPFS;
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    string private _uri;
 
    // Intitializer for upgradable funtionality
    function initialize() public initializer {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setURI(https://ipfs.io/ipns/k51qzi5uqu5diitbr0kyw2jut5z6d06hm923t1mqaygudw4zf2u1ocbip88ieq/{id}.json);
        require(!_tokenHashExists["QmVW35TLuax6cmm9nkSXxWmGvNrEA3WjV3QDwpnuc7UGwV"], "Hash already exists");
        _tokenHashExists["QmVW35TLuax6cmm9nkSXxWmGvNrEA3WjV3QDwpnuc7UGwV"] = true;
        tokenHashIpfs.push("QmVW35TLuax6cmm9nkSXxWmGvNrEA3WjV3QDwpnuc7UGwV");
        _mint(0xB34F9785E71B3903389A880C175E9c912520c1c6, 0, 8000000000, "");
    }
   
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155Upgradeable, AccessControlUpgradeable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
 
    // Role definitions
    function grantRoleValidator(address reqAddr) public  {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Caller is not the admin");
        grantRole(VALIDATOR_ROLE, reqAddr);
    }
 
    function revokeRoleValidator(address reqAddr) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Caller is not the admin");
        revokeRole(VALIDATOR_ROLE, reqAddr);
    }
 
    function grantRoleMinter(address reqAddr) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Caller is not the admin");
        grantRole(MINTER_ROLE, reqAddr);
    }
 
    function revokeRoleMinter(address reqAddr) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Caller is not the admin");
        revokeRole(MINTER_ROLE, reqAddr);
    }
 
    // Push IPFS data hash associated to token id to blockchain
    function setData(string memory _hash, string memory _extId) public {
        require(hasRole(VALIDATOR_ROLE, msg.sender), "Caller is not a validator");
        require(!_dataHashExists[_hash], "Hash already exists");
        require(_tokenHashExists[getIpfsId(_extId)], "No associated token found");
        _dataHashExists[_hash] = true;
        transHashIpfs.push(_hash);
        _mappingExtIdTrans[_extId] = transHashIpfs;
    }
   
    // Validate hash
    function validate(string memory _hash) public view returns (bool) {
        require(_dataHashExists[_hash], "Hash does not exist");
        return (true);
    }
   
   // Minting functions
    function newFT(string memory ipfsId, string memory extId, uint amount) public {
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
        require(!_tokenHashExists[ipfsId], "Hash already exists");
        _tokenHashExists[ipfsId] = true;
        tokenHashIpfs.push(ipfsId);
        uint idHash = (tokenHashIpfs.length - 1);
        _mappingExtIdIPFS[extId] = ipfsId;
        _mint(msg.sender, idHash, amount, "");
    }
 
function newFTMiddleman(address holderAddress,address toAddress, string memory ipfsId, string memory extId, uint amount) public {
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
        require(!_tokenHashExists[ipfsId], "Hash already exists");
        _tokenHashExists[ipfsId] = true;
        tokenHashIpfs.push(ipfsId);
        uint idHash = (tokenHashIpfs.length - 1);
        _mappingExtIdIPFS[extId] = ipfsId;
        _mint(msg.sender, idHash, amount, "");
        tdaoHolder(holderAddress).whitelist(toAddress,idHash);
        _safeTransferFrom(msg.sender, holderAddress, idHash, amount, "");
    }
 
    function newNFT(string memory ipfsId, string memory extId) public{
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
        require(!_tokenHashExists[ipfsId], "Hash already exists");
        _tokenHashExists[ipfsId] = true;
        tokenHashIpfs.push(ipfsId);
        uint idHash = (tokenHashIpfs.length - 1);
        _mappingExtIdIPFS[extId] = ipfsId;
        _mint(msg.sender, idHash, 1, "");
    }  
   
   
    // Get ids
    function getTokenId (string memory ipfsId) public view returns (uint256) {
        uint256 result;
        for (uint j = 0; j < tokenHashIpfs.length; j++) {
            if (compareStrings(tokenHashIpfs[j], ipfsId)) {
                result = j;
            }
        }
        return result;
    }
 
    function getIpfsId (string memory extId) public view returns (string memory) {
        return _mappingExtIdIPFS[extId];
    }
   
    // Get transactions
    function getTransactionsExtId (string memory extId) public view returns (string[] memory) {
        return _mappingExtIdTrans[extId];
    }
 
    // Get hashes
    function getAllDataHashes () public view returns (string[] memory) {
        return transHashIpfs;
    }
 
    function getDataHash (uint256 tokenId) public view returns (string memory) {
        return transHashIpfs[tokenId];
    }
 
    // Helper functions
    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }  
 
    function stringToBytes(string memory source) internal pure returns (bytes memory result)  {
        return abi.encodePacked(source);
    }
   
    function append(string memory a, string memory b,string memory c ) internal pure returns (string memory) {
 
    return string(abi.encodePacked(a, b, c));
 
}
 
   function tokenURI (string memory tokenId) public pure returns (string memory) {
    return append(https://ipfs.io/ipns/k51qzi5uqu5diitbr0kyw2jut5z6d06hm923t1mqaygudw4zf2u1ocbip88ieq, tokenId, ".json");
  }
 





  function createTask () public {
    require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
    require(!_tokenHashExists[ipfsId], "Hash already exists");
    _tokenHashExists[ipfsId] = true;
    tokenHashIpfs.push(ipfsId);
    uint idHash = (tokenHashIpfs.length - 1);
    _mappingExtIdIPFS[extId] = ipfsId;
    _mint(msg.sender, idHash, 1, "");
  }

  function createPrivateTask () public {
    require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
    require(!_tokenHashExists[ipfsId], "Hash already exists");
    _tokenHashExists[ipfsId] = true;
    tokenHashIpfs.push(ipfsId);
    uint idHash = (tokenHashIpfs.length - 1);
    _mappingExtIdIPFS[extId] = ipfsId;
    _mint(msg.sender, idHash, 1, "");
  }

   function claimTask () public {
    require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
    require(!_tokenHashExists[ipfsId], "Hash already exists");
    _tokenHashExists[ipfsId] = true;
    tokenHashIpfs.push(ipfsId);
    uint idHash = (tokenHashIpfs.length - 1);
    _mappingExtIdIPFS[extId] = ipfsId;
    _mint(msg.sender, idHash, 1, "");
  }

   function claimFunds () public {
    require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
    require(!_tokenHashExists[ipfsId], "Hash already exists");
    _tokenHashExists[ipfsId] = true;
    tokenHashIpfs.push(ipfsId);
    uint idHash = (tokenHashIpfs.length - 1);
    _mappingExtIdIPFS[extId] = ipfsId;
    _mint(msg.sender, idHash, 1, "");
  }

  function deleteTask () public {
    require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
    require(!_tokenHashExists[ipfsId], "Hash already exists");
    _tokenHashExists[ipfsId] = true;
    tokenHashIpfs.push(ipfsId);
    uint idHash = (tokenHashIpfs.length - 1);
    _mappingExtIdIPFS[extId] = ipfsId;
    _mint(msg.sender, idHash, 1, "");
  }


}