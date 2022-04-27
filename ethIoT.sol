// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// This is a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract LightSensor {
  bool LEDturnedOn;
  bool currentState;
  address owner;

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  // Constructor
  function isLightTurnedOn() public view returns(bool){
    return LEDturnedOn;
  }

  function turnLightOn() external returns (bool){
    require(LEDturnedOn == false, "Light is ON!");
    LEDturnedOn = true;
    return LEDturnedOn;
  }
  function turnLigthOff() external returns (bool){
    require(LEDturnedOn == true, "Light is OFF!");
    LEDturnedOn = false;
    return LEDturnedOn;
  }
}
