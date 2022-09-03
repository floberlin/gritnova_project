// SPDX-License-Identifier: MIT
pragma solidity >=0.8.6;

import "openzeppelin-contracts/contracts/token/ERC1155/ERC1155.sol";
import "openzeppelin-contracts/contracts/access/AccessControl.sol";
import "openzeppelin-contracts/contracts/security/ReentrancyGuard.sol";
import "openzeppelin-contracts/contracts/utils/Strings.sol";

interface Itreasury {
    function whitelist(address addr, uint256 tokenId) external;

    function withdraw(address addr, uint256 amount) external;

    function withdrawReward(
        address contractor,
        uint256 id,
        uint256 amount
    ) external;
}

interface Istatoken {
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(address sender,address receiver, uint256 amount) external; 
    function approve(address sender, uint256 amount) external;
}

contract Solteria is ERC1155, AccessControl, ReentrancyGuard {


    string private _uri; // URI of the token
    address public treasury = address(0); // treasury contract address
    address public statoken = address(0); // solteria token address
    uint256 public tokenID = 0; // token ID of the token to be minted
    bytes32 public constant EMPLOYER_ROLE = keccak256("EMPLOYER_ROLE"); // role of the employer
    bytes32 public constant CONTRACTOR_ROLE = keccak256("CONTRACTOR_ROLE"); // contractor is the role of the employee who is working for the employer.

    mapping(uint256 => string) public tokenIDtoIPFS; // tokenID to IPFS hash
    mapping(uint256 => uint256) public tokenIDtoReward; // tokenID to reward
    mapping(uint256 => address[]) public tokenIDtoClaimers; // array of addresses
    mapping(uint256 => bool) public tokenIDtoDone; // if the contractor has finished the work
    mapping(uint256 => bool) public claimedReward; // if the contractor has claimed the reward
    mapping(uint256 => bool) public completedTask; //  if the contractor has completed the task
    mapping(string => bool) public claimedTask; // if the contractor has claimed the task
    mapping(uint256 => bool) public approvedTask; // if the employer has approved the task

    event TaskCreated(string _ipfsID, uint256 _tokenID, uint256 _reward); // event for when a task is created
    event TaskClaimed(string _ipfsID, uint256 _tokenID, uint256 _reward); // event for when a task is claimed
    event TaskCompleted(string _ipfsID, uint256 _tokenID, uint256 _reward); // event for when a task is completed
    event TaskCancelled(string _ipfsID, uint256 _tokenID, uint256 _reward); // event for when a task is cancelled
    event PermanentURI(string _value, uint256 indexed _id); // event for when a permanent URI is set

    constructor(address addr1, address addr2)
        ERC1155(
            "https://ipfs.io/ipns/k51qzi5uqu5diitbr0kyw2jut5z6d06hm923t1mqaygudw4zf2u1ocbip88ieq/{id}.json"
        )
    {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        treasury = addr1;
        statoken = addr2;
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

    /**
     *
     */

    // start of role definitions
    function grantRoleEmployer() public {
        require(
            !hasRole(CONTRACTOR_ROLE, msg.sender),
            "Caller is already a contractor"
        );
        _setupRole(EMPLOYER_ROLE, msg.sender);
    }

    function revokeRoleEmployer(address user) public {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Caller is not an admin"
        );
        revokeRole(EMPLOYER_ROLE, user);
    }

    function grantRoleContractor() public {
        require(
            !hasRole(EMPLOYER_ROLE, msg.sender),
            "Caller is already an employer"
        );
        _setupRole(CONTRACTOR_ROLE, msg.sender);
    }

    function revokeRoleContractor(address user) public {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Caller is not an admin"
        );
        revokeRole(CONTRACTOR_ROLE, user);
    }

    // end of role definitions

    /**
     *
     */

    // main functions

    function createTask(string memory ipfsID) public payable {
        require(
            hasRole(EMPLOYER_ROLE, msg.sender),
            "Caller is not an employer"
        );
        require(msg.value > 0, "Please define a reward for the task");
        uint256 reward = msg.value;
        _mint(treasury, tokenID, 1, "");
        payable(treasury).transfer(reward);
        tokenIDtoIPFS[tokenID] = ipfsID;
        tokenIDtoReward[tokenID] = reward;

        emit TaskCreated(ipfsID, tokenID, reward);
        emit PermanentURI(tokenURI(tokenID), tokenID);
        tokenID++;
        Istatoken(statoken).approve(address(this), 1000000000000000000);
        Istatoken(statoken).transferFrom(address(this),msg.sender, 1000000000000000000);
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
        _mint(treasury, tokenID, 1, "");
        payable(treasury).transfer(reward);
        tokenIDtoIPFS[tokenID] = ipfsID;
        emit TaskCreated(ipfsID, tokenID, reward);
        emit PermanentURI(tokenURI(tokenID), tokenID);
        tokenID++;
        Itreasury(treasury).whitelist(contractor, tokenID);
    }

    function claimTask(string memory ipfsID) public {
        require(
            hasRole(CONTRACTOR_ROLE, msg.sender),
            "Caller is not a contractor"
        );
        uint256 _tokenID = this.getTokenID(ipfsID);
        require(
            !claimedTask[
                append(
                    ipfsID,
                    addressToString(msg.sender),
                    ""
                )
            ],
            "task has already been claimed"
        );
        claimedTask[
                append(
                    ipfsID,
                    addressToString(msg.sender),
                    ""
                )
            ] = true;
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
        require(!approvedTask[_tokenID], "task has already been approved");
        approvedTask[_tokenID] = true;
        tokenIDtoDone[_tokenID] = true;
        Itreasury(treasury).whitelist(contractor, _tokenID);
    }

    function completeTask(string memory ipfsID) public {
        require(
            hasRole(CONTRACTOR_ROLE, msg.sender),
            "Caller is not a contractor"
        );
        uint256 _tokenID = this.getTokenID(ipfsID);
        require(
            !completedTask[_tokenID],
            "task has already been completed"
        );
        completedTask[_tokenID] = true;
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
            "task completion is not approved by the employer"
        );
        Itreasury(treasury).withdraw(msg.sender, _tokenID);
         Istatoken(statoken).approve(address(this), 5000000000000000000);
        Istatoken(statoken).transferFrom(address(this), msg.sender, 5000000000000000000);
        emit TaskCompleted(
            tokenIDtoIPFS[_tokenID],
            _tokenID,
            tokenIDtoReward[_tokenID]
        );
    }

    function claimFunds(string memory ipfsID) public {
        uint256 _tokenID = this.getTokenID(ipfsID);
        require(
            !claimedReward[_tokenID],
            "This task rewards have already been claimed"
        );
        claimedReward[_tokenID] = true;
        require(
            hasRole(CONTRACTOR_ROLE, msg.sender),
            "Caller is not a contractor"
        );
        require(
            tokenIDtoDone[_tokenID],
            "task completion is not approved by the employer"
        );
        require(
            balanceOf(msg.sender, _tokenID) >= 1,
            "You have not completed the task yet"
        );
        uint256 reward = tokenIDtoReward[_tokenID];
        uint256 balance = Istatoken(statoken).balanceOf(msg.sender);
        uint256 fee = 250;
        if (balance >= 25000000000000000000) {
             fee = 200; // 2% fee
        } else if (balance >= 100000000000000000000) {
             fee = 175; // 1.75% fee
        } else if (balance >= 300000000000000000000) {
             fee = 150; // 1.5% fee
        } else if (balance >= 500000000000000000000) {
             fee = 125; // 1.75% fee
        } else if (balance >= 1000000000000000000000) {
             fee = 100; // 1% fee
        } else {
             fee = 250;
        }
        uint256 feeAmount = ((reward * fee) / 10000); // dyn fee
        uint256 claimable = (reward - feeAmount); // reward - fee
        Itreasury(treasury).withdrawReward(msg.sender, _tokenID, claimable);
    }

    function deleteTask(string memory ipfsID) public {
        require(hasRole(EMPLOYER_ROLE, msg.sender), "Caller is not a employer");
        uint256 _tokenID = this.getTokenID(ipfsID);
        require(balanceOf(treasury, _tokenID) >= 1, "task not available");
        uint256 reward = tokenIDtoReward[_tokenID];
        uint256 balance = Istatoken(statoken).balanceOf(msg.sender);
        uint256 fee = 250; // 2.5% fee
        if (balance >= 25000000000000000000) {
             fee = 200; // 2% fee
        } else if (balance >= 100000000000000000000) {
             fee = 175; // 1.75% fee
        } else if (balance >= 300000000000000000000) {
             fee = 150; // 1.5% fee
        } else if (balance >= 500000000000000000000) {
             fee = 125; // 1.75% fee
        } else if (balance >= 1000000000000000000000) {
             fee = 100; // 1% fee
        } else {
             fee = 250; // 2.5% fee
        }
        uint256 feeAmount = ((reward * fee) / 10000); // dyn fee
        uint256 claimable = (reward - feeAmount); // reward - fee
        Itreasury(treasury).whitelist(msg.sender, _tokenID);
        Itreasury(treasury).withdrawReward(msg.sender, _tokenID, claimable);
        _burn(treasury, _tokenID, 1);
    }

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

    function getTasks() public view returns (string[] memory) {
        string[] memory result = new string[](tokenID);
        for (uint256 j = 0; j <= tokenID; j++) {
            if (this.balanceOf(treasury, j) > 0) {
                result[j] = tokenIDtoIPFS[j];
            }
        }
        return result;
    }

    function getStatus(string memory ipfsID) public view returns (bool) {
        uint256 _tokenID = this.getTokenID(ipfsID);
        return tokenIDtoDone[_tokenID];
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

    function compareAddr(address a, address b) internal pure returns (bool) {
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

    function addressToString(address account)
        public
        pure
        returns (string memory)
    {
        uint256 i = uint256(uint160(address(account)));
        return Strings.toString(i);
    }

    function append(
        string memory a,
        string memory b,
        string memory c
    ) internal pure returns (string memory) {
        return string(abi.encodePacked(a, b, c));
    }

    function tokenURI(uint256 tokenId) public pure returns (string memory) {
        return
            append(
                "https://ipfs.io/ipns/k51qzi5uqu5diitbr0kyw2jut5z6d06hm923t1mqaygudw4zf2u1ocbip88ieq",
                Strings.toString(tokenId),
                ".json"
            );
    }
}