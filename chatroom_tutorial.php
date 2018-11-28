<?php
  include "template/head.php";
  include "template/top-menu.php";
?>

<div class="container" style="padding-top: 100px;">

    <h1> Chatroom Tutorial </h1>

    <h2>Installation Guide</h2>

    <p>In order to create your own Chatroom, follow these simple steps:</p>

    <ol>
        <li>
            <h4>Install NodeJS and NPM:</h4>
            <p> Begin by downloading/installing NodeJS from <a href="https://nodejs.org/en/">their website</a>. </p>
        </li>
        <li>
            <h4>Set Up Environment:</h4>
            <p> Go to your app folder and create 3 files: app.js, index.html, and package.json. </p>
            <p> Copy the following into package.json: </p>
            <div class="code-block">
                <xmp> {
                  "name": "chatroom-example",
                  "version": "0.0.1",
                  "description": "my first socket.io app",
                  "dependencies": {
                  },
                  "scripts": {
                    "start": "node server.js"
                  }
              } </xmp>
          </div>
        </li>
        <li>
            <h4>Install Express and Socket.io:</h4>
            <p> Go to the CLI/Terminal and type the following:</p>
            <div class="code-block">npm install --save express</div>
            <div class="code-block">npm install --save socket.io</div>
        </li>
        <li>
            <h4>Create app.js:</h4>
            <p> Insert the following code into app.js:</p>
            <div class="code-block">
                <xmp>
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

                //

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
              </xmp>
            </div>
        </li>
        <li>
            <h4>Create app.js:</h4>
            <p> Insert the following code into index.html:</p>
            <div class="code-block">
                <xmp>
                    <!doctype html>
                    <html>
                      <head>
                        <title>Socket.IO chat</title>
                        <style>
                          * { margin: 0; padding: 0; box-sizing: border-box; }
                          body { font: 13px Helvetica, Arial; }
                          form { background: #000; padding: 3px; position: fixed; bottom: 0; width: 100%; }
                          form input { border: 0; padding: 10px; width: 90%; margin-right: .5%; }
                          form button { width: 9%; background: rgb(130, 224, 255); border: none; padding: 10px; }
                          #messages { list-style-type: none; margin: 0; padding: 0; }
                          #messages li { padding: 5px 10px; }
                          #messages li:nth-child(odd) { background: #eee; }
                          #messages { margin-bottom: 40px }
                        </style>
                      </head>
                      <body>
                        <ul id="messages"></ul>
                        <form action="">
                          <input id="m" autocomplete="off" /><button>Send</button>
                        </form>
                        <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.7.4/socket.io.js"></script>
                        <script src="https://code.jquery.com/jquery-1.11.1.js"></script>
                        <script>
                          $(function () {
                            var socket = io();
                            $('form').submit(function(){
                              socket.emit('chat message', $('#m').val());
                              $('#m').val('');
                              return false;
                            });
                            socket.on('chat message', function(msg){
                              $('#messages').append($('<li>').text(msg));
                              window.scrollTo(0, document.body.scrollHeight);
                            });
                          });
                        </script>
                      </body>
                    </html>
                </xmp>
            </div>
        </li>

        <li>
            <h4>Finally, run it!</h4>
            <p> Now, execute the following in your Terminal: </p>
            <div class="code-block">
                node app.js
            </div>
            <p> Visit http://localhost:8080 in your browser and see your work!</p>
        </li>
    </ol>

</div>

<?php
    include "template/footer-menu.php";
    include "template/foot.php";
?>
