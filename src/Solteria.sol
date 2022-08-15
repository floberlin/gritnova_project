// SPDX-License-Identifier: MIT
pragma solidity >=0.8.6;

import "openzeppelin-contracts/contracts/token/ERC1155/ERC1155.sol";
import "openzeppelin-contracts/contracts/access/AccessControl.sol";
import "openzeppelin-contracts/contracts/security/ReentrancyGuard.sol";

interface Itreasury {
    function whitelist(address addr, uint256 tokenId) external;

    function withdraw(address addr, uint256 amount) external;

    function withdrawReward(
        address contractor,
        uint256 id,
        uint256 amount
    ) external;
}

contract Solteria is ERC1155, AccessControl, ReentrancyGuard {
    string private _uri; // URI of the token
    address public treasury = address(0); // treasury contract address
    uint256 public tokenID = 0; // token ID of the token to be minted
    bytes32 public constant EMPLOYER_ROLE = keccak256("EMPLOYER_ROLE"); // role of the employer
    bytes32 public constant CONTRACTOR_ROLE = keccak256("CONTRACTOR_ROLE"); // contractor is the role of the employee who is working for the employer.

    mapping(uint256 => string) public tokenIDtoIPFS; // tokenID to IPFS hash
    mapping(uint256 => uint256) public tokenIDtoReward; // tokenID to reward
    mapping(uint256 => address[]) public tokenIDtoClaimers; // array of addresses
    mapping(uint256 => bool) public tokenIDtoDone; // if the contractor has finished the work

    event TaskCreated(string _ipfsID, uint256 _tokenID, uint256 _reward); // event for when a task is created
    event TaskClaimed(string _ipfsID, uint256 _tokenID, uint256 _reward); // event for when a task is claimed
    event TaskCompleted(string _ipfsID, uint256 _tokenID, uint256 _reward); // event for when a task is completed
    event TaskCancelled(string _ipfsID, uint256 _tokenID, uint256 _reward); // event for when a task is cancelled

    constructor()
        ERC1155(
            "https://ipfs.io/ipns/k51qzi5uqu5diitbr0kyw2jut5z6d06hm923t1mqaygudw4zf2u1ocbip88ieq/{id}.json"
        )
    {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /*****************************************/

    // start of role definitions
    function grantRoleEmployer() public {
        require(
            !hasRole(CONTRACTOR_ROLE, msg.sender),
            "Caller is already a contractor"
        );
        _setupRole(EMPLOYER_ROLE, msg.sender);
    }

    function revokeRoleEmployer() public {
        revokeRole(EMPLOYER_ROLE, msg.sender);
    }

    function grantRoleContractor() public {
        require(
            !hasRole(EMPLOYER_ROLE, msg.sender),
            "Caller is already an employer"
        );
        _setupRole(CONTRACTOR_ROLE, msg.sender);
    }

    function revokeRoleContractor() public {
        revokeRole(CONTRACTOR_ROLE, msg.sender);
    }

    // end of role definitions

    /*****************************************/

    // start of access control definitions
    function setContract(address addr) public {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Caller is not the admin"
        );
        treasury = addr;
    }

    // end of access control definitions

    /*****************************************/

    // main functions

    function createTask(string memory ipfsID) public payable {
        require(
            hasRole(EMPLOYER_ROLE, msg.sender),
            "Caller is not an employer"
        );
        require(msg.value > 0, "Please define a reward for the task");
        uint256 reward = msg.value;
        tokenIDtoIPFS[tokenID] = ipfsID;
        tokenIDtoReward[tokenID] = reward;
        _mint(treasury, tokenID, 1, "");
        payable(treasury).transfer(reward);
        emit TaskCreated(ipfsID, tokenID, reward);
        tokenID++;
    }

    function createPrivateTask(string memory ipfsID, address contractor)
        public
        payable
    {
        require(
            hasRole(EMPLOYER_ROLE, msg.sender),
            "Caller is not an employer"
        );
        require(msg.value > 0, "Please define a reward for the task");
        uint256 reward = msg.value;
        tokenIDtoIPFS[tokenID] = ipfsID;
        _mint(treasury, tokenID, 1, "");
        payable(treasury).transfer(reward);
        emit TaskCreated(ipfsID, tokenID, reward);
        tokenID++;
        Itreasury(treasury).whitelist(contractor, tokenID);
    }

    function claimTask(string memory ipfsID) public {
        require(
            hasRole(CONTRACTOR_ROLE, msg.sender),
            "Caller is not a contractor"
        );
        uint256 _tokenID = this.getTokenID(ipfsID);
        tokenIDtoClaimers[_tokenID].push(msg.sender);
        emit TaskClaimed(
            tokenIDtoIPFS[_tokenID],
            _tokenID,
            tokenIDtoReward[_tokenID]
        );
    }

    function approveCompletedTask(string memory ipfsID, address contractor)
        public
    {
        require(hasRole(EMPLOYER_ROLE, msg.sender), "Caller is not a employer");
        uint256 _tokenID = this.getTokenID(ipfsID);
        tokenIDtoDone[_tokenID] = true;
        Itreasury(treasury).whitelist(contractor, _tokenID);
    }

    function completeTask(string memory ipfsID) public {
        require(
            hasRole(CONTRACTOR_ROLE, msg.sender),
            "Caller is not a contractor"
        );
        uint256 _tokenID = this.getTokenID(ipfsID);
        address[] memory claimers = tokenIDtoClaimers[_tokenID];
        bool result = false;
        if (claimers.length >= 0) {
            for (uint256 j = 0; j < claimers.length; j++) {
                if (compareAddr(claimers[j], msg.sender)) {
                    result = true;
                }
            }
        }
        require(result, "Caller is not a task claimer");
        require(
            tokenIDtoDone[_tokenID],
            "Task completion is not approved by the employer"
        );
        Itreasury(treasury).withdraw(msg.sender, _tokenID);
        emit TaskCompleted(
            tokenIDtoIPFS[_tokenID],
            _tokenID,
            tokenIDtoReward[_tokenID]
        );
    }

    function claimFunds(string memory ipfsID) public {
        require(
            hasRole(CONTRACTOR_ROLE, msg.sender),
            "Caller is not a contractor"
        );
        uint256 _tokenID = this.getTokenID(ipfsID);
        require(
            tokenIDtoDone[_tokenID],
            "Task completion is not approved by the employer"
        );
        require(
            balanceOf(msg.sender, _tokenID) >= 1,
            "You have not completed the task yet"
        );
        uint256 reward = tokenIDtoReward[_tokenID];
        Itreasury(treasury).withdrawReward(msg.sender, _tokenID, reward);
    }

    //   function deleteTask (string memory ipfsID) public {
    //     require(hasRole(EMPLOYER_ROLE, msg.sender), "Caller is not a employer");
    //     uint256 _tokenID = this.getTokenID(ipfsID);
    //     //tbd
    //   }

    // Get functions
    function getTokenID(string memory ipfsID) public view returns (uint256) {
        uint256 result;
        for (uint256 j = 0; j <= tokenID; j++) {
            if (compareStrings(tokenIDtoIPFS[j], ipfsID)) {
                result = j;
            }
        }
        return result;
    }

    function getClaimers(string memory ipfsID)
        public
        view
        returns (address[] memory)
    {
        uint256 _tokenID = this.getTokenID(ipfsID);
        return tokenIDtoClaimers[_tokenID];
    }

    // Helper functions
    function compareStrings(string memory a, string memory b)
        internal
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }

    function stringToBytes(string memory source)
        internal
        pure
        returns (bytes memory result)
    {
        return abi.encodePacked(source);
    }

    function append(
        string memory a,
        string memory b,
        string memory c
    ) internal pure returns (string memory) {
        return string(abi.encodePacked(a, b, c));
    }

    function tokenURI(string memory tokenId)
        public
        pure
        returns (string memory)
    {
        return
            append(
                "https://ipfs.io/ipns/k51qzi5uqu5diitbr0kyw2jut5z6d06hm923t1mqaygudw4zf2u1ocbip88ieq",
                tokenId,
                ".json"
            );
    }

    function compareAddr(address a, address b) internal pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }
}
