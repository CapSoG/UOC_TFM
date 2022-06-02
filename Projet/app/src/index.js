import Web3 from "web3";
import lightsensorArtifact from "../../build/contracts/LightSensor.json";

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = lightsensorArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        lightsensorArtifact.abi,
        deployedNetwork.address,
        {transactionConfirmationBlocks: 3});

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
      // refresh address and status of the light bulb each time the page is reloaded.
      
      this.refreshAddress();
      this.refreshTransaction();
      this.isLightTurnedOn();
      
      this.interval = setInterval(() => {
      this.refreshAddress();
      this.isLightTurnedOn();
      this.refreshTransaction();
      }
      , 15000);
      
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },
  
   //@Refresh transaction sent once page reload or account addres is changed.
  refreshTransaction: async function(){
      const txStr = document.getElementById("txStr");
      try {
	      const block = await this.web3.eth.getBlock('pending');
      	      await new Promise(resolve => setTimeout(resolve, 10000));
	      const tx = await this.web3.eth.getTransactionReceipt(block.transactions[0]);
	      txStr.innerHTML = "<p>from: "+tx.from+"</p>"+"<p>to: "+tx.to+"</p>"+"<p>gas used: "+tx.gasUsed+"</p>"+"<p>Txhash: "+tx.transactionHash+"</p>"+"<p>status: "+tx.status+"</p>"+"<p>logs: "+tx.logs[0]+"</p>";
	      this.isLightTurnedOn();
      } catch (error) {
      	console.error("Could not print the transaction id");
      } 
  },
  
   //@dev refresh address account when call.
  refreshAddress: async function() {
	  const account= document.getElementsByClassName("account")[0];

	  if (ethereum.selectedAddress ==null){
	  	account.innerText = 'Not Active, connect Metamask address...';
	  } else {
	  	account.innerText = await this.meta.currentProvider.request({ method: 'eth_accounts' });
	  }
  },
  
  turnLightOff: async function(){
  try {
	const {turnLightOff} =  this.meta.methods;
	await turnLightOff().send({from: this.account});
  } catch (error){
  	this.setStatus("No access to the LED light: " + error.message);
  	console.error("Could not access to the LED light: ", error);
  }
  },
  
   turnLightOn: async function(){
   try {
	const {turnLightOn} =  this.meta.methods;
	await turnLightOn().send({from: this.account});
  } catch (error){
  	this.setStatus("No access to the LED light: " + error.message);
  	console.error("Could not access to the LED light: ", error);
  }
  },
  
   isLightTurnedOn: async function() {
     const { isLightTurnedOn } = this.meta.methods;
     const status = document.getElementsByClassName("lightStatus")[0];
     let status_var = await isLightTurnedOn().call();
     if (status_var == true){
     	status.innerText = 'Encendida'
     }else{
     	status.innerText = 'Apagada'
     }
     
  },
  

  //to show messages
  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerText = message;
  },  

};


window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
    
    
        //Detect when address change and update info thru window reloading
    window.ethereum.on('accountsChanged', function (accounts) {
	window.location.reload();
	//Call refresh address to avoid not printing when need it.
	this.refreshAddress();
      });
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  App.start();
});
