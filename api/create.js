var express = require("express");
var fs = require('fs');
var app = express();
var axios = require('axios');
var chalk = require('chalk');
var cron = require('node-cron');
var edit = require('edit-json-file')
function createServer(){
app.listen(3000, () => {
 console.log("Server running on port 3000");
});
}
var d = new Date();
var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";
var currentMonth = month[d.getMonth()];

var content = {
  userId: 0
}
function createUser(){
app.get("/create/:userId", (req, res, next) => {
  var options = req.params.userId;
  var json = JSON.parse(options)
  var fileName = json.userId + ".json";
  function writeFile(content){
    var fileContent = JSON.stringify(content);
    fs.writeFile("../db/" + fileName, fileContent, (err) => {
             if (err) throw err;
             console.log(chalk.blue("user " + json.userId + " has been registed"))
          });
  }
  if (fs.existsSync("../db/" + fileName)){
    let file = edit(`${__dirname}/../db/` + fileName);
    var exising = fs.readFileSync("../db/" + fileName, 'utf8');
    var existingJson = JSON.parse(exising);
    console.log(existingJson.btc)
    if (typeof json.btc !== 'undefined' && typeof existingJson.btc == 'undefined'){
      var params = {symbol: "btc", api: "https://insight.bitpay.com/api/addr/" + json.btc + "/balance", name: "Bitcoin", address: json.btc}
      addAsset()
    } if (typeof json.ltc !== 'undefined' && typeof existingJson.ltc == 'undefined'){
      var params = {symbol: "ltc", api: "https://insight.litecore.io/api/addr/" + json.ltc + "/balance", name: "Litecoin", address: json.ltc}
      addAsset()
    } if (typeof json.dash !== 'undefined' && typeof existingJson.dash == 'undefined'){
      var params = {symbol: "dash", api: "https://insight.dash.org/insight-api-dash/addr/" + json.dash + "/balance", name: "dash", address: json.dash}
      addAsset()
    } if (typeof json.rvn !== 'undefined' && typeof existingJson.rvn == 'undefined'){
      var params = {symbol: "rvn", api: "https://ravencoin.network/api/addr/" + json.rvn + "/balance", name: "RavenCoin", address: json.rvn}
      addAsset()
    } if (typeof json.dyn !== 'undefined' && typeof existingJson.dyn == 'undefined'){
      var params = {symbol: "dyn", api: "https://insight.duality.solutions/api/addr/" + json.dyn + "/balance", name: "Dynamic", address: json.dyn}
      addAsset()
    } if (typeof json.xba !== 'undefined' && typeof existingJson.xba == 'undefined'){
      var params = {symbol: "xba", api: "https://explorer.bitcoinair.net/ext/getaddress/" + json.xba, name: "BitcoinAir", address: json.xba, ex: 1}
      addAsset()
    } if (typeof json.zec !== 'undefined' && typeof existingJson.zec == 'undefined'){
      var params = {symbol: "zec", api: "https://zcash.blockexplorer.com/api/addr/" + json.zec + "/balance", name: "ZCash", address: json.zec}
      addAsset()
    }
    function addAsset(){
      file.set(params.symbol);
      file.set(params.symbol + ".address", params.address);
      file.set(params.symbol + ".balances.January", 0);
      file.set(params.symbol + ".balances.February", 0);
      file.set(params.symbol + ".balances.March", 0);
      file.set(params.symbol + ".balances.April", 0);
      file.set(params.symbol + ".balances.May", 0);
      file.set(params.symbol + ".balances.June", 0);
      file.set(params.symbol + ".balances.July", 0);
      file.set(params.symbol + ".balances.August", 0);
      file.set(params.symbol + ".balances.September", 0);
      file.set(params.symbol + ".balances.October", 0);
      file.set(params.symbol + ".balances.November", 0);
      file.set(params.symbol + ".balances.December", 0);
      file.save();
      fs.readFile("../db/" + fileName, 'utf8', function read(err, data) {
      axios({
      method:'get',
      url: params.api
      })
      .then(function(response) {
        var j = JSON.parse(data)
        if (params.ex == 1){
          var balance = response.data.balance
        } else {
          var balance = response.data
        }
      j[params.symbol].balances[currentMonth] = balance;
      console.log(j)
      var a = JSON.stringify(j)
      fs.writeFile("../db/" + fileName, a, (err) => {
       console.log(chalk.green(params.name + " Added to user " + j.userId))
      })
    })
  })
}
  } else {
    /*var content = {
      userId: json.userId,
      btc: {},
      ltc: {}
    }*/
    content.userId = json.userId
    if (typeof json.btc !== 'undefined'){
      content.btc = {
        address: json.btc,
        balances: {
          January: 0,
          February: 0,
          March: 0,
          April: 0,
          May: 0,
          June: 0,
          July: 0,
          August: 0,
          September: 0,
          October: 0,
          November: 0,
          December: 0
        }
      }
}

if (typeof json.ltc !== 'undefined'){
  content.ltc = {
    address: json.ltc,
    balances: {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0
    }
  }
}
if (typeof json.dash !== 'undefined'){
  content.dash = {
    address: json.dash,
    balances: {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0
    }
  }
}
if (typeof json.rvn !== 'undefined'){
  content.rvn = {
    address: json.rvn,
    balances: {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0
    }
  }
}
if (typeof json.dyn !== 'undefined'){
  content.dyn = {
    address: json.dyn,
    balances: {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0
    }
  }
}
if (typeof json.xba !== 'undefined'){
  content.xba = {
    address: json.xba,
    balances: {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0
    }
  }
}
if (typeof json.zec !== 'undefined'){
  content.zec = {
    address: json.zec,
    balances: {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0
    }
  }
}
getBtcBalance(content);

function getBtcBalance(content){
axios({
method:'get',
url:"https://insight.bitpay.com/api/addr/" + json.btc + "/balance"
})
.then(function(response) {
console.log(chalk.green("Got Bitcoin Balance"))
content.btc.balances[currentMonth] = response.data;
getLtcBalance(content)
}).catch(function(response){
console.log(chalk.yellow("Failed to get Bitcoin Balance"))
getLtcBalance(content)
});
}

function getLtcBalance(content){
axios({
method:'get',
url:"https://insight.litecore.io/api/addr/" + json.ltc + "/balance"
})
.then(function(response) {
console.log(chalk.green("Got Litecoin Balance"))
content.ltc.balances[currentMonth] = response.data;
getDashBalance(content)
}).catch(function(response){
console.log(chalk.yellow("Failed to get Litecoin Balance"))
getDashBalance(content)
});
}

function getDashBalance(content){
axios({
method:'get',
url:"https://insight.dash.org/insight-api-dash/addr/" + json.dash + "/balance"
})
.then(function(response) {
console.log(chalk.green("Got Dash Balance"))
content.dash.balances[currentMonth] = response.data;
getRavenBalance(content)
}).catch(function(response){
console.log(chalk.yellow("Failed to get Dash Balance"))
getRavenBalance(content)
});
}

function getRavenBalance(content){
axios({
method:'get',
url:"https://ravencoin.network/api/addr/" + json.rvn + "/balance"
})
.then(function(response) {
console.log(chalk.green("Got Raven Balance"))
content.rvn.balances[currentMonth] = response.data;
getDynamicBalance(content)
}).catch(function(response){
console.log(chalk.yellow("Failed to get Raven Balance"))
getDynamicBalance(content)
});
}

function getDynamicBalance(content){
axios({
method:'get',
url:"https://insight.duailty.solutions/api/addr/" + json.dyn + "/balance"
})
.then(function(response) {
console.log(chalk.green("Got Dynamic Balance"))
content.dyn.balances[currentMonth] = response.data;
getBitcoinairBalance(content)
}).catch(function(response){
console.log(chalk.yellow("Failed to get Dynamic Balance"))
getBitcoinairBalance(content)
});
}

function getBitcoinairBalance(content){
axios({
method:'get',
url:"https://explorer.bitcoinair.net/ext/getaddress/" + json.xba
})
.then(function(response) {
console.log(chalk.green("Got Bitcoin Air Balance"))
var balance = response.data.balance
if (typeof balance == 'number'){
  content.xba.balances[currentMonth] = balance;
} else {
  content.xba.balances[currentMonth] = 0;
}
getZcashBalance(content)
}).catch(function(response){
console.log(chalk.yellow("Failed to get Bitcoin Air Balance"))
getZcashBalance(content)
});
}

function getZcashBalance(content){
axios({
method:'get',
url:"https://zcash.blockexplorer.com/api/addr/" + json.zec + "/balance",
})
.then(function(response) {
console.log(chalk.green("Got Zcash Balance"))
content.zec.balances[currentMonth] = response.data;
writeFile(content)
}).catch(function(response){
console.log(chalk.yellow("Failed to get Zcash Balance"))
writeFile(content)
});
}
}
});
}
module.exports = {
  create: createUser(),
  createServer: createServer()
}
