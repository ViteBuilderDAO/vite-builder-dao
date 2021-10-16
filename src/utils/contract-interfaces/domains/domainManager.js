
// Initiate a migration
//var Migrations = artifacts.require("@/contracts/domains/Migrations.solpp");
//
//module.exports = function(deployer)
//{
//  deployer.deploy(Migrations);
//};

// Deploy the new migrated contract
//const dns = artifacts.require("DNS");
//const ownable = artifacts.require("Ownable");
//
//module.exports = function(deployer) {
//    deployer.deploy(ownable);
//    //deployer.link(ownable, dns);
//    deployer.deploy(dns);
//};


//<h1>DNS Contract interface</h1>
//<h2>Account Details</h2>
//<p>Current Account:</p>
//<pre id="currentAccount"></pre>
//
//<p>List of Owned Names:</p>
//<pre id="output"></pre>
//<p>======</p>
//<h2>Functions</h2>
//
//<p>======</p>
//<p>Takes Name:</p>
//<input id="ClaimNewNameinput" type="text">
//<button id="ClaimNewNamebutton">Claim New Name</button>
//<p>======</p>
//
//<p>Takes Name:</p>
//<input id="setNamesIPAddressinput" type="text">
//<p></p>
//<p>Takes IP Address:</p>
//<input id="setNamesIPAddressinput2" type="text">
//<button id="setNamesIPAddressbutton">set Name's IP Address</button>
//<p>======</p>
//
//<p>Takes Name:</p>
//<input id="viewNamesIPAddressinput" type="text">
//<button id="viewNamesIPAddressbutton">view Name's IP Address</button>
//<pre id="viewNamesIPAddressOutput"></pre>
//
//<script>
//
//    //
//    //  Set up contract / web3
//    //
//
//    var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
//    web3.eth.defaultAccount = web3.eth.accounts[0];
//
//    var dnsContract = web3.eth.contract([{"constant":false,"inputs":[],"name":"breakCircuit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"listNamesOwnedBy","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"}],"name":"acceptPrivateOffer","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_address","type":"string"}],"name":"setNamesIPAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_address","type":"address"},{"name":"_wei","type":"uint256"}],"name":"makeNamePrivatlyOffered","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"}],"name":"makeNameNotOffered","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"uint256"}],"name":"getNameByID","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_receiver","type":"address"}],"name":"transferOwnershipForFree","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"}],"name":"claimNewName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"}],"name":"acceptPublicOffer","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"viewNamesIPAddress","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_wei","type":"uint256"}],"name":"makeNamePubliclyOffered","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"accountAddress","type":"address"},{"indexed":false,"name":"acquiredString","type":"string"}],"name":"NewNameClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"IPAddress","type":"string"}],"name":"NamesIPAddressChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"newOwner","type":"address"}],"name":"OwnershipTransfered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}], { gas: 100});
//    var dns = dnsContract.at('0x44cc85ac462280deba630e3f9e4a54dbb68800e1');
//
//
//    //
//    //link variables to html
//    //
//
//    // dns.acceptPublicOffer("test", (err,res) => {
//    //     if(!err){
//    //         console.log(res)
//    //     }
//    //     console.log(err)
//    // });
//
//
//    //current account
//    var currentAccount = document.getElementById('currentAccount');
//    currentAccount.innerHTML = dns._eth.coinbase;
//
//    //ClaimNewName options
//    var ClaimNewNameinput = document.getElementById('ClaimNewNameinput');
//    var ClaimNewNamebutton = document.getElementById('ClaimNewNamebutton');
//    var output = document.getElementById('output');
//
//    //setNamesIPAddress
//    var setNamesIPAddressinput = document.getElementById('setNamesIPAddressinput');
//    var setNamesIPAddressinput2 = document.getElementById('setNamesIPAddressinput2');
//    var setNamesIPAddressbutton = document.getElementById('setNamesIPAddressbutton');
//
//    //viewNamesIPAddress
//    viewNamesIPAddressinput =  document.getElementById('viewNamesIPAddressinput');
//    viewNamesIPAddressbutton = document.getElementById('viewNamesIPAddressbutton');
//    viewNamesIPAddressOutput = document.getElementById('viewNamesIPAddressOutput');
//
//    //
//    //  Button Event Listeners
//    //
//
//    viewNamesIPAddressbutton.addEventListener('click', function() {
//        viewNamesIPAddressOutput.innerHTML = dns.viewNamesIPAddress(viewNamesIPAddressinput.value);
//    });
//
//    ClaimNewNamebutton.addEventListener('click', function() {
//        dns.claimNewName(ClaimNewNameinput.value);
//        updateListOfOwnedNames();
//    });
//
//    setNamesIPAddressbutton.addEventListener('click', function() {
//        dns.setNamesIPAddress(setNamesIPAddressinput.value, setNamesIPAddressinput2.value);
//    });
//
//    //
//    //  functions
//    //
//
//    function updateListOfOwnedNames(){
//        var ownedItems = dns.listNamesOwnedBy();
//        output.innerHTML = "";
//        for(var i = 0; i < ownedItems.length; i++){
//            output.innerHTML += dns.getNameByID(i);
//            output.innerHTML += " ";
//        }
//    }
//
//
//    //
//    // start of main?
//    //
//    updateListOfOwnedNames()
//</script>
//</body>
//</html>