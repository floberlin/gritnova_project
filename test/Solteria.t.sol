// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {Solteria} from "../src/Solteria.sol";
import {SolteriaTreasury} from "../src/SolteriaTreasury.sol";
import {SolteriaToken} from "../src/SolteriaToken.sol";

contract SolteriaTest is Test {
    Solteria solteria;
    SolteriaTreasury solteriaTreasury;
    SolteriaToken solteriaToken;
    address internal employer;
    address internal deployer;
    address internal contractor;
    address internal contractor2;
    address internal contractor3;

    function setUp() public {
       
        solteriaTreasury = new SolteriaTreasury();
        deployer = vm.addr(0xDe);
        vm.deal(deployer, 100 ether);
        vm.label(deployer, "deployer");
        vm.prank(deployer);
        solteriaToken = new SolteriaToken();

        solteria = new Solteria(address(solteriaTreasury), address(solteriaToken));

        // set up employer
        employer = vm.addr(0xA11CE);
        vm.deal(employer, 100 ether);
        vm.label(employer, "employer");
        vm.prank(employer);
        solteria.grantRoleEmployer();

        // set up contractor
        contractor = vm.addr(0xB0B);
        vm.deal(contractor, 100 ether);
        vm.label(contractor, "contractor");
        vm.prank(contractor);
        solteria.grantRoleContractor();

        // set up contractor 2
        contractor2 = vm.addr(0xB0B2);
        vm.deal(contractor2, 100 ether);
        vm.label(contractor2, "contractor2");
        vm.prank(contractor2);
        solteria.grantRoleContractor();

        // set up contractor 3
        contractor3 = vm.addr(0xB0B3);
        vm.deal(contractor3, 100 ether);
        vm.label(contractor3, "contractor3");
        vm.prank(contractor3);
        solteria.grantRoleContractor();

        // set up contracts
        vm.prank(deployer);
        solteriaToken.approve(deployer, 10000000000000000000000000);
        vm.prank(deployer);
        solteriaToken.transferFrom(deployer, address(solteria), 10000000000000000000000000);

        solteriaTreasury.setSolteria(address(solteria));
    }

    // Empolyer positive testcases
    function testEmployerCanCreateTask() public {
        vm.prank(employer);
        solteria.createTask{value: 1 ether}("QmIPFSID");
        assertEq(solteria.balanceOf(address(solteriaTreasury), 0), 1);
    }

    function testEmployerCanCreatePrivateTask() public {
        vm.prank(employer);
        solteria.createPrivateTask{value: 1 ether}(
            "QmIPFSIDPrivate",
            contractor
        );
        assertEq(solteria.balanceOf(address(solteriaTreasury), 0), 1);
    }

    function testEmployerCanApproveCompletedTask() public {
        vm.prank(employer);
        solteria.approveCompletedTask("QmIPFSID", contractor);
    }

    // Empolyer negative testcases
    function testFailEmployerCanCreateTaskNOVALUE() public {
        vm.prank(employer);
        solteria.createTask("QmIPFSID");
    }

    function testFailEmployerCanCreatePrivateTaskNOVALUE() public {
        vm.prank(employer);
        solteria.createPrivateTask("QmIPFSIDPrivate", contractor);
    }

    function testFailEmployerCanClaimTask() public {
        vm.prank(employer);
        solteria.claimTask("QmIPFSID");
        address[] memory claimers = solteria.getClaimers("QmIPFSID");
        assertEq(claimers[0], contractor);
    }

    // Contractor positive testcases
    function testContractorCanClaimTask() public {
        vm.prank(contractor);
        solteria.claimTask("QmIPFSID");
    }

    function testContractorCompleteTask() public {
        vm.prank(employer);
        solteria.createTask{value: 1 ether}("QmIPFSID");
        assertEq(solteria.balanceOf(address(solteriaTreasury), 0), 1);
        assertEq(solteria.balanceOf(contractor, 0), 0);

        vm.prank(contractor);
        solteria.claimTask("QmIPFSID");

        vm.prank(employer);
        solteria.approveCompletedTask("QmIPFSID", contractor);
        assertEq(solteria.balanceOf(address(solteriaTreasury), 0), 1);
        assertEq(solteria.balanceOf(contractor, 0), 0);

        vm.prank(contractor);
        solteria.completeTask("QmIPFSID");
        assertEq(solteria.balanceOf(address(solteriaTreasury), 0), 0);
        assertEq(solteria.balanceOf(contractor, 0), 1);
    }

    function testContractorCanClaimFunds() public {
        vm.prank(employer);
        solteria.createTask{value: 1 ether}("QmIPFSID");
        assertEq(solteria.balanceOf(address(solteriaTreasury), 0), 1);
        assertEq(solteria.balanceOf(contractor, 0), 0);

        vm.prank(contractor);
        solteria.claimTask("QmIPFSID");

        vm.prank(employer);
        solteria.approveCompletedTask("QmIPFSID", contractor);
        assertEq(solteria.balanceOf(address(solteriaTreasury), 0), 1);
        assertEq(solteria.balanceOf(contractor, 0), 0);

        vm.prank(contractor);
        solteria.completeTask("QmIPFSID");
        assertEq(solteria.balanceOf(address(solteriaTreasury), 0), 0);
        assertEq(solteria.balanceOf(contractor, 0), 1);

        vm.prank(contractor);
        solteria.claimFunds("QmIPFSID");
        assertEq(solteria.balanceOf(address(solteriaTreasury), 0), 0);
        assertEq(solteria.balanceOf(contractor, 0), 1);
    }

    function testContractorCanClaimFundsMultiple() public {
        vm.prank(employer);
        solteria.createTask{value: 1 ether}("QmIPFSID");
        assertEq(solteria.balanceOf(address(solteriaTreasury), 0), 1);
        assertEq(solteria.balanceOf(contractor, 0), 0);

        vm.prank(employer);
        solteria.createTask{value: 1 ether}("QmIPFSI2");

        vm.prank(employer);
        solteria.createTask{value: 1 ether}("QmIPFSID3");

        vm.prank(contractor);
        solteria.claimTask("QmIPFSID");

        vm.prank(contractor2);
        solteria.claimTask("QmIPFSID");

        vm.prank(contractor3);
        solteria.claimTask("QmIPFSID");

        vm.prank(contractor3);
        solteria.claimTask("QmIPFSID2");

        vm.prank(employer);
        solteria.approveCompletedTask("QmIPFSID", contractor);
        assertEq(solteria.balanceOf(address(solteriaTreasury), 0), 1);
        assertEq(solteria.balanceOf(contractor, 0), 0);

        vm.prank(contractor);
        solteria.completeTask("QmIPFSID");
        assertEq(solteria.balanceOf(address(solteriaTreasury), 0), 0);
        assertEq(solteria.balanceOf(contractor, 0), 1);

        vm.prank(contractor);
        solteria.claimFunds("QmIPFSID");
        assertEq(solteria.balanceOf(address(solteriaTreasury), 0), 0);
        assertEq(solteria.balanceOf(contractor, 0), 1);
    }

    function testContractorCanClaimFundsEmpolyerCanBurnMultiple() public {
        vm.prank(employer);
        solteria.createTask{value: 1 ether}("QmIPFSID");
        assertEq(solteria.balanceOf(address(solteriaTreasury), 0), 1);
        assertEq(solteria.balanceOf(contractor, 0), 0);

        vm.prank(contractor);
        solteria.claimTask("QmIPFSID");

        vm.prank(contractor2);
        solteria.claimTask("QmIPFSID");

        vm.prank(employer);
        solteria.deleteTask("QmIPFSID");
    }

    // Contractor negative testcases

    function testFailContractorCanClaimFundsNOCLAIM() public {
        vm.prank(employer);
        solteria.createTask{value: 1 ether}("QmIPFSID");
        assertEq(solteria.balanceOf(address(solteriaTreasury), 0), 1);
        assertEq(solteria.balanceOf(contractor, 0), 0);

        vm.prank(employer);
        solteria.approveCompletedTask("QmIPFSID", contractor);
        assertEq(solteria.balanceOf(address(solteriaTreasury), 0), 1);
        assertEq(solteria.balanceOf(contractor, 0), 0);

        vm.prank(contractor);
        solteria.completeTask("QmIPFSID");
        assertEq(solteria.balanceOf(address(solteriaTreasury), 0), 0);
        assertEq(solteria.balanceOf(contractor, 0), 1);

        vm.prank(contractor);
        solteria.claimFunds("QmIPFSID");
        assertEq(solteria.balanceOf(address(solteriaTreasury), 0), 0);
        assertEq(solteria.balanceOf(contractor, 0), 1);
    }

    // positive testcases - no roles required

    function testAnyoneCanListTasks() public {
        vm.prank(employer);
        solteria.createTask{value: 1 ether}("QmIPFSID");
        vm.prank(employer);
        solteria.createTask{value: 1 ether}("QmIPFSID2");
        vm.prank(employer);
        solteria.createTask{value: 1 ether}("QmIPFSID3");
        vm.prank(employer);
        solteria.createTask{value: 1 ether}("QmIPFSID4");
        vm.prank(employer);
        solteria.createTask{value: 1 ether}("QmIPFSID5");

        solteria.getTasks();
    }

    function testAnyoneCanListTasksAndGetStatus() public {
        vm.prank(employer);
        solteria.createTask{value: 1 ether}("QmIPFSID");
        vm.prank(employer);
        solteria.createTask{value: 1 ether}("QmIPFSID2");
        vm.prank(employer);
        solteria.approveCompletedTask("QmIPFSID2", contractor);
        vm.prank(employer);
        solteria.createTask{value: 1 ether}("QmIPFSID3");
        vm.prank(employer);
        solteria.createTask{value: 1 ether}("QmIPFSID4");
        vm.prank(employer);
        solteria.approveCompletedTask("QmIPFSID4", contractor);
        vm.prank(employer);
        solteria.createTask{value: 1 ether}("QmIPFSID5");

        solteria.getTasks();

        assertTrue(!solteria.getStatus("QmIPFSID"));
        assertTrue(solteria.getStatus("QmIPFSID2"));
        assertTrue(!solteria.getStatus("QmIPFSID3"));
        assertTrue(solteria.getStatus("QmIPFSID4"));
        assertTrue(!solteria.getStatus("QmIPFSID5"));
    }
}