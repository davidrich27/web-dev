var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var url = require('url');
var fs = require('fs');
var mysql = require('mysql');
const { exec } = require('child_process');

var port = process.env.PORT || 8080;

var json_data = {};

// connection values for
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "***",
});

// Chatroom Socket Listener
io.on('connection', function(socket){
  console.log('listening on *:'+port);
  socket.broadcast.emit('hi');
  socket.on('chat message', function(msg){
    //console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

// Post data to MySQL DB
app.post('/data_add.php', function (req, res) {
    // connect to MySQL Server
    con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
      // Create Table if hasn't been created yet
      var sql = "CREATE TABLE IF NOT EXISTS person (id INT AUTO_INCREMENT PRIMARY KEY, fname VARCHAR(255), lname address VARCHAR(255), faveNum INT, msg VARCHAR(255))";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created!");
      });
      // Insert posted data
      var sql = `INSERT INTO person (fname, lname, faveNum, msg) VALUES (${newPerson.fname}, ${newPerson.lname}, ${newPerson.faveNum}, ${newPerson.msg})`;
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Data added to Table!");
      });
      // Output all data from table
      var sql = "SELECT * FROM person";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Output Table contents!");
        console.log(result);
        json_data = result;
        getFile(req, res);
      });
    });
});

// Get data from MySQL DB
app.get('/data_add.php', function (req, res) {
    // connect to MySQL Server
    con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
      // Retrieve all data from table
      var sql = "SELECT * FROM person";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Output Table contents!");
        console.log(result);
        // Output as json data
        json_data = result;
        getFile(req, res);
      });
    });
});

// All Routing passes through this...
app.get('*', function (req, res) {
  console.log("PROCESSING GET REQUEST...");
  getFile(req, res);
});

// Serve up File by Name
function getFile(req, res) {
    // parse the querystring
    var q = url.parse(req.url, true);
    //console.log(q);

    // get route from url, if url is blank => go to homepage
    filename = ".";
    if (q.pathname == "/") {
      filename += "/index.php";
    } else {
      filename += q.pathname;
    }

    // Find file on server, then...
    fs.readFile(filename, function (err, data) {
      console.log("LOOKING FOR "+filename);
      // If not found, send Error Code 404
      if (err) {
          console.log("NOT FOUND: "+filename);
          res.writeHead(404, {'Content-Type': 'text/html'});
          return res.end("404 Not Found");
      }
      // Else, Read File and send as Response
      else {
        console.log("serving "+filename+"...");
        // If css...
        if (filename.endsWith('.css'))  {
            console.log('THIS IS CSS!');
            //res.writeHead(200, {'Content-Type': 'text/css'});
            sendFile(req, res, data);
        }
        // If php...
        else if (filename.endsWith('.php') || filename.endsWith('.html')) {
            console.log("THIS IS PHP!");
            // run php via the command line
            var cmd = 'php '+filename;
            exec(cmd, function (err, stdout, stderr) {
                // send output as response
                data = stdout.toString('utf8');
                //res.writeHead(200, {'Content-Type': 'text/html'});
                sendFile(req, res, data, true);
            });
        }
        // If js...
        else if (filename.endsWith('.js')) {
            console.log('THIS IS JAVASCRIPT!');
            //res.writeHead(200, {'Content-Type': 'text/javascript'});
            sendFile(req, res, data);
        }
        // Otherwise...
        else {
            console.log('I DONT KNOW WHAT THIS IS!');
            //res.writeHead(200, {'Content-Type': 'text/html'});
            sendFile(req, res, data);
        }
      }
    });
}

// Inject JSON data and Send Response
function sendFile(req, res, data, inject) {
    // inject defults to false
    inject = (typeof var_name !== 'undefined') ?  var_name : false;
    if (inject) {
        data = insertDataIntoPage(data, json_data);
    }
    res.write(data);
    return res.end();
}

// insert JSON DATA into HTML
function insertDataIntoPage(file, json_data, var_name, to_replace) {
  // set default values
  var_name = (typeof var_name !== 'undefined') ?  var_name : 'data';
  to_replace = (typeof to_replace !== 'undefined') ?  to_replace : '//###INSERT_DATA_HERE###//';

  if (typeof file != "string") {
      file = file.toString('utf8');
  }
  //console.log(file);
  file = file.replace(to_replace, "var "+var_name+" = '"+JSON.stringify(json_data)+"';");
  return file;
}

// Open listening port
http.listen(port, function(){
  console.log('listening on *:' + port);
});
