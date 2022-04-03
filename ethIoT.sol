contract lightSensor {
  bool LEDturnedOn;
  bool currentState;
  address owner;

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  // Constructor
  function isLightTurnedOn() public constant returns(bool){
    return LEDturnedOn;
  }

  function turnLightOn() public payable{
    if(msg.value < 1000 ){revert();}
    LEDturnedOn = true;
  }
  function turnLigthOff() public payable{
    LEDturnedOn = false;
  }

}

