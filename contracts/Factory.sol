//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Escrow.sol";

contract Factory {
  Escrow[] public EscrowArray;
  event EscrowCreated(
    Escrow escrow,
    address indexed arbiter,
    address indexed beneficiary,
    address indexed depositor,
    uint256 deposit
  );

  function createEscrowContract(address _arbiter, address _beneficiary) public payable {
    Escrow escrow = (new Escrow){ value: msg.value }(_arbiter, _beneficiary, msg.sender);
    EscrowArray.push(escrow);
    emit EscrowCreated(escrow, _arbiter, _beneficiary, msg.sender, msg.value);
  }
}