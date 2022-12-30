const express = require('express')
let app = express()
let path = require('path');
let fs = require('fs');
let bodyParser = require('body-parser')
let MongoClient = require('mongodb').MongoClient;

const port = 3001
console.log("env varaible is " + process.env.var)

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
let databaseName = "user-accounts";
// use when starting application locally
let mongoUrlLocal = "mongodb://admin:password@localhost:27017";

// use when starting application as docker container
let mongoUrlDocker = "mongodb://"+process.env.USERNAME+":"+process.env.PASSWORD+"@"+process.env.MONGODBURL;

// pass these options to mongo client connect request to avoid DeprecationWarning for current Server Discovery and Monitoring engine
let mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };


app.use(express.static(__dirname)); 
app.use('/images', express.static(__dirname));
app.get('/cat', (req, res) => {
  let response = {
    "var": process.env.var
  };
  console.log("env varaible is " + process.env.var)
  //res.send( response);
  //res.sendFile(path.join(__dirname, "index.html"));
  res.send('Hello World!')
})

app.get('/get-profile', function (req, res) {
  let response = {};
  // Connect to the db
  MongoClient.connect(mongoUrlDocker, mongoClientOptions, function (err, client) {
    if (err) throw err;

    let db = client.db(databaseName);

    let myquery = { userid: 1 };

    db.collection("users").findOne(myquery, function (err, result) {
      if (err) throw err;
      response = result;
      client.close();

      // Send response
      res.send(response ? response : {});
    });
  });
});


app.get('/getID', (req, res) => {
  let response = {
    "var": mongoUrlDocker
  };
  console.log("env varaible is " + process.env.var)
  res.send( response);
  //res.sendFile(path.join(__dirname, "index.html"));
  //res.send('Hello World!')
    //res.send('you requested for IDs!')
  })

  app.get('/update-profile', function (req, res) {
    //let userObj = req.body;
    console.log(req.query.name);
    let userObj = {
      name:req.query.name, //"xyz",
      email:req.query.email//"xyz@yahoo.com"

    };
  
    MongoClient.connect(mongoUrlDocker, mongoClientOptions, function (err, client) {
      if (err) throw err;
  
      let db = client.db(databaseName);
      userObj['userid'] = 1;
  
      let myquery = { userid: 1 };
      let newvalues = { $set: userObj };
  
      db.collection("users").updateOne(myquery, newvalues, {upsert: true}, function(err, res) {
        if (err) throw err;
        client.close();
      });
  
    });
    // Send response
    res.send(userObj);
  });

  app.get('/add-profile', function (req, res) {
    //let userObj = req.body;
    console.log(req.query.name);
    let userObj = {
      userid :req.query.id,
      name:req.query.name, //"xyz",
      email:req.query.email//"xyz@yahoo.com"

    };
  
    MongoClient.connect(mongoUrlDocker, mongoClientOptions, function (err, client) {
      if (err) throw err;
  
      let db = client.db(databaseName);
      //userObj['userid'] = 1;
  
      let myquery = { userid: 1 };
      let newvalues = { $set: userObj };
  
      db.collection("users").insertOne(userObj, {upsert: true}, function(err, res) {
        if (err) throw err;
        client.close();
      });
  
    });
    // Send response
    res.send(userObj);
  });
  


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})