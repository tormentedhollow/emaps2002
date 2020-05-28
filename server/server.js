const express = require('express');
const app = express();

var http = require('http').Server(app); // http server
var mysql = require('mysql'); // Mysql include
var async = require('async');
var bodyParser = require("body-parser"); // Body parser for fetch posted data

var path = require('path');
var fs = require('fs');
const multer = require('multer');
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

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("change dist here");
    cb(null, "./../bin");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + '.' + path.extname(file.originalname));
  }
});
let upload = multer({storage: storage});


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
  var q = "Select ps.desc, ctgry_desc, prjct_id, prjct_title, (x*1) as `lat`, (y*1) as `lng`, prjct_recipient, year_fndd, fund_src, cost,str,prjct_ctgry_id as ctgry_id, lctn_str ,SUBSTRING_INDEX(str, ', ', 1) as brgy ,SUBSTRING_INDEX(SUBSTRING_INDEX(str, ', ', 2),', ',-1) as mun ,SUBSTRING_INDEX(SUBSTRING_INDEX(str, ', ', 3),', ',-1) as prov from project AS p LEFT JOIN project_category AS pc ON p.prjct_ctgry_id = pc.ctgry_id LEFT JOIN project_subcategory AS ps ON p.prjct_ctgry_id = ps.ctgry_id AND p.sub_cat = ps.id order by pc.ctgry_id, p.sub_cat, prjct_id";
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

app.post('/getSubCat',function(req,res){
  var q = "SELECT * FROM `project_subcategory` order by ctgry_id,id";
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
    SELECT *  FROM location where geographic_level = "Prov" order by name,code;
    SELECT *  FROM location where geographic_level in ("Mun","City") order by name,code;
    SELECT *  FROM location where geographic_level = "Bgy" order by name,code;`;
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

app.post('/getStatus',function(req,res){
  var q = "SELECT * FROM `project_stats` where prjct_id = ? order by prjctsts_date desc, prjctsts_id asc";
  //var t = ["user", "tbl_province", "username", req.body.username, "password", req.body.password];
  var t = [req.body.id];
  q = mysql.format(q,t);
  //console.log("SELECT * FROM `project_stats` where prjct_id = "+req.id+" order by prjctsts_date, prjctsts_id")
  var data = {};
  connection.query(q,function(err, results, fields){
    if (err) throw err;
    // var testFolder = '../dist/assets/img/'; -- dist
    var testFolder = '../projects/angular-ngrx-material-starter/src/assets/img/';
    const fs = require('fs');
    if(results[0]!=undefined){
      testFolder = testFolder+results[0].prjctsts_imgs+"/";
      //console.log(testFolder);
      fs.readdir(testFolder, (err, files) => {
        if(files){
          console.log("files");
          var ctr=0;
          results[0].imgs=[];
          //console.log(files.length);
          if(files.length==0) res.json(results);
          else{
            files.forEach(file => {
            if(file.search(".jpg")!=-1||file.search(".jpeg")!=-1||file.search(".JPG")!=-1){
              results[0].imgs.push(file);
              console.log(file); // use those file and return it as a REST API
            }
            ctr++;
            if(ctr==files.length) res.json(results);
            });
          }
        
        }
        else{
          console.log("no files");
          res.json(results);}
      });
    }
    else{
      console.log("No Available Status");
      res.json(results);
    }
  });
});



app.post('/insertProject',function(req,res){
  var v = req.body.val;
  var q = "Insert into project (prjct_title, x,y, prjct_recipient, year_fndd, fund_src, cost, prjct_ctgry_id, lctn_str, str, sub_cat) values (?,?,?,?,?,?,?,?,?,?,?)";
  //var t = ["user", "tbl_province", "username", req.body.username, "password", req.body.password];
  q = mysql.format(q,[v.prct_title,v.lat, v.lng, v.recipient, v.year_fndd, v.fund_src,v.cost, v.prjct_ctgry_id, v.bar, v.str, v.sub_cat]);
  var data = {};
  connection.query(q,function(err, results, fields){
    if (err) throw err;
      res.json(results);
  });
});

// app.post('/getImg',function(req,res){
//   const testFolder = '../projects/angular-ngrx-material-starter/src/assets/img/DA13/ADN/Buenavista/Barangay Abilan/buenavista.abilan.mmai.pump and engine/Equipment - buena abilan';
//   const fs = require('fs');

//   fs.readdir(testFolder, (err, files) => {
//     files.forEach(file => {
//       console.log(file); // use those file and return it as a REST API
//     });
//   });
// });

app.post('/insertStatus',function(req,res){
  var v = req.body.val;
  var b = req.body;
  console.log(req.body);
  var q = "Insert into project_stats (prjctsts_date,physical_acc,unlqdtd_blnc,prjctsts_remarks,prjctsts_rcmmndtn,prjctsts_imgs,prjct_id) values (?,?,?,?,?,?,?)";
  q = mysql.format(q,[b.date,b.accomp,b.balance,b.remarks,b.analysis,v,b.prjct_id]);
  //var data = {};
  connection.query(q,function(err, results, fields){
    if (err) throw err;
      console.log(v);
      // var dir = './../dist/assets/img/'+v;  --dist
      var dir = '../projects/angular-ngrx-material-starter/src/assets/img/'+v;
      try{
        if (!fs.existsSync(dir)){
          fs.mkdirSync(dir, {recursive: true}, err => {console.log(err);});
        }

        this.storage = multer.diskStorage({
          destination: (req, file, cb) => {
            console.log("change dist here");
            //console.log(req.body);
            cb(null, dir);
          },
          filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now() + '.' + path.extname(file.originalname));
          }
        });
        this.upload = multer({storage: storage});
      }catch(err){
        console.log(err);
      }
      //console.log(upload.array);
      res.json(results);
  });
  
});
app.get('/api', function (req, res) {
  res.end('file upload');
});

/*app.post('/api/upload',upload.array('file',8), (req, res, next) =>{
  //const files = req.files;
  //console.log(req.body);
  if (!req.files) {
      console.log("Your request doesn’t have any file");
      return res.send({
        success: false
      });
  
    } else {
      console.log('Your file has been received successfully');
      return res.send({
        success: true
      })
    }
});*/

app.post('/api/upload', function(req, res, next){
  console.log('uploading---')
  console.log("291");
  console.log(req._parsedUrl.query);
  // var pointTo = './../dist/assets/img/'+ req._parsedUrl.query;
  var pointTo = '../projects/angular-ngrx-material-starter/src/assets/img/'+ req._parsedUrl.query;
  var storage = multer.diskStorage({
        destination: pointTo,
        /*function (req, file, cb) {
          console.log(req.body);
          cb(null, ('./../bin/') )
        },*/
        filename: function (req, file, cb) {
          cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
      })

  //var upload = multer({ dest: ('hidden/images/slip/' + req.body.classId) }).single('file')
  var upload = multer({ storage:storage }).array('file')
  console.log(upload)
  upload(req,res,function(err) {
      if(err) {
          return handleError(err, res);
      }
      console.log("done upload---")
      res.json({"status":"completed"});
  });
});