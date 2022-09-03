// SPDX-License-Identifier: MIT
pragma solidity >=0.8.6;

import "forge-std/Script.sol";
import {Solteria} from "../src/Solteria.sol";
import {SolteriaTreasury} from "../src/SolteriaTreasury.sol";
import {SolteriaToken} from "../src/SolteriaToken.sol";

contract SolteriaScript is Script {

    Solteria solteria;
    SolteriaTreasury solteriaTreasury;
    SolteriaToken solteriaToken;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        solteriaToken = new SolteriaToken();
        solteriaTreasury = new SolteriaTreasury();
        solteria = new Solteria(address(solteriaTreasury), address(solteriaToken));
        solteriaTreasury.setSolteria(address(solteria));
        solteriaToken.approve(msg.sender, 10000000000000000000000000);
        solteriaToken.transferFrom(msg.sender, address(solteria), 10000000000000000000000000);

        vm.stopBroadcast();
    }
}