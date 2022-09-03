// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract SolteriaToken is ERC20 {
    constructor() ERC20("Solteria Token", "STA") {
        _mint(msg.sender, 20000000000000000000000000);
    }
}