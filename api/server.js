// Module requirements
const express = require('express')
const mysql = require('mysql')
const mysqlConfig = require('./config.js');
const bodyParser = require("body-parser");

// DB Connection
const db = mysql.createConnection(mysqlConfig);
db.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

// HTTPD initiation
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.get('/', function(req, res){
  res.send("Hello world!");
});

app.get('/api/orders', function(req, res){
  if(req.query.status){
    var sql = "SELECT * FROM Orders WHERE Status = ?";
  } else {
    var sql = "SELECT * FROM Orders"
  }
  db.query(sql, [req.query.status], function (err, result){
    if (err){
      res.sendStatus(418);
      throw err;
    } else {
      res.send(result);
    };
  });
});

app.post('/api/kitchen/new', (req, res, next) => {
  let values = [];
  req.body['ctRoot'].forEach(order => {
    let value = [order['name'], order['phone'], order['pizzas'], 'new'];
    console.log(value);
    values.push(value);
  });
  db.query("INSERT INTO Orders (Name, Phone, Pizzas, Status) VALUES ?", [values], function (err, result){
    if (err){
      res.sendStatus(418);
      throw err;
    } else {
      res.sendStatus(200);
    };
  });
});

app.post('/api/kitchen/confirm', (req, res, next) => {
  let values = [];
  req.body['ctRoot'].forEach(order => {
    let value = [order['id']];
    values.push(value);
  });
  db.query("UPDATE Orders SET Status = 'paid' WHERE Id = ?", [values], function (err, result){
    if (err){
      res.sendStatus(418);
      throw err;
    } else {
      res.sendStatus(200);
    };
  });
});

app.post('/api/kitchen/confirm-oven', (req, res, next) => {
  let values = [];
  req.body['ctRoot'].forEach(order => {
    let value = [order['id']];
    values.push(value);
  });
  db.query("UPDATE Orders SET Status = 'cooking' WHERE Id = ?", [values], function (err, result){
    if (err){
      res.sendStatus(418);
      throw err;
    } else {
      res.sendStatus(200);
    };
  });
});

app.post('/api/kitchen/finish-oven', (req, res, next) => {
  let values = [];
  req.body['ctRoot'].forEach(order => {
    let value = [order['id']];
    values.push(value);
  });
  db.query("UPDATE Orders SET Status = 'finished' WHERE Id = ?", [values], function (err, result){
    if (err){
      res.sendStatus(418);
      throw err;
    } else {
      res.sendStatus(200);
    };
  });
});

app.post('/api/kitchen/hand-off', (req, res, next) => {
  req.body['ctRoot'].forEach(order => {
    db.query("INSERT INTO LogOrders SELECT Id, Name, Phone, Pizzas FROM Orders WHERE Id=?", [order.id], function (err, result){
      db.query("DELETE FROM Orders WHERE Id=?", [order.id], function (err, result){
        if (err){
          res.sendStatus(418);
          throw err;
        } else {
          res.sendStatus(200);
        };
      });
    });
  });
});

app.listen(3000);