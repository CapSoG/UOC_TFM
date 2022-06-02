
const lightSensor = artifacts.require("LightSensor");

module.exports = function(deployer) {
  deployer.deploy(lightSensor);
};
