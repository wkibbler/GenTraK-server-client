var express = require("express");
var fs = require('fs');
var app = express();
var axios = require('axios');
var chalk = require('chalk');
var cron = require('node-cron');
app.listen(3000, () => {
 console.log("Server running on port 3000");
});
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
    null
  } else {
    var content = {
      userId: json.userId,
      btc: {},
      ltc: {}
    }

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
writeFile(content)
}).catch(function(response){
console.log(chalk.yellow("Failed to get Litecoin Balance"))
writeFile(content)
});
}
}
});

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
      rewriteFile(json)
      }).catch(function(response){
      console.log(chalk.red("There was an error re-getting Litecoin balance"))
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
});
