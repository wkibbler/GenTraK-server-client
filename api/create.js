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
  userId: 0,
  btc: {},
  ltc: {}
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
    if (typeof json.btc !== 'undefined' && typeof existingJson.btc.balances == 'undefined'){
      file.set("btc.address", json.btc);
      file.set("btc.balances.January", 0);
      file.set("btc.balances.February", 0);
      file.set("btc.balances.March", 0);
      file.set("btc.balances.April", 0);
      file.set("btc.balances.May", 0);
      file.set("btc.balances.June", 0);
      file.set("btc.balances.July", 0);
      file.set("btc.balances.August", 0);
      file.set("btc.balances.September", 0);
      file.set("btc.balances.October", 0);
      file.set("btc.balances.November", 0);
      file.set("btc.balances.December", 0);
      file.save();
      //var a = fs.readFileSync("../db/" + fileName, 'utf8');
      fs.readFile("../db/" + fileName, 'utf8', function read(err, data) {
      axios({
      method:'get',
      url:"https://insight.bitpay.com/api/addr/" + json.btc + "/balance"
      })
      .then(function(response) {
        var j = JSON.parse(data)
      j.btc.balances[currentMonth] = response.data;
      console.log(j)
      var a = JSON.stringify(j)
      fs.writeFile("../db/" + fileName, a, (err) => {
       console.log(chalk.green("Bitcoin Added to user " + j.userId))
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
getBitcoinairBalance(content)
}).catch(function(response){
console.log(chalk.yellow("Failed to get Raven Balance"))
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
/*
app.get("/get/:userId", (req, res, next) => {
  var userId = req.params.userId;
  var fileName = userId + ".json";
  if (fs.existsSync("../db/" + fileName)){
    var fileJson = fs.readFileSync("../db/" + fileName, 'utf8');
    res.json(JSON.parse(fileJson))
  } else {
    res.send("user not registed")
  }
});

function getNewBalances(){
  fs.readdir("../db/", function(err, items) {
    items.forEach(file => {
      var fileJson = fs.readFileSync("../db/" + file, 'utf8');
      var json = JSON.parse(fileJson);
      updateBtc(json)
      function updateBtc(json){
      if (typeof json.btc !== 'undefined'){
        axios({
        method:'get',
        url:"https://insight.bitpay.com/api/addr/" + json.btc.address + "/balance"
        })
        .then(function(response) {
        console.log(chalk.green("Got Updated Bitcoin Balance"))
        json.btc.balances[currentMonth] = response.data;
        updateLtc(json)
        }).catch(function(response){
        console.log(chalk.red("There was an error re-getting bitcoin balance"))
        updateLtc(json)
        });
      }
    }
    function updateLtc(json){
    if (typeof json.ltc !== 'undefined'){
      axios({
      method:'get',
      url:"https://insight.litecore.io/api/addr/" + json.ltc.address + "/balance"
      })
      .then(function(response) {
      console.log(chalk.green("Got Updated Litecoin Balance"))
      json.ltc.balances[currentMonth] = response.data;
      updateDash(json)
      }).catch(function(response){
      console.log(chalk.red("There was an error re-getting Litecoin balance"));
      updateDash(json)
      });
    }
  }
  function updateDash(json){
  if (typeof json.dash !== 'undefined'){
    axios({
    method:'get',
    url:"https://insight.dash.org/insight-api-dash/addr/" + json.dash.address + "/balance"
    })
    .then(function(response) {
    console.log(chalk.green("Got Updated Dash Balance"))
    json.dash.balances[currentMonth] = response.data;
    updateRaven(json)
    }).catch(function(response){
    console.log(chalk.red("There was an error re-getting Dash balance"))
    updateRaven(json)
    });
  }
}
function updateRaven(json){
if (typeof json.rvn !== 'undefined'){
  axios({
  method:'get',
  url:"https://ravencoin.network/api/addr/" + json.rvn + "/balance"
  })
  .then(function(response) {
  console.log(chalk.green("Got Updated Ravencoin Balance"))
  json.rvn.balances[currentMonth] = response.data;
  updateDynamic(json)
  }).catch(function(response){
  console.log(chalk.red("There was an error re-getting Ravencoin balance"))
  updateDynamic(json)
  });
}
}
function updateDynamic(json){
if (typeof json.dyn !== 'undefined'){
  axios({
  method:'get',
  url:"https://insight.duality.solutions/api/addr/" + json.dyn + "/balance"
  })
  .then(function(response) {
  console.log(chalk.green("Got Updated Dynamic Balance"))
  json.dyn.balances[currentMonth] = response.data;
  updateBitcoinair(json)
  }).catch(function(response){
  console.log(chalk.red("There was an error re-getting Dynamic balance"));
  updateBitcoinair(json)
  });
}
}
function updateBitcoinair(json){
if (typeof json.xba !== 'undefined'){
  axios({
  method:'get',
  url:"https://explorer.bitcoinair.net/ext/getaddress/" + json.xba
  })
  .then(function(response) {
  console.log(chalk.green("Got Updated Bitcoin Air Balance"));
  var balance = response.data.balance;
  if (typeof balance == 'number'){
  json.xba.balances[currentMonth] = response.data;
} else {
  json.xba.balances[currentMonth] = 0;
}
  updateZcash(json)
  }).catch(function(response){
  console.log(chalk.red("There was an error re-getting Bitcoin Air balance"));
  updateZcash(json)
  });
}
}
function updateZcash(json){
if (typeof json.zec !== 'undefined'){
  axios({
  method:'get',
  url:"https://zcash.blockexplorer.com/api/addr/" + json.zec + "/balance"
  })
  .then(function(response) {
  console.log(chalk.green("Got Updated Zcash Balance"))
  json.zec.balances[currentMonth] = response.data;
  rewriteFile(json)
  }).catch(function(response){
  console.log(chalk.red("There was an error re-getting Zcash balance"));
  rewriteFile(json)
  });
}
}
    function rewriteFile(json){
      var jsonString = JSON.stringify(json);
    fs.writeFile("../db/" + file, jsonString, (err) => {
             if (err) throw err;
             console.log(chalk.blue(json.userId + " balances have been updated"))
          });
        }
    })
  });
}
cron.schedule('* * * * *', () => {
  console.log(chalk.blue("updating balances"));
  getNewBalances()
});*/
module.exports = {
  create: createUser(),
  createServer: createServer()
}
