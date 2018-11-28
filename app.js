var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var url = require('url');
var fs = require('fs');
var execPhp = require('exec-php');
const { exec } = require('child_process');

var port = process.env.PORT || 8080;

// Chatroom Socket Listener
io.on('connection', function(socket){
  console.log('listening on *:'+port);
  socket.broadcast.emit('hi');
  socket.on('chat message', function(msg){
    //console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

// Form
app.post('/data')

// All Routing passes through this...
app.get('*', function (req, res) {
  console.log("PROCESSING GET REQUEST...");

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
          res.write(data);
          return res.end();
      }
      // If php...
      else if (filename.endsWith('.php')) {
          console.log("THIS IS PHP!");
          // run php via the command line
          var cmd = 'php '+filename;
          exec(cmd, function (err, stdout, stderr) {
              // send output as response
              data = stdout.toString('utf8');
              //res.writeHead(200, {'Content-Type': 'text/html'});
              res.write(data);
              return res.end();
          });
      }
      // If js...
      else if (filename.endsWith('.js')) {
          console.log('THIS IS JAVASCRIPT!');
          //res.writeHead(200, {'Content-Type': 'text/javascript'});
          res.write(data);
          return res.end();
      }
      // Otherwise...
      else {
          console.log('I DONT KNOW WHAT THIS IS!');
          //res.writeHead(200, {'Content-Type': 'text/html'});
          res.write(data);
          return res.end();
      }
    }
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
