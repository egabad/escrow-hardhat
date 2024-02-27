// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Escrow {
  address public arbiter;
  address public beneficiary;
  address public depositor;

  bool public isApproved;
  event Approved(uint);

  constructor(address _arbiter, address _beneficiary, address _depositor) payable {
    require(_arbiter != _beneficiary, "Arbiter and beneficiary have the same address");
    require(_arbiter != _depositor, "Arbiter and depositor have the same address");
    arbiter = _arbiter;
    beneficiary = _beneficiary;
    depositor = _depositor;
  }

  function approve() external {
    require(msg.sender == arbiter, "Sender is not the arbiter");
    require(!isApproved, "Contract is already approved");
    uint balance = address(this).balance;
    (bool sent, ) = payable(beneficiary).call{value: balance}("");
     require(sent, "Failed to send Ether");
    emit Approved(balance);
    isApproved = true;
  }
}
