const express = require('express');
const app = express();

var http = require('http').Server(app); // http server
var mysql = require('mysql'); // Mysql include
var async = require('async');
var bodyParser = require("body-parser"); // Body parser for fetch posted data

var path = require('path');
var fs = require('fs');
var staticRoot = __dirname + '/../dist';


//  var db_config = {
//     host     : 'sql223.main-hosting.eu',
//     user     : 'u354835316_root',
//     password : 'September12',
//     database : 'u354835316_saad',
//     multipleStatements: true
//  }

var db_config = {
  host     : '172.16.130.10',
  user     : 'pmis',
  password : 'pmis',
  database : 'gis',
  multipleStatements: true
}

 function handleDisconnect() {
    connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                    // the old one cannot be reused.

    connection.connect(function(err) {              // The server is either down
      if(err) {                                     // or restarting (takes a while sometimes).
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
      }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
      console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        handleDisconnect();                         // lost due to either server restart, or a
      } else {                                      // connnection idle timeout (the wait_timeout
        throw err;                                  // server variable configures this)
      }
    });
  }

handleDisconnect();

http.listen(6277,function(){
    console.log("All right ! I am alive at Port 6277.");
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Body parser use JSON data

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.static(staticRoot));

app.get('/', function (req, res) {
    res.sendFile(path.join(staticRoot,'index.html'))
});

app.get('*', function (req, res) {
    res.sendFile(path.join(staticRoot,'index.html'));
});


app.post('/project',function(req,res){
  var q = "Select prjct_id, prjct_title, (x*1) as `lat`, (y*1) as `lng`, prjct_recipient, year_fndd, fund_src, cost,str,prjct_ctgry_id as ctgry_id, lctn_str from project order by prjct_id";
  //var t = ["user", "tbl_province", "username", req.body.username, "password", req.body.password];
  q = mysql.format(q,"");
  var data = {};
  connection.query(q,function(err, results, fields){
    if (err) throw err;
      res.json(results);
  });
});

app.post('/getYear',function(req,res){
  var q = "SELECT distinct year_fndd FROM `project` order by year_fndd";
  //var t = ["user", "tbl_province", "username", req.body.username, "password", req.body.password];
  q = mysql.format(q,"");
  var data = {};
  connection.query(q,function(err, results, fields){
    if (err) throw err;
      res.json(results);
  });
});

app.post('/getCategory',function(req,res){
  var q = "SELECT * FROM `project_category` order by ctgry_id";
  //var t = ["user", "tbl_province", "username", req.body.username, "password", req.body.password];
  q = mysql.format(q,"");
  var data = {};
  connection.query(q,function(err, results, fields){
    if (err) throw err;
      res.json(results);
  });
});

app.post('/getLocs',function(req,res){
  var item = req.body.item;
  var query = `SELECT *  FROM location where geographic_level = "Reg";
    SELECT *  FROM location where geographic_level = "Prov" order by code;
    SELECT *  FROM location where geographic_level in ("Mun","City") order by code;
    SELECT *  FROM location where geographic_level = "Bgy" order by code;`;
  var data = [];
  query = mysql.format(query,data);
  //console.log(query); 
  connection.query(query, function (error, results) {
    if (error) throw error;
    res.json(results); 
  });
});

app.post('/getIc',function(req,res){
  var q = "SELECT * FROM `ic` order by id";
  //var t = ["user", "tbl_province", "username", req.body.username, "password", req.body.password];
  q = mysql.format(q,"");
  var data = {};
  connection.query(q,function(err, results, fields){
    if (err) throw err;
      res.json(results);
  });
});