<?php
  include "template/head.php";
  include "template/top-menu.php";
?>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font: 13px Helvetica, Arial; }
  form { background: #000; padding: 3px; position: fixed; bottom: 0; width: 100%; }
  form input { border: 0; padding: 10px; width: 90%; margin-right: .5%; }
  form button { width: 9%; background: rgb(130, 224, 255); border: none; padding: 10px; }
  #messages { list-style-type: none; margin: 0; padding: 0; margin-top: 0px; background-color: rgb(165, 235, 210); min-height: calc(100vh - 100px); }
  #messages li { padding: 5px 10px; }
  #messages li:nth-child(odd) { background: #eee; }
  #messages { margin-bottom: 40px }
</style>

<h1> Chatroom Example </h1>

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
      console.log("emitting message...");
      socket.emit('chat message', $('#m').val());
      $('#m').val('');
      return false;
    });
    socket.on('chat message', function(msg){
      console.log("recieving message...");
      $('#messages').append($('<li>').text(msg));
      window.scrollTo(0, document.body.scrollHeight);
    });
  });
</script>

<!-- Bootstrap core: JQuery, Popper.js, Bootstrap.js
================================================== -->
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
<!-- ============================================= -->
<!-- External Packages -->
<script type="text/javascript" src="packages/carhartl-jquery-cookie/jquery.cookie.js"></script>
<!-- Custom Scripts -->
<script type="text/javascript" src="script/main.js"></script>

<?php
    include "template/foot.php";
?>
