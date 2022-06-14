pragma solidity >=0.8.0 <0.9.0;

// Implementacion TFM Gerard Capdevila que simula una bombilla conectada

contract LightSensor {
  bool LEDturnedOn;
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
  function turnLightOff() external returns (bool){
    require(LEDturnedOn == true, "Light is OFF!");
    LEDturnedOn = false;
    return LEDturnedOn;
  }
}

